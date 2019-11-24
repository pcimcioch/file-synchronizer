class RemoteCallsHandler {

  /**
   * @type {LocalFilesystem}
   * @private
   */
  _localFilesystem = null;

  /*** @param {LocalFilesystem} localFilesystem*/
  constructor(localFilesystem) {
    this._localFilesystem = localFilesystem;
  }

  /**
   * @param {Object} request
   * @returns {Promise<Object>}
   */
  handle(request) {
    switch (request.type) {
      case 'list-stores':
        return this._listStores();
      default:
        return this._error(request.type);
    }
  }

  /**
   * @returns {Promise<Object>}
   * @private
   */
  _listStores() {
    return new Promise((resolve) => {
      const stores = this._localFilesystem.stores;
      resolve({
        stores: stores.map(s => {
          return {
            id: s.id,
            name: s.name}
        })
      });
    });
  }

  /**
   * @param {String} type
   * @returns {Promise<Object>}
   * @private
   */
  _error(type) {
    return new Promise((resolve, reject) => {
      reject({
        error: 'Request type ' + type + ' not found'
      });
    });
  }
}