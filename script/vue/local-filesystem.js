Vue.component('local-filesystem', {
  data: function() {
    return {
      handlers: [
        {
          id: 1,
          name: 'File 1',
          handler: null
        }, {
          id: 2,
          name: 'File 2',
          handler: null
        }, {
          id: 3,
          name: 'File 3',
          handler: null
        }],
      selected: null,
      opened: null
    }
  },
  methods: {
    addDirHandler: async function() {
      const fileHandle = await window.chooseFileSystemEntries({type: 'openDirectory'});
      this.handlers.push({
        id: fileHandle.name,
        name: fileHandle.name,
        fileHandle: fileHandle,
      });
    },
    removeDirHandler: function() {
      this.handlers = this.selected ? this.handlers.filter(e => e.id !== this.selected.id) : this.handlers;
      this.selected = null;
    },
    select: function(handler) {
      this.selected = handler;
    },
    open: function(handler) {
      this.opened = handler;
    }
  },
  template: `
    <div class="card">
      <div class="card-body">
        <!-- TODO: Those buttons and methods moved to dir-handler-list. 'handlers' passed as model -->
        <div class="row pb-2 btn-group btn-group-sm" role="group">
            <button class="btn btn-primary fas fa-plus" v-on:click="addDirHandler"></button>
            <button class="btn btn-danger fas fa-minus" v-on:click="removeDirHandler" v-bind:disabled="!selected"></button>
        </div>
    
        <div class="row">
          <dir-handler-list class="col col-6" v-bind:handlers="handlers" v-on:select="select" v-on:open="open"></dir-handler-list>
          <dir-handler-info class="col col-6" v-bind:handler="selected"></dir-handler-info>
        </div>
        <br>
        <div class="row">
          <dir-handler class="col col-6" v-bind:handler="opened"></dir-handler>
          <file-info class="col col-6" v-bind:file="null"></file-info>
        </div>
      </div>
    </div>
  `
});