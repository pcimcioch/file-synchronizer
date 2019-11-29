import {RemoteFilesystem} from './remote-filesystem.js';

export class Peer {

  /*** @type {?RemoteFilesystem}*/
  filesystem = null;
  /*** @type {string}*/
  id = '';
  /*** @type {string}*/
  name = '';

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

  /*** @param {Connection} connection*/
  connect(connection) {
    this._connection = connection;
    this.filesystem = new RemoteFilesystem(connection);
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