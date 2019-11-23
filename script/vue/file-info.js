Vue.component('file-info', {
  props: {
    file: {
      type: FileSystemHandle,
      required: false
    }
  },
  template: `
    <table class="table table-borderless table-sm" v-if="file">
      <tbody>
        <tr>
          <td>Name</td>
          <td>{{ file.name }}</td>
        </tr>
      </tbody>
    </table>
  `
});