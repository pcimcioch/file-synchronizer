class RemoteFile {
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
   * @param {Connection} connection
   * @param {string} storeId
   */
  constructor(connection, storeId) {
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
        this.stores = response.stores.map(s => {
          return {
            id: s.id,
            name: s.name,
            fileHandle: new RemoteFile(this._connection, s.id)
          }
        });
        resolve();
      }).catch(error => reject(error));
    });
  }
}