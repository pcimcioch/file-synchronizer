class RemoteFile {
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
   * @type {string}
   * @private
   */
  _storeId = '';
  /**
   * @type {Connection}
   * @private
   */
  _connection = null;
  /**
   * @type {string[]}
   * @private
   */
  _path = [];

  /**
   * @param {boolean} isFile
   * @param {boolean} isDirectory
   * @param {string} name
   * @param {number} size
   * @param {number} lastModified
   * @param {string[]} path
   * @param {Connection} connection
   * @param {string} storeId
   */
  constructor(isFile, isDirectory, name, size, lastModified, path, connection, storeId) {
    this.isFile = isFile;
    this.isDirectory = isDirectory;
    this.name = name;
    this.size = size;
    this.lastModified = lastModified;
    this._path = path;
    this._storeId = storeId;
    this._connection = connection;
  }

  /**
   * @param {Object} obj
   * @param {string[]} path
   * @param {Connection} connection
   * @param {string} storeId
   * @returns {RemoteFile}
   */
  static fromObject(obj, path, connection, storeId) {
    return new RemoteFile(
      obj.isFile,
      obj.isDirectory,
      obj.name,
      obj.size,
      obj.lastModified,
      path,
      connection,
      storeId);
  }

  /*** @returns {Promise<RemoteFile[]>}*/
  async getEntries() {
    const response = await this._connection.sendRequest({
      type: 'get-entries',
      storeId: this._storeId,
      path: this._path.concat(this.name)
    });
    return response.entries.map(entry => RemoteFile.fromObject(entry, this._path.concat(this.name), this._connection, this._storeId));
  }

  async getMd5() {
    const response = await this._connection.sendRequest({
      type: 'get-md5',
      storeId: this._storeId,
      path: this._path.concat(this.name)
    });
    return response.md5;
  }
}

class RemoteFilesystem {

  /*** @type {string}*/
  id = '';
  /**
   * @typedef {Object<string, Object>} RemoteStore
   * @property {string} id
   * @property {string} name
   * @property {RemoteFile} fileHandle
   */
  /*** @type {Array<RemoteStore>}*/
  stores = [];

  /**
   * @type {Connection}
   * @private
   */
  _connection = null;

  /*** @param {Connection} connection*/
  constructor(connection) {
    this.id = uuid4();
    this._connection = connection;
  }

  /*** @returns {Promise<void>}*/
  async refreshStores() {
    const response = await this._connection.sendRequest({
      type: 'list-stores'
    });

    this.stores = response.stores.map(store => {
      return {
        id: store.id,
        name: store.name,
        fileHandle: RemoteFile.fromObject(store.file, [], this._connection, store.id)
      }
    });
  }
}