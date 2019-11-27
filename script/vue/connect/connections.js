// TODO: All errors from Connection should be logged here?
export const connections = {
  props: {
    peers: {
      type: Array,
      required: true
    }
  },
  methods: {
    disconnect: function(peer) {
      if (peer.state !== 'closed') {
        peer.close();
      }
    },
    remove: function(peer) {
      if (peer.state === 'closed') {
        this.$emit('remove', peer);
      }
    }
  },
  template: `
    <div class="card">
     <div class="card-body">
       <h5 class="card-title">Connections</h5>
       <ul class="list-group list-group-flush">
         <li class="list-group-item p-1 btn-group" 
             v-for="peer in peers" 
             v-bind:key="peer.id"
             v-bind:class="{'bg-light-danger' : (peer.state === 'closed')}">
           {{ peer.name }}
           <div class="btn-group float-right">
             <button class="btn btn-xs btn-warning fas fa-unlink pt-1 pb-1 pl-2 pr-2" title="Disconnect"
                     v-on:click="disconnect(peer)"
                     v-bind:disabled="peer.state === 'closed'">
             </button>
             <button class="btn btn-xs btn-danger fas fa-minus pt-1 pb-1 pl-2 pr-2" title="Remove Connection"
                     v-on:click="remove(peer)"
                     v-bind:disabled="peer.state !== 'closed'">
             </button>
           </div>
         </li>
       </ul>
     </div>
    </div>
  `
};