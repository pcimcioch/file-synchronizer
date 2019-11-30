import {LocalFilesystem} from '../../local/local-filesystem.js';
import {RemoteFilesystem} from '../../webrtc/remote-filesystem.js';
import StoreList from './store-list.js';
import StoreView from './store-view.js';

export default {
  components: {
    StoreList: StoreList,
    StoreView: StoreView
  },

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

  template: `
    <div class="card">
      <div class="card-body">
        <h5 class="card-title">{{ remote ? 'Remote Filesystem' : 'Local Filesystem' }}</h5>
        <store-list :stores="filesystem.stores" 
                     :remote="remote"
                     @add="addStore" 
                     @remove="removeStore" 
                     @open="open" 
                     @sync="sync"
                     v-if="!opened" />
        <store-view :store="opened" @close="close" v-if="opened" />
      </div>
    </div>
  `
};