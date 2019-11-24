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
   * @type {FileSystemDirectoryHandle}
   * @private
   */
  _fileHandle = null;

  /**
   * @param {boolean} isFile
   * @param {boolean} isDirectory
   * @param {string} name
   * @param {number} size
   * @param {number} lastModified
   * @param {FileSystemDirectoryHandle} fileHandle
   */
  constructor(isFile, isDirectory, name, size, lastModified, fileHandle) {
    this.isFile = isFile;
    this.isDirectory = isDirectory;
    this.name = name;
    this.size = size;
    this.lastModified = lastModified;
    this._fileHandle = fileHandle;
  }

  /**
   *
   * @param {FileSystemDirectoryHandle} fileHandle
   * @returns {Promise<LocalFile>}
   */
  static build(fileHandle) {
    return new Promise((resolve, reject) => {
      if (fileHandle.isFile) {
        fileHandle.getFile().then(file => resolve(new LocalFile(
          fileHandle.isFile,
          fileHandle.isDirectory,
          fileHandle.name,
          file.size,
          file.lastModified,
          fileHandle
        ))).catch(err => reject(err));
      } else {
        resolve(new LocalFile(
          fileHandle.isFile,
          fileHandle.isDirectory,
          fileHandle.name,
          0,
          0,
          fileHandle
        ));
      }
    });
  }

  getEntries() {
    return new Promise((resolve, reject) => {

    });
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
   * @returns {Promise<null>}
   */
  addStore(fileHandle) {
    return new Promise((resolve, reject) => {
      LocalFile.build(fileHandle).then(localFile => {
        this.stores.push({
          id: uuid4(),
          name: localFile.name,
          fileHandle: localFile
        });
        resolve();
      }).catch(err => reject(err));
    });
  }

  /*** @param {string} id*/
  removeStore(id) {
    this.stores = this.stores.filter(s => s.id !== id);
  }
}