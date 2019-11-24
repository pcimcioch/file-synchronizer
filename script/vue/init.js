new Vue({
  el: '#app',
  data: {
    localFilesystem: new LocalFilesystem(),
    remoteFilesystems: []
  },
  methods: {
    addRemoteFilesystem: function(connection) {
      connection.handler = new RemoteCallsHandler(this.localFilesystem);
      this.remoteFilesystems.push(new RemoteFilesystem(connection));
    }
  }
});