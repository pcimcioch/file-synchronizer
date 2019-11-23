Vue.component('dir-handler', {
  props: ['handler'],
  data: function() {
    return {
      selected: null,
      files: [{name: 'test', isFile: true}, {name: 'test2', isFile: false}],
      path: []
    };
  },
  methods: {
    select: function(file) {
      this.selected = file;
    },
    open: function(file) {
      if (file.isDirectory) {
        this.listDirectory(this.path.concat(file));
      }
    },
    listDirectory: async function(newPath) {
      const directory = newPath[newPath.length - 1];

      const newFiles = [];
      for await (const entry of directory.getEntries()) {
        newFiles.push(entry);
      }

      this.path = newPath;
      this.files = newFiles;
      this.select(null);
    },
    back: function() {
      if (this.path.length === 1) {
        this.$emit('close');
      } else {
        this.listDirectory(this.path.slice(0, this.path.length - 1));
      }
    }
  },
  watch: {
    handler: function(newValue) {
      this.listDirectory([newValue.fileHandle]);
    }
  },
  template: `
    <div class="row">
      <div class="list-group list-group-flush col col-6">
        <button class="list-group-item list-group-item-action p-1" title="Back" v-on:click="back">
          <span class="fas fa-arrow-left">&nbsp;Back</span>
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
      <file-info class="col col-6" v-bind:file="selected"></file-info>
    </div>
  `
});