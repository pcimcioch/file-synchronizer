export class RemoteCallsHandler {

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
   * @param {?Function} partialResponseCallback
   * @returns {Promise<Object>}
   */
  handle(request, partialResponseCallback) {
    switch (request.type) {
      case 'list-stores':
        return this._listStores();
      case 'get-entries':
        return this._getEntries(request.storeId, request.path);
      case 'get-md5':
        return this._getMd5(request.storeId, request.path, partialResponseCallback);
      default:
        return this._error(request.type);
    }
  }

  /**
   * @returns {Promise<Object>}
   * @private
   */
  async _listStores() {
    const stores = this._localFilesystem.stores;
    return {
      stores: stores.map(store => {
        return {
          id: store.id,
          name: store.name,
          file: this._fileHandleToFile(store.fileHandle)
        };
      })
    };
  }

  /**
   * @param {string} storeId
   * @param {string[]} path
   * @returns {Promise<{entries: *}>}
   * @private
   */
  async _getEntries(storeId, path) {
    const fileHandle = await this._getDirectory(storeId, path);

    try {
      const entries = await fileHandle.getEntries();
      return {
        entries: entries.map(entry => this._fileHandleToFile(entry))
      };
    } catch (e) {
      console.log(e);
      throw 'Cannot list entries in directory cause of: ' + e.message;
    }
  }

  /**
   * @param {string} storeId
   * @param {string[]} path
   * @param {?Function} partialResponseCallback
   * @returns {Promise<{md5: *}>}
   * @private
   */
  async _getMd5(storeId, path, partialResponseCallback) {
    const fileHandle = await this._getDirectory(storeId, path.slice(0, path.length - 1));

    try {
      const file = await fileHandle.getFile(path[path.length - 1]);
      const md5 = await file.computeMd5(partialResponseCallback);
      return {
        md5: md5
      };
    } catch (e) {
      throw 'Cannot compute md5 of file cause: ' + e.message;
    }
  }

  /**
   * @param {string} storeId
   * @param {string[]} path
   * @returns {Promise<LocalFile>}
   * @private
   */
  async _getDirectory(storeId, path) {
    const store = this._localFilesystem.stores.find(store => store.id === storeId);
    if (!store) {
      throw 'Store ' + storeId + ' cannot be found';
    }

    let fileHandle = store.fileHandle;
    for (let i = 1; i < path.length; i++) {
      try {
        fileHandle = await fileHandle.getDirectory(path[i]);
      } catch (e) {
        console.log(e);
        throw 'Cannot traverse path: ' + path;
      }
    }

    return fileHandle;
  }

  /**
   * @param {LocalFile} fileHandle
   * @returns {{isFile: *, size: *, name: *, lastModified: *, isDirectory: *}}
   * @private
   */
  _fileHandleToFile(fileHandle) {
    return {
      isFile: fileHandle.isFile,
      isDirectory: fileHandle.isDirectory,
      name: fileHandle.name,
      size: fileHandle.size,
      lastModified: fileHandle.lastModified
    }
  }

  /**
   * @param {String} type
   * @returns {Promise<Object>}
   * @private
   */
  async _error(type) {
    throw 'Request type ' + type + ' not found';
  }
}