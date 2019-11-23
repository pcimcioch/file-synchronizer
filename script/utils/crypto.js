function byteArrayToWordArray(ba) {
  let wa = [];
  let i;

  for (i = 0; i < ba.length; i++) {
    wa[(i / 4) | 0] |= ba[i] << (24 - 8 * i);
  }

  return CryptoJS.lib.WordArray.create(wa, ba.length);
}

function getMD5(file, progressCallback) {
  return new Promise((resolveWhole, rejectWhole) => {
    const md5 = CryptoJS.algo.MD5.create();
    const queuingStrategy = new CountQueuingStrategy({ highWaterMark: 1 });
    const total = file.size;
    let processed = 0;

    const writableStream = new WritableStream({
      write(chunk) {
        return new Promise((resolve, reject) => {
          md5.update(byteArrayToWordArray(chunk));
          processed += chunk.length;
          if (progressCallback) {
            progressCallback({processed: processed, total: total});
          }
          resolve();
        });
      },
      close() {
        const hash = md5.finalize();
        const hashHex = hash.toString(CryptoJS.enc.Hex);
        resolveWhole(hashHex);
      },
      abort(err) {
        rejectWhole(err);
      }
    }, queuingStrategy);

    file.stream().pipeTo(writableStream);
  });
}
