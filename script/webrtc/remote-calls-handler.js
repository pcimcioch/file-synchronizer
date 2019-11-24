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
      case 'get-entries':
        return this._getEntries(request.storeId, request.path);
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