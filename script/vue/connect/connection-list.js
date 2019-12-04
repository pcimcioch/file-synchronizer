// !TODO: All errors from Connection should be logged here?
export default {
  props: {
    peers: {
      type: Array,
      required: true
    }
  },

  methods: {
    connect: function(peer) {
      if (peer.visible && (!peer.state || peer.state === 'closed')) {
        this.$emit('init', peer);
      }
    },
    disconnect: function(peer) {
      if (peer.state && peer.state !== 'closed') {
        peer.close();
      }
    },
    remove: function(peer) {
      if (!peer.visible && peer.state === 'closed') {
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
             :key="peer.id"
             :class="{'bg-light-danger' : (peer.state === 'closed')}">
           {{ peer.name }}
           <div class="btn-group float-right">
             <button class="btn btn-xs btn-success fas fa-link pt-1 pb-1 pl-2 pr-2" title="Connect"
                     @click="connect(peer)"
                     :disabled="!peer.visible || (peer.state && peer.state !== 'closed')">
             </button>
             <button class="btn btn-xs btn-warning fas fa-unlink pt-1 pb-1 pl-2 pr-2" title="Disconnect"
                     @click="disconnect(peer)"
                     :disabled="!peer.state || peer.state === 'closed'">
             </button>
             <button class="btn btn-xs btn-danger fas fa-minus pt-1 pb-1 pl-2 pr-2" title="Remove Connection"
                     @click="remove(peer)"
                     :disabled="peer.visible || peer.state !== 'closed'">
             </button>
           </div>
         </li>
       </ul>
     </div>
    </div>
  `
};