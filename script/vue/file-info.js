Vue.component('file-info', {
  props: {
    fileHandle: {
      type: FileSystemHandle,
      required: false
    }
  },
  data: function() {
    return {
      metadata: null
    };
  },
  methods: {
    showInfo: function() {
      if (!this.fileHandle || !this.fileHandle.isFile) {
        return;
      }

      this.calculateMetadata(this.fileHandle);
    },
    calculateMetadata: async function(fileHandle) {
      const file = await fileHandle.getFile();
      const md5 = await getMD5(file);

      this.metadata = {
        size: file.size,
        md5: md5
      };
    }
  },
  watch: {
    fileHandle: function() {
      this.metadata = null;
    }
  },
  template: `
    <div>
      <button class="btn btn-sm btn-info far fa-question-circle" title="More info" v-on:click="showInfo"></button>
      <table class="table table-borderless table-sm" v-if="fileHandle">
        <tbody>
          <tr>
            <td>Name</td>
            <td>{{ fileHandle.name }}</td>
          </tr>
          <tr v-if="fileHandle.isFile">
            <!-- TODO: size in human readable form -->
            <td>Size</td>
            <td>{{ metadata ? metadata.size : 'Click info to compute' }}</td>
          </tr>
          <tr v-if="fileHandle.isFile">
            <td>MD5 Hash</td>
            <td>{{ metadata ? metadata.md5 : 'Click info to compute' }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  `
});