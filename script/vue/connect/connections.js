// TODO: All errors from Connection should be logged here?
Vue.component('connections', {
  props: {
    remoteFilesystems: {
      type: Array,
      required: true
    }
  },
  methods: {
    disconnect: function(filesystem) {
      if (filesystem.connection.state !== 'closed') {
        filesystem.connection.close();
      }
    },
    remove: function(filesystem) {
      if (filesystem.connection.state === 'closed') {
        this.$emit('remove', filesystem);
      }
    }
  },
  template: `
    <div class="card">
     <div class="card-body">
       <h5 class="card-title">Connections</h5>
       <ul class="list-group list-group-flush">
         <li class="list-group-item p-1 btn-group" 
             v-for="filesystem in remoteFilesystems" 
             v-bind:key="filesystem.id"
             v-bind:class="{'bg-light-danger' : (filesystem.connection.state === 'closed')}">
           {{ filesystem.id }}
           <div class="btn-group float-right">
             <button class="btn btn-xs btn-warning fas fa-unlink pt-1 pb-1 pl-2 pr-2" title="Disconnect"
                     v-on:click="disconnect(filesystem)"
                     v-bind:disabled="filesystem.connection.state === 'closed'">
             </button>
             <button class="btn btn-xs btn-danger fas fa-minus pt-1 pb-1 pl-2 pr-2" title="Remove Connection"
                     v-on:click="remove(filesystem)"
                     v-bind:disabled="filesystem.connection.state !== 'closed'">
             </button>
           </div>
         </li>
       </ul>
     </div>
    </div>
  `
});