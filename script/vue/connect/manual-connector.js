import {Connection} from '../../webrtc/connection.js';

export default {
  props: {
    peerId: {
      type: String,
      required: true
    }
  },

  data: function() {
    return {
      connection: null,
      name: 'Peer',
      initiator: false,
      otherDescriptor: null
    };
  },

  computed: {
    connected: function() {
      return this.connection && this.connection.state === 'connected';
    },
    connectionDescriptor: function() {
      if (!this.connection || !this.connection.sdp) {
        return null;
      }
      return JSON.stringify({
        id: this.peerId,
        name: this.name,
        sdp: this.connection.sdp
      });
    },
    otherDescriptorObject: function() {
      if (!this.otherDescriptor) return null;
      try {
        const parsed = JSON.parse(this.otherDescriptor);
        if (!parsed.id || !parsed.name || !parsed.sdp) return null;
        return parsed;
      } catch (e) {
        return null;
      }
    },
    isInvalidClass: function() {
      return {'is-invalid': (this.otherDescriptor && !this.otherDescriptorObject)};
    }
  },

  watch: {
    connected: function(newValue) {
      if (newValue && this.otherDescriptorObject) {
        this.$emit('new-connection', this.otherDescriptorObject.id, this.otherDescriptorObject.name, this.connection);
        this.connection = null;
        this.otherDescriptor = null;
      }
    }
  },

  methods: {
    startAsInitiator: function() {
      this.initiator = true;
      this.connection = new Connection(true);
    },
    startAsClient: function() {
      this.initiator = false;
      this.connection = new Connection(false);
    },
    connect: function() {
      if (!this.otherDescriptorObject) return;
      this.connection.connect(this.otherDescriptorObject.sdp);
    },
    cancel: function() {
      if (this.connection) this.connection.close();
      this.connection = null;
      this.otherDescriptor = null;
    }
  },

  template: `
    <div class="card">
      <div class="card-body">
        <h5 class="card-title">Manual Connection</h5>
        <form @submit.prevent>
          <div class="form-group">
            <label for="peer-name">Name</label>
            <input type="text" class="form-control" id="peer-name" v-model="name" :disabled="connection">
          </div>
          
          <div class="form-group" v-if="!connection">
            <button class="btn btn-sm btn-primary" @click="startAsInitiator" :disabled="!name">Listen</button>
            <button class="btn btn-sm btn-success float-right" @click="startAsClient" :disabled="!name">Connect</button>
          </div>
          
          <template v-if="connection && initiator">
            <div class="form-group textarea-container">
              <textarea class="form-control" rows="4" readonly :value="connectionDescriptor"></textarea>
              <button class="btn btn-sm btn-secondary btn-clipboard far fa-copy" :data-clipboard-text="connectionDescriptor" title="Copy to clipboard"></button>
            </div>
            <div class="form-group">
              <textarea class="form-control" rows="4" v-model="otherDescriptor" :class="isInvalidClass"></textarea>
              <div class="invalid-feedback">Must be json with 'id', 'name' and 'sdp' fields</div>
            </div>
            <div class="form-group">
              <button class="btn btn-sm btn-outline-warning" @click="cancel">Cancel</button>
              <button class="btn btn-sm btn-success float-right" @click="connect" :disabled="!otherDescriptorObject">Submit</button>
            </div>
          </template>
          
          <template v-if="connection &&!initiator">
            <div class="form-group" v-if="!connectionDescriptor">
              <textarea class="form-control" rows="4" v-model="otherDescriptor" :class="isInvalidClass"></textarea>
              <div class="invalid-feedback">Must be json with 'id', 'name' and 'sdp' fields</div>
            </div>
            <div class="form-group" v-if="!connectionDescriptor">
              <button class="btn btn-sm btn-outline-warning" @click="cancel">Cancel</button>
              <button class="btn btn-sm btn-success float-right" @click="connect" :disabled="!otherDescriptorObject">Submit</button>
            </div>
            <div class="form-group textarea-container" v-if="connectionDescriptor">
              <textarea class="form-control" rows="4" readonly :value="connectionDescriptor"></textarea>
              <button class="btn btn-sm btn-secondary btn-clipboard far fa-copy" :data-clipboard-text="connectionDescriptor" title="Copy to clipboard"></button>
            </div>
            <div class="form-group" v-if="connectionDescriptor">
              <button class="btn btn-sm btn-outline-warning" @click="cancel">Cancel</button>
            </div>
          </template>
        </form>
      </div>
    </div>
  `
}