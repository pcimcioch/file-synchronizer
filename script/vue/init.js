new Vue({
  el: '#app',
  data: {
    localFilesystem: new LocalFilesystem(),
    remoteFilesystems: [] // TODO there should be a vue widger to manage remote filesystems. With possibility to disconnect/remove. All errors from Connection should be logged there
  },
  methods: {
    addRemoteFilesystem: function(connection) {
      connection.requestHandler = new RemoteCallsHandler(this.localFilesystem);
      this.remoteFilesystems.push(new RemoteFilesystem(connection));
    }
  }
});