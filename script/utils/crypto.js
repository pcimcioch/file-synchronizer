function byteArrayToWordArray(ba) {
  let wa = [];
  let i;

  for (i = 0; i < ba.length; i++) {
    wa[(i / 4) | 0] |= ba[i] << (24 - 8 * i);
  }

  return CryptoJS.lib.WordArray.create(wa, ba.length);
}

function getMD5(file) {
  return new Promise((resolve, reject) => {
    const md5 = CryptoJS.algo.MD5.create();

    const writableStream = new WritableStream({
      write(chunk) {
        md5.update(byteArrayToWordArray(chunk));
      },
      close() {
        const hash = md5.finalize();
        const hashHex = hash.toString(CryptoJS.enc.Hex);
        resolve(hashHex);
      },
      abort(err) {
        reject(err);
      }
    });

    file.stream().pipeTo(writableStream);
  });
}
