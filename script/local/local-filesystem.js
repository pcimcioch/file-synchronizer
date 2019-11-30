import {getMD5, uuid4} from '../utils/crypto.js';

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
  /*** @type {?string}*/
  md5 = null;

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

  /*** @returns {Promise<LocalFile[]>}*/
  async getEntries() {
    if (!this.isDirectory) {
      throw Error('Cannot list entries on non-directory files');
    }

    const files = [];
    for await (const entry of this._fileHandle.getEntries()) {
      const localFile = await LocalFile.build(entry);
      files.push(localFile);
    }

    return files;
  }

  /**
   * @param {string} name
   * @returns {Promise<LocalFile>}
   */
  async getDirectory(name) {
    if (!this.isDirectory) {
      throw Error('Cannot get directory on non-directory files');
    }

    const dir = await this._fileHandle.getDirectory(name);
    return await LocalFile.build(dir);
  }

  /**
   * @param {string} name
   * @returns {Promise<LocalFile>}
   */
  async getFile(name) {
    if (!this.isDirectory) {
      throw Error('Cannot get file on non-directory files');
    }

    const file = await this._fileHandle.getFile(name);
    return await LocalFile.build(file);
  }

  /**
   * @param {Function} [progressCallback]
   * @returns {Promise<string>}
   */
  async computeMd5(progressCallback) {
    if (!this.isFile) {
      throw new Error('Cannot compute md5 on non-file files');
    }

    if (!this.md5) {
      this.md5 = await getMD5(this._file, progressCallback);
    }
    return this.md5;
  }
}

export class LocalFilesystem {
  /**
   * @typedef {Object<string, Object>} Store
   * @property {string} id
   * @property {string} name
   * @property {LocalFile} fileHandle
   */
  /*** @type {Store[]}*/
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