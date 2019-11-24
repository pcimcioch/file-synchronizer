Vue.component('file-info', {
  props: {
    file: {
      type: Object,
      required: false
    }
  },
  methods: {
    showHash: async function() {
      if (!this.file || !this.file.isFile) {
        return;
      }

      await this.file.computeMd5();
    }
  },
  template: `
    <div>
      <button class="btn btn-sm btn-info far fa-question-circle" title="Get Hash" v-on:click="showHash"></button>
      <table class="table table-borderless table-sm" v-if="file">
        <tbody>
          <tr>
            <td>Name</td>
            <td>{{ file.name }}</td>
          </tr>
          <tr v-if="file.isFile">
            <!-- TODO: size in human readable form -->
            <td>Size</td>
            <td>{{ file.size }}</td>
          </tr>
          <tr v-if="file.isFile">
            <!-- TODO: date in human readable form -->
            <td>Last Modified</td>
            <td>{{ file.lastModified }}</td>
          </tr>
          <tr v-if="file.isFile">
            <td>MD5 Hash</td>
            <!-- TODO: button to compute in this place -->
            <td>{{ file.md5 || 'Click info to compute' }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  `
});