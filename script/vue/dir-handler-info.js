Vue.component('dir-handler-info', {
  props: ['handler'],
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