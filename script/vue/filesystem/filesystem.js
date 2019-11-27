import {LocalFilesystem} from '../../local/local-filesystem.js';
import {RemoteFilesystem} from '../../webrtc/remote-filesystem.js';
import {storesList} from './stores-list.js';
import {store} from './store.js';

export const filesystem = {
  props: {
    filesystem: {
      type: Object,
      required: true
    }
  },
  data: function() {
    return {
      opened: null
    }
  },
  computed: {
    remote: function() {
      return this.filesystem instanceof RemoteFilesystem;
    }
  },
  methods: {
    open: function(handler) {
      this.opened = handler;
    },
    close: function() {
      this.opened = null;
    },
    addStore: function(fileHandle) {
      if (this.filesystem instanceof LocalFilesystem) {
        this.filesystem.addStore(fileHandle);
      }
    },
    removeStore: function(store) {
      if (this.filesystem instanceof LocalFilesystem) {
        this.filesystem.removeStore(store.id);
      }
    },
    sync: function() {
      if (this.filesystem instanceof RemoteFilesystem) {
        this.filesystem.refreshStores();
      }
    }
  },
  mounted: function() {
    setTimeout(() => this.sync(), 500);
  },
  components: {
    storesList: storesList,
    store: store
  },
  template: `
    <div class="card">
      <div class="card-body">
        <h5 class="card-title">{{ remote ? 'Remote Filesystem' : 'Local Filesystem' }}</h5>
        <stores-list v-bind:stores="filesystem.stores" 
                     v-on:add="addStore" 
                     v-on:remove="removeStore" 
                     v-on:open="open" 
                     v-on:sync="sync"
                     v-bind:remote="remote"
                     v-if="!opened"></stores-list>
        <store v-bind:store="opened" v-on:close="close" v-if="opened"></store>
      </div>
    </div>
  `
};