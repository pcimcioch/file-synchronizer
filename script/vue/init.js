// TODO add possibility to send file over webrtc
import {LocalFilesystem} from '../local/local-filesystem.js';
import {Peer} from '../webrtc/peer.js';
import {connections} from './connect/connections.js';
import {connector} from './connect/connector.js';
import {filesystem} from './filesystem/filesystem.js';

new Vue({
  el: '#app',
  data: {
    localFilesystem: new LocalFilesystem(),
    peers: []
  },
  components: {
    connections: connections,
    connector: connector,
    filesystem: filesystem
  },
  methods: {
    addPeer: function(id, name, connection) {
      const peer = new Peer(id, name);
      peer.connect(this.localFilesystem, connection);
      this.peers.push(peer);
    },
    removePeer: function(peer) {
      this.peers = this.peers.filter(p => p.id !== peer.id);
    }
  }
});