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
 * @returns {Promise<string>}
 */
function getMD5(file) {
  const md5 = CryptoJS.algo.MD5.create();
  const writableStream = new WritableStream({
    write(chunk) {
      md5.update(byteArrayToWordArray(chunk));
    }
  });

  return file.stream().pipeTo(writableStream).then(() => md5.finalize().toString(CryptoJS.enc.Hex));
}

/*** @returns {string}*/
function uuid4() {
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
