Vue.component('filesystem', {
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
      this.filesystem.addStore(fileHandle);
    },
    removeStore: function(store) {
      this.filesystem.removeStore(store.id);
    },
    sync: function() {
      this.filesystem.refreshStores();
    }
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
});