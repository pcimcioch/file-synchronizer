// !TODO add possibility to send file over webrtc
import {LocalFilesystem} from '../local/local-filesystem.js';
import {Network} from '../webrtc/network.js';
import {RemoteCallsHandler} from '../webrtc/remote-calls-handler.js';
import {filesystem} from './filesystem/filesystem.js';
import {connectionManager} from './connect/connection-manager.js';

new Vue({
  el: '#app',
  data: {
    localFilesystem: new LocalFilesystem(),
    network : new Network()
  },
  computed: {
    remoteCallsHandler: function() {
      return new RemoteCallsHandler(this.localFilesystem);
    }
  },
  components: {
    filesystem: filesystem,
    connectionManager: connectionManager
  }
});