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
        <stores-list v-bind:stores="filesystem.stores" 
                     v-on:add="addStore" 
                     v-on:remove="removeStore" 
                     v-on:open="open" 
                     v-on:sync="sync"
                     v-if="!opened"></stores-list>
        <!-- TODO: implement -->
        <!-- <dir-handler v-bind:handler="opened" v-on:close="close" v-if="opened"></dir-handler> -->
      </div>
    </div>
  `
});