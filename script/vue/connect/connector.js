// TODO: make it beautiful
// TODO: use firedb / firebase to exchange peers data
Vue.component('connector', {
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
  template: `
    <div class="card">
      <div class="card-body">
      <div class="row">
          <span v-if="connected">State: Connected!</span>
          <span v-else>State: {{ state }}</span>
        </div>
        
        <div class="row" v-if="!connection">
          <button class="btn btn-primary" v-on:click="startInitiator">Listen</button>
          <button class="btn btn-success" v-on:click="startSlave"">Connect</button>
        </div>
        
        <div class="row" v-else>
          <textarea disabled v-bind:value="connection.sdp"></textarea>
          <textarea v-model="otherSdp"></textarea>
          <button class="btn btn-success" v-on:click="connect" v-bind:disabled="!otherSdp || connected || state === 'Connecting'">Connect</button>
        </div>
      </div>
    </div>
  `
});