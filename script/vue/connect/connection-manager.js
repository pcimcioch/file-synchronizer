import {Network} from '../../webrtc/network.js';
import {RemoteCallsHandler} from '../../webrtc/remote-calls-handler.js';
import {connector} from './connector.js';
import {connectionsList} from './connections-list.js';

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
    connector: connector,
    connectionsList: connectionsList
  },
  template: `
    <div>
      <connector class="mb-2" v-on:new-connection="addPeer"></connector>
      <connections-list class="mb-2" v-bind:peers="network.peers" v-on:remove="removePeer"></connections-list>
    </div>
  `
};