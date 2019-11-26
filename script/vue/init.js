new Vue({
  el: '#app',
  data: {
    localFilesystem: new LocalFilesystem(),
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