Vue.component('dir-handler-list', {
  props: ['handlers'],
  data: function() {
    return {
      selected: null
    };
  },
  methods: {
    select: function(entry) {
      this.selected = entry;
      this.$emit('select', entry)
    },
    open: function(entry) {
      this.$emit('open', entry)
    },
    removeHandler: function() {
      if (this.selected) {
        this.$emit('remove', this.selected);
      }
    },
    addHandler: async function() {
      const fileHandle = await window.chooseFileSystemEntries({type: 'openDirectory'});
      this.$emit('add', {
        id: fileHandle.name,
        name: fileHandle.name,
        fileHandle: fileHandle,
      });
    }
  },
  template: `
    <div class="row">
      <div class="list-group list-group-flush col col-6">
        <div class="list-group-item list-group-item-action p-1 btn-group btn-group-sm">
          <button class="btn btn-primary fas fa-plus" title="Add Store" v-on:click="addHandler"></button>
          <button class="btn btn-danger fas fa-minus" title="Remove Store" v-on:click="removeHandler" v-bind:disabled="!selected"></button>
        </div>
        <button class="list-group-item list-group-item-action p-1" 
                v-for="entry in handlers" 
                v-bind:key="entry.id"
                v-bind:class="{active: entry === selected}" 
                v-on:click="select(entry)"
                v-on:dblclick="open(entry)">
          <span class="fas fa-database" v-bind:title="entry.name">&nbsp;{{entry.name}}</span>
        </button>
      </div>
      <dir-handler-info class="col col-6" v-bind:handler="selected"></dir-handler-info>
    </div>
  `
});