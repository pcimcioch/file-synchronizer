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
    }
  },
  template: `
    <div class="row">
      <div class="list-group list-group-flush col col-6">
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