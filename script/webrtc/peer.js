import {RemoteFilesystem} from './remote-filesystem.js';

export class Peer {

  /*** @type {?RemoteFilesystem}*/
  filesystem = null;
  /*** @type {string}*/
  id = '';
  /*** @type {string}*/
  name = '';
  /*** @type {boolean}*/
  visible = false;

  /**
   * @type {?Connection}
   * @private
   */
  _connection = null;

  /**
   * @param {string} id
   * @param {string} name
   * @param {boolean} visible
   */
  constructor(id, name, visible) {
    this.id = id;
    this.name = name;
    this.visible = visible;
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