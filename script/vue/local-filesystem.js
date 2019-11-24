// TODO: remove
Vue.component('local-filesystem', {
  data: function() {
    return {
      handlers: [],
      opened: null
    }
  },
  methods: {
    open: function(handler) {
      this.opened = handler;
    },
    close: function(){
      this.opened = null;
    },
    addHandler: function(handler) {
      this.handlers.push(handler);
    },
    removeHandler: function(handler) {
      this.handlers = this.handlers.filter(el => el !== handler);
    }
  },
  template: `
    <div class="card">
      <div class="card-body">
        <dir-handler-list v-bind:handlers="handlers" v-on:add="addHandler" v-on:remove="removeHandler" v-on:open="open" v-if="!opened"></dir-handler-list>
        <dir-handler v-bind:handler="opened" v-on:close="close" v-if="opened"></dir-handler>
      </div>
    </div>
  `
});