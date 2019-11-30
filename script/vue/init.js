// !TODO add possibility to send file over webrtc
// !TODO push to github
import {LocalFilesystem} from '../local/local-filesystem.js';
import {Network} from '../webrtc/network.js';
import {RemoteCallsHandler} from '../webrtc/remote-calls-handler.js';
import FilesystemView from './filesystem/filesystem-view.js';
import ConnectionManager from './connect/connection-manager.js';

new ClipboardJS('.btn-clipboard');

new Vue({
  el: '#app',

  components: {
    FilesystemView: FilesystemView,
    ConnectionManager: ConnectionManager
  },

  data: {
    // !TODO consider vuex for keeping global state
    localFilesystem: new LocalFilesystem(),
    network : new Network()
  },

  computed: {
    remoteCallsHandler: function() {
      return new RemoteCallsHandler(this.localFilesystem);
    },
    connectedPeers: function() {
      return this.network.peers.filter(p => p.filesystem);
    }
  }
});