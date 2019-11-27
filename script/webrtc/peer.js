import {RemoteCallsHandler} from './remote-calls-handler.js';
import {RemoteFilesystem} from './remote-filesystem.js';

export class Peer {

  /*** @type {?RemoteFilesystem}*/
  filesystem = null;
  /*** @type {string}*/
  id = '';
  /*** @type {string}*/
  name = '';

  /**
   * @type {?RemoteCallsHandler}
   * @private
   */
  _remoteCallsHandler = null;
  /**
   * @type {?Connection}
   * @private
   */
  _connection = null;

  /**
   * @param {string} id
   * @param {string} name
   */
  constructor(id, name) {
    this.id = id;
    this.name = name;
  }

  /**
   * @param {LocalFilesystem} localFilesystem
   * @param {Connection} connection
   */
  connect(localFilesystem, connection) {
    this._connection = connection;
    this._remoteCallsHandler = new RemoteCallsHandler(localFilesystem);
    this.filesystem = new RemoteFilesystem(connection);
    connection.requestHandler = this._remoteCallsHandler;
  }

  /*** @returns {?string}*/
  get state() {
    return this._connection ? this._connection.state : null;
  }

  close() {
    if (this._connection) {
      this._connection.close();
    }
  }
}