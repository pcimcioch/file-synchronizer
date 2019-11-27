// TODO add possibility to send file over webrtc
new Vue({
  el: '#app',
  data: {
    localFilesystem: new LocalFilesystem(),
    peers: []
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