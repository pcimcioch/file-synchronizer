Vue.component('dir-handler-info', {
  props: {
    handler: {
      type: Object,
      required: false
    }
  },
  template: `
    <table class="table table-borderless table-sm" v-if="handler">
      <tbody>
        <tr>
          <td>Name</td>
          <td>{{ handler.name }}</td>
        </tr>
      </tbody>
    </table>
  `
});