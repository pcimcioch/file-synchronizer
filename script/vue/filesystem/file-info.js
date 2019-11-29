import {bytes, date} from '../filters.js';

// !TODO make proper class hierarchy so it can be used in props.type
export const fileInfo = {
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
  filters: {
    bytes: bytes,
    date: date
  },
  template: `
    <div>
      <table class="table table-borderless table-sm" v-if="file">
        <tbody>
          <tr>
            <td>Name</td>
            <td>{{ file.name }}</td>
          </tr>
          <tr v-if="file.isFile">
            <td>Size</td>
            <td>{{ file.size | bytes }}</td>
          </tr>
          <tr v-if="file.isFile">
            <td>Last Modified</td>
            <td>{{ file.lastModified | date }}</td>
          </tr>
          <tr v-if="file.isFile">
            <td>MD5 Hash</td>
            <td v-if="file.md5">{{ file.md5 }}</td>
            <td v-else><button class="btn btn-sm btn-warning pl-1 pr-1 pt-0 pb-0" @click="showHash">Compute</button></td>
          </tr>
        </tbody>
      </table>
    </div>
  `
};