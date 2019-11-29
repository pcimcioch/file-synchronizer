import {Network} from '../../webrtc/network.js';
import {RemoteCallsHandler} from '../../webrtc/remote-calls-handler.js';
import {manualConnector} from './manual-connector.js';
import {connectionList} from './connection-list.js';

// !TODO: use firedb / firebase to exchange peers data
export const connectionManager = {
  props: {
    network: {
      type: Network,
      required: true
    },
    remoteCallsHandler: {
      type: RemoteCallsHandler,
      required: true
    }
  },
  methods: {
    addPeer: function(id, name, connection) {
      connection.requestHandler = this.remoteCallsHandler;
      this.network.addPeer(id, name, connection);
    },
    removePeer: function(peer) {
      this.network.removePeer(peer.id);
    }
  },
  components: {
    manualConnector: manualConnector,
    connectionList: connectionList
  },
  template: `
    <div>
      <manual-connector class="mb-2" @new-connection="addPeer"></manual-connector>
      <connection-list class="mb-2" :peers="network.peers" @remove="removePeer"></connection-list>
    </div>
  `
};