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
   * @param {boolean} isFile
   * @param {boolean} isDirectory
   * @param {string} name
   * @param {number} size
   * @param {number} lastModified
   * @param {Connection} connection
   * @param {string} storeId
   */
  constructor(isFile, isDirectory, name, size, lastModified, connection, storeId) {
    this.isFile = isFile;
    this.isDirectory = isDirectory;
    this.name = name;
    this.size = size;
    this.lastModified = lastModified;
    this._storeId = storeId;
    this._connection = connection;
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

  /*** @returns {Promise<null>}*/
  refreshStores() {
    return new Promise((resolve, reject) => {
      this._connection.sendRequest({
        type: 'list-stores'
      }).then(response => {
        this.stores = response.stores.map(store => {
          return {
            id: store.id,
            name: store.name,
            fileHandle: new RemoteFile(
              store.file.isFile,
              store.file.isDirectory,
              store.file.name,
              store.file.size,
              store.file.lastModified,
              this._connection,
              store.id)
          }
        });
        resolve();
      }).catch(error => reject(error));
    });
  }
}