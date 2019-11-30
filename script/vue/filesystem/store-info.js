export const storeInfo = {
  props: {
    store: {
      type: Object,
      required: false
    }
  },

  template: `
    <table class="table table-borderless table-sm" v-if="store">
      <tbody>
        <tr>
          <td>Name</td>
          <td>{{ store.name }}</td>
        </tr>
      </tbody>
    </table>
  `
};