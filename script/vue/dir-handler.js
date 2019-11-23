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
      this.path = [newValue.fileHandle];
      this.listDirectory();
    }
  },
  template: `
    <div class="list-group list-group-flush">
      <button class="list-group-item list-group-item-action p-1" 
              v-on:click="back">
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
