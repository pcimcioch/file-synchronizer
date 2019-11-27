new Vue({
  el: '#app',
  data: {
    localFilesystem: new LocalFilesystem(), // TODO another abstraction: peer. With optional remoteFilesystem configured. Remove id from remote filesystem and move it to peer
    remoteFilesystems: []
  },
  methods: {
    addRemoteFilesystem: function(connection) {
      connection.requestHandler = new RemoteCallsHandler(this.localFilesystem);
      this.remoteFilesystems.push(new RemoteFilesystem(connection));
    },
    removeRemoteFilesystem: function(filesystem) {
      this.remoteFilesystems = this.remoteFilesystems.filter(fs => fs.id !== filesystem.id);
    }
  }
});