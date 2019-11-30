import {Peer} from './peer.js';

export class Network {

  /*** @type {Peer[]}*/
  peers = [];

  /**
   * @param {string} id
   * @param {string} name
   * @param {Connection} [connection]
   */
  addPeer(id, name, connection) {
    const newPeer = new Peer(id, name);
    if (connection) newPeer.connect(connection);
    this.peers.push(newPeer);
  }

  /*** @param {string} peerId*/
  removePeer(peerId) {
    this.peers.filter(p => p.id === peerId).forEach(p => p.close());
    this.peers = this.peers.filter(p => p.id !== peerId);
  }
}