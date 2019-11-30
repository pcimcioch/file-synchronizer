import FileInfo from './file-info.js';

export default {
  components: {
    FileInfo: FileInfo
  },

  props: {
    store: {
      type: Object,
      required: true
    },
    maxHeight: {
      type: String,
      required: false,
      default: '200px'
    }
  },

  data: function() {
    return {
      selected: null,
      files: [],
      path: []
    };
  },

  watch: {
    handler: function(newValue) {
      this.listDirectory([newValue.fileHandle]);
    }
  },

  mounted: function() {
    this.listDirectory([this.store.fileHandle]);
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
      const newFiles = await directory.getEntries();

      this.path = newPath;
      this.files = newFiles;
      this.select(null);
    },
    back: function() {
      if (this.path.length <= 1) {
        this.$emit('close');
      } else {
        this.listDirectory(this.path.slice(0, this.path.length - 1));
      }
    }
  },

  template: `
    <div class="row">
      <div class="list-group list-group-flush col col-6"  :style="{'overflow-y': 'scroll', 'max-height': maxHeight}">
        <button class="list-group-item list-group-item-action p-1" title="Back" @click="back">
          <span class="fas fa-arrow-left">&nbsp;Back</span>
        </button>
        <button class="list-group-item list-group-item-action p-1" 
                v-for="file in files" 
                :key="file.name"
                :class="{active: file === selected}" 
                @click="select(file)"
                @dblclick="open(file)">
          <span :title="file.name">
            <i class="far" :class="file.isFile ? 'fa-file text-info' : 'fa-folder text-warning'"></i>
            &nbsp;{{ file.name }}
          </span>
        </button>
      </div>
      <file-info class="col col-6" :file="selected" />
    </div>
  `
};