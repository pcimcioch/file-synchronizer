class LocalFile {
  /**
   * @type {FileSystemDirectoryHandle}
   * @private
   */
  _fileHandle = null;

  /*** @param {FileSystemDirectoryHandle} fileHandle*/
  constructor(fileHandle) {
    this._fileHandle = fileHandle;
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

  /*** @param {FileSystemDirectoryHandle} fileHandle*/
  addStore(fileHandle) {
    this.stores.push({
      id: uuid4(),
      name: fileHandle.name,
      fileHandle: new LocalFile(fileHandle)
    });
  }

  /*** @param {string} id*/
  removeStore(id) {
    this.stores = this.stores.filter(s => s.id !== id);
  }
}