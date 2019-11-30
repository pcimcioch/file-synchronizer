function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * @param {Uint8Array} ba
 * @returns {WordArray}
 */
function byteArrayToWordArray(ba) {
  let wa = [];
  let i;

  for (i = 0; i < ba.length; i++) {
    wa[(i / 4) | 0] |= ba[i] << (24 - 8 * i);
  }

  return CryptoJS.lib.WordArray.create(wa, ba.length);
}

/**
 * @param {Blob} file
 * @param {Function} [progressCallback]
 * @returns {Promise<string>}
 */
export function getMD5(file, progressCallback) {
  const md5 = CryptoJS.algo.MD5.create();
  const writableStream = new WritableStream({
    iteration: 0,
    processed: 0,
    total: file.size,

    async write(chunk) {
      md5.update(byteArrayToWordArray(chunk));
      this.iteration++;
      this.processed += chunk.length;
      if (this.iteration % 128 === 0) {
        if (progressCallback && this.iteration % 512 === 0) progressCallback({processed: this.processed, total: this.total});
        await sleep(1);
      }
    }
  });

  return file.stream().pipeTo(writableStream).then(() => md5.finalize().toString(CryptoJS.enc.Hex));
}

/*** @returns {string}*/
export function uuid4() {
  function hex (s, b) {
    return s +
      (b >>> 4   ).toString (16) +  // high nibble
      (b & 0b1111).toString (16);   // low nibble
  }

  let r = crypto.getRandomValues (new Uint8Array (16));

  r[6] = r[6] >>> 4 | 0b01000000; // Set type 4: 0100
  r[8] = r[8] >>> 3 | 0b10000000; // Set variant: 100

  return r.slice ( 0,  4).reduce (hex, '' ) +
    r.slice ( 4,  6).reduce (hex, '-') +
    r.slice ( 6,  8).reduce (hex, '-') +
    r.slice ( 8, 10).reduce (hex, '-') +
    r.slice (10, 16).reduce (hex, '-');
}
