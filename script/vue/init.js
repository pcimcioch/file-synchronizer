// !TODO add possibility to send file over webrtc
// !TODO push to github
// !TODO use PascalCase in component names
import {LocalFilesystem} from '../local/local-filesystem.js';
import {Network} from '../webrtc/network.js';
import {RemoteCallsHandler} from '../webrtc/remote-calls-handler.js';
import {filesystem} from './filesystem/filesystem.js';
import {connectionManager} from './connect/connection-manager.js';

new Vue({
  el: '#app',

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
  },

  components: {
    filesystem: filesystem,
    connectionManager: connectionManager
  }
});