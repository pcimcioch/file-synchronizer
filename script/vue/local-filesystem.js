// TODO: info for files
Vue.component('dir-handler-info', {
  props: ['handler'],
  template: `
    <table class="table table-borderless table-sm" v-if="handler">
      <tbody>
        <tr>
          <td>Name</td>
          <td>{{ handler.name }}</td>
        </tr>
      </tbody>
    </table>
  `
});


Vue.component('dir-handler-list', {
  props: ['handlers'],
  data: function() {
    return {
      // TODO: this should be whole object, not only id
      selected: null
    };
  },
  methods: {
    select: function(id) {
      this.selected = id;
      this.$emit('select', id)
    },
    open: function(id) {
      this.$emit('open', id)
    }
  },
  template: `
    <div class="list-group list-group-flush">
      <button class="list-group-item list-group-item-action p-1" 
              v-for="entry in handlers" 
              v-bind:key="entry.id"
              v-bind:class="{active: entry.id === selected}" 
              v-on:click="select(entry.id)"
              v-on:dblclick="open(entry.id)">
        <span class="fas fa-database" v-bind:title="entry.name">&nbsp;{{entry.name}}</span>
      </button>
    </div>
  `
});
// TODO: move all components to separate files

Vue.component('dir-handler', {
  props: ['handler'],
  data: function() {
    return {
      selected: null,
      files: [{name: 'test'}],
      path: []
    };
  },
  methods: {
    select: function(file) {
      this.selected = file;
      this.$emit('select', file)
    },
    open: function(file) {
      if (!file.isDirectory) {
        return;
      }

      this.path.push(file);
      this.listDirectory();
    },
    listDirectory: async function() {
      this.files = [];
      this.select(null);
      const directory = this.path[this.path.length - 1];

      for await (const entry of directory.getEntries()) {
        this.files.push(entry);
      }
    },
    back: function() {
      if (this.path.length === 1) {
        this.$emit('close');
      } else {
        this.path.pop();
        this.listDirectory();
      }
    }
  },
  watch: {
    handler: function(newValue) {
      this.path = [newValue.handler];
      this.listDirectory();
    }
  },
  template: `
    <div class="list-group list-group-flush">
      <button class="list-group-item list-group-item-action p-1" 
              v-on:dblclick="back">
        <span class="fas fa-arrow-left" title="Back">
          &nbsp;Back
        </span>
      </button>
      <button class="list-group-item list-group-item-action p-1" 
              v-for="file in files" 
              v-bind:key="file.name"
              v-bind:class="{active: file === selected}" 
              v-on:click="select(file)"
              v-on:dblclick="open(file)">
        <span v-bind:title="file.name">
          <i class="far" v-bind:class="file.isFile ? 'fa-file text-info' : 'fa-folder text-warning'"></i>
          &nbsp;{{file.name}}
        </span>
      </button>
    </div>
  `
});


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
      const handler = await window.chooseFileSystemEntries({type: 'openDirectory'});
      this.handlers.push({
        id: handler.name,
        name: handler.name,
        handler: handler,
      });
    },
    removeDirHandler: function() {
      this.handlers = this.selected ? this.handlers.filter(e => e.id !== this.selected.id) : this.handlers;
      this.selected = null;
    },
    select: function(id) {
      this.selected = this.handlers.find(el => el.id === id);
    },
    open: function(id) {
      this.opened = this.handlers.find(el => el.id === id);
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
          <dir-handler-list class="col-6" v-bind:handlers="handlers" v-on:select="select" v-on:open="open"></dir-handler-list>
          <dir-handler-info class="col-6" v-bind:handler="selected"></dir-handler-info>
        </div>
        <div class="row">
          <dir-handler class="col-6" v-bind:handler="opened"></dir-handler>
        </div>
      </div>
    </div>
  `
});