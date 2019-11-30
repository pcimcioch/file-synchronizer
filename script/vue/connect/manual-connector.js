// !TODO: make it beautiful
import {uuid4} from '../../utils/crypto.js';
import {Connection} from '../../webrtc/connection.js';

export default {
  data: function() {
    return {
      connection: null,
      otherSdp: null,
      state: 'Waiting'
    };
  },

  computed: {
    connected: function() {
      return this.connection && this.connection.state === 'connected';
    }
  },

  watch: {
    connected: function(newValue) {
      if (newValue) {
        const id = uuid4();
        this.$emit('new-connection', id, id, this.connection);
        this.connection = null;
        this.state = 'Waiting';
        this.otherSdp = null;
      }
    }
  },

  methods: {
    startInitiator: function() {
      this.connection = new Connection(true);
      this.state = 'Waiting for sdp';
    },
    startSlave: function() {
      this.connection = new Connection(false);
      this.state = 'Waiting for sdp';
    },
    connect: function() {
      this.connection.connect(this.otherSdp);
      this.state = 'Connecting';
    }
  },

  template: `
    <div class="card">
      <div class="card-body">
      <div class="row">
          <span v-if="connected" key="state-connected">State: Connected!</span>
          <span v-else key="state-not-connected">State: {{ state }}</span>
        </div>
        
        <div class="row" v-if="!connection" key="not-yet-connected">
          <button class="btn btn-primary" @click="startInitiator">Listen</button>
          <button class="btn btn-success" @click="startSlave"">Connect</button>
        </div>
        
        <div class="row" v-else key="during-connect">
          <textarea disabled :value="connection.sdp"></textarea>
          <textarea v-model="otherSdp"></textarea>
          <button class="btn btn-success" @click="connect" :disabled="!otherSdp || connected || state === 'Connecting'">Connect</button>
        </div>
      </div>
    </div>
  `
};