import {uuid4} from '../../utils/crypto.js';
import {db} from '../../firebase/firebase.js';
import {Network} from '../../webrtc/network.js';
import {RemoteCallsHandler} from '../../webrtc/remote-calls-handler.js';
import ManualConnector from './manual-connector.js';
import ConnectionList from './connection-list.js';

// !TODO: add component to periodically refresh it's state in firebase and remove stale states
// !TODO add proper authentication rules
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
      peerId: uuid4(),
      visiblePeers: []
    };
  },

  firestore: {
    visiblePeers: db.collection('peers'),
  },

  watch: {
    visiblePeers: function(newValue) {
      this.network.updatePeers(newValue);
    }
  },

  methods: {
    addManualPeer: function(id, name, connection) {
      connection.requestHandler = this.remoteCallsHandler;
      this.network.addPeer(id, name, false);
      this.network.connect(id, connection);
    },
    removePeer: function(peer) {
      this.network.removePeer(peer.id);
    },
    initConnection: function(peer) {
      // !TODO implement
    }
  },

  template: `
    <div>
      <manual-connector class="mb-2" :peer-id="peerId" @new-connection="addManualPeer" />
      <connection-list class="mb-2" :peers="network.peers" @remove="removePeer" @init="initConnection" />
    </div>
  `
};