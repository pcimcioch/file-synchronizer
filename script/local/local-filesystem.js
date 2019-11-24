class LocalFile {

  /*** @type {boolean}*/
  isFile = false;
  /*** @type {boolean}*/
  isDirectory = false;
  /*** @type {string}*/
  name = '';
  /*** @type {number}*/
  size = 0;
  /*** @type {number}*/
  lastModified = 0;

  /**
   * @type {FileSystemHandle}
   * @private
   */
  _fileHandle = null;
  /**
   * @type {?File}
   * @private
   */
  _file = null;

  /**
   * @param {boolean} isFile
   * @param {boolean} isDirectory
   * @param {string} name
   * @param {number} size
   * @param {number} lastModified
   * @param {FileSystemHandle} fileHandle
   * @param {?File} file
   */
  constructor(isFile, isDirectory, name, size, lastModified, fileHandle, file) {
    this.isFile = isFile;
    this.isDirectory = isDirectory;
    this.name = name;
    this.size = size;
    this.lastModified = lastModified;
    this._fileHandle = fileHandle;
    this._file = file;
  }

  /**
   * @param {FileSystemHandle} fileHandle
   * @returns {Promise<LocalFile>}
   */
  static async build(fileHandle) {
    if (fileHandle.isDirectory) {
      return new LocalFile(
        fileHandle.isFile,
        fileHandle.isDirectory,
        fileHandle.name,
        0,
        0,
        fileHandle,
        null
      );
    }
    const file = await fileHandle.getFile();
    return new LocalFile(
      fileHandle.isFile,
      fileHandle.isDirectory,
      fileHandle.name,
      file.size,
      file.lastModified,
      fileHandle,
      file
    );
  }

  /*** @returns {Promise<[LocalFile]>}*/
  async getEntries() {
    const files = [];
    for await (const entry of this._fileHandle.getEntries()) {
      const localFile = await LocalFile.build(entry);
      files.push(localFile);
    }

    return files;
  }

  /*** @returns {Promise<string>}*/
  async getMd5() {
    return await getMD5(this._file);
  }
}

class LocalFilesystem {
  /**
   * @typedef {Object<string, Object>} Store
   * @property {string} id
   * @property {string} name
   * @property {LocalFile} fileHandle
   */
  /*** @type {Array<Store>}*/
  stores = [];

  /**
   * @param {FileSystemDirectoryHandle} fileHandle
   * @returns {Promise<void>}
   */
  async addStore(fileHandle) {
    const localFile = await LocalFile.build(fileHandle);
    this.stores.push({
      id: uuid4(),
      name: localFile.name,
      fileHandle: localFile
    });
  }

  /*** @param {string} id*/
  removeStore(id) {
    this.stores = this.stores.filter(s => s.id !== id);
  }
}