import {Peer} from './peer.js';

export class Network {

  /*** @type {Peer[]}*/
  peers = [];

  /**
   * @param {string} id
   * @param {string} name
   * @param {boolean} visible
   */
  addPeer(id, name, visible) {
    const existingPeer = this.find(id);
    if (existingPeer) {
      existingPeer.name = name;
      existingPeer.visible = visible;
    } else {
      this.peers.push(new Peer(id, name, visible));
    }
  }

  /*** @param {string} peerId*/
  removePeer(peerId) {
    this.peers.filter(p => p.id === peerId).forEach(p => p.close());
    this.peers = this.peers.filter(p => p.id !== peerId);
  }

  /**
   * @param {string} peerId
   * @returns {?Peer}
   */
  find(peerId) {
    return this.peers.find(p => p.id === peerId);
  }

  /**
   * @param {string} id
   * @param {Connection} connection
   */
  connect(id, connection) {
    const peer = this.find(id);
    if (peer) {
      peer.close();
      peer.connect(connection);
    }
  }

  /*** @param {Object[]} peers*/
  updatePeers(peers) {
    const peersMap = new Map(peers.map(peer => [peer.peerId, peer]));

    const toRemoveIds = [];
    for (const peer of this.peers) {
        const newPeer = peersMap[peer.id];
        delete peersMap[peer.id];
        peer.visible = !!newPeer;

        if (newPeer) peer.name = newPeer.name;
        else if (!peer.state) toRemoveIds.push(peer.id);
    }

    this.peers = this.peers.filter(p => !toRemoveIds.includes(p.id));

    for (const [newPeerId, newPeer] of peersMap) {
      this.peers.push(new Peer(newPeerId, newPeer.name, true));
    }
  }
}