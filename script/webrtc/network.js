import {Peer} from './peer.js';

export class Network {

  /*** @type {Peer[]}*/
  peers = [];

  /**
   * @param {string} id
   * @param {string} name
   * @param {?Connection} connection
   */
  addPeer(id, name, connection) {
    // !TODO override if peer with id exists
    const peer = new Peer(id, name);
    if (connection) peer.connect(connection);

    this.peers.push(peer);
  }

  /*** @param {string} peerId*/
  removePeer(peerId) {
    this.peers = this.peers.filter(p => p.id !== peerId);
  }
}