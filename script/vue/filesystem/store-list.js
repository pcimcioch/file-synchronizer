import {storeInfo} from './store-info.js';

export const storeList = {
  props: {
    stores: {
      type: Array,
      required: true
    },
    remote: {
      type: Boolean,
      required: false,
      default: false
    },
    maxHeight: {
      type: String,
      required: false,
      default: '200px'
    }
  },
  data: function() {
    return {
      selected: null
    };
  },
  methods: {
    select: function(entry) {
      this.selected = entry;
    },
    open: function(entry) {
      this.$emit('open', entry)
    },
    removeStore: function() {
      if (this.selected) {
        this.$emit('remove', this.selected);
        this.select(null);
      }
    },
    addStore: async function() {
      const fileHandle = await window.chooseFileSystemEntries({type: 'openDirectory'});
      this.$emit('add', fileHandle);
    },
    syncStores: function() {
      this.$emit('sync');
    }
  },
  components: {
    storeInfo: storeInfo
  },
  template: `
    <div class="row">
      <div class="col col-6">
        <div class="btn-group btn-group-sm mb-1">
          <button class="btn btn-primary fas fa-plus" title="Add Store" @click="addStore" v-if="!remote"></button>
          <button class="btn btn-danger fas fa-minus" title="Remove Store" @click="removeStore" :disabled="!selected" v-if="!remote"></button>
          <button class="btn btn-info fas fa-sync" title="Sync Stores" @click="syncStores" v-if="remote"></button>
        </div>
        <div class="list-group list-group-flush" :style="{'overflow-y': 'scroll', 'max-height': maxHeight}">
          <button class="list-group-item list-group-item-action p-1" 
                  v-for="entry in stores" 
                  :key="entry.id"
                  :class="{active: entry === selected}" 
                  @click="select(entry)"
                  @dblclick="open(entry)">
            <span class="fas fa-database" :title="entry.name">&nbsp;{{entry.name}}</span>
          </button>
        </div>
      </div>
      <store-info class="col col-6" :store="selected"></store-info>
    </div>
  `
};