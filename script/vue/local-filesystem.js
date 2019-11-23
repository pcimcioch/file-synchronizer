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
      selected: null
    }
  },
  methods: {
    select: function(id) {
      this.selected = id;
      this.$emit('select', id)
    }
  },
  template: `
    <div class="list-group list-group-flush">
      <button class="list-group-item list-group-item-action p-1" 
              v-for="entry in handlers" 
              v-bind:key="entry.id"
              v-bind:class="{active: entry.id === selected}" 
              v-on:click="select(entry.id)">
        <span class="fas fa-folder" v-bind:title="entry.name">&nbsp;{{entry.name}}</span>
      </button>
    </div>
  `
});


Vue.component('local-filesystem', {
  data: function() {
    return {
      dirHandlers: [
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
      selected: {
        id: null,
        name: '',
        handler: null
      }
    }
  },
  methods: {
    addDirHandler: function() {
      const self = this;
      window.chooseFileSystemEntries({type: 'openDirectory'}).then(function(handler) {
        self.dirHandlers.push({
          id: handler.name,
          name: handler.name,
          handler: handler
        });
      });
    },
    removeDirHandler: function() {
      this.dirHandlers = this.selected ? this.dirHandlers.filter(e => e.id !== this.selected.id) : this.dirHandlers;
      this.selected = {
        id: null,
        name: '',
        handler: null
      };
    },
    select: function(id) {
      this.selected = this.dirHandlers.find(el => el.id === id);
    }
  },
  template: `
    <div class="card">
      <div class="card-body">
        <div class="row pb-2">
            <button class="btn btn-sm btn-primary fas fa-plus" v-on:click="addDirHandler"></button>
            <button class="btn btn-sm btn-danger fas fa-minus" v-on:click="removeDirHandler" v-bind:class="{disabled: !selected.id}"></button>
        </div>
    
        <div class="row">
          <dir-handler-list class="col-6" v-bind:handlers="dirHandlers" v-on:select="select"></dir-handler-list>
          <dir-handler-info class="col-6" v-bind:handler="selected"></dir-handler-info>
        </div>
      </div>
    </div>
  `
});