import {uuid4} from '../../utils/crypto.js';
import {Network} from '../../webrtc/network.js';
import {RemoteCallsHandler} from '../../webrtc/remote-calls-handler.js';
import ManualConnector from './manual-connector.js';
import ConnectionList from './connection-list.js';

// !TODO: use firedb / firebase to exchange peers data
export default {
  components: {
    ManualConnector: ManualConnector,
    ConnectionList: ConnectionList
  },

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

  data: function() {
    return {
      peerId: uuid4()
    };
  },

  methods: {
    addPeer: function(id, name, connection) {
      connection.requestHandler = this.remoteCallsHandler;
      this.network.removePeer(id);
      this.network.addPeer(id, name, connection);
    },
    removePeer: function(peer) {
      this.network.removePeer(peer.id);
    }
  },

  template: `
    <div>
      <manual-connector class="mb-2" :peer-id="peerId" @new-connection="addPeer" />
      <connection-list class="mb-2" :peers="network.peers" @remove="removePeer" />
    </div>
  `
};