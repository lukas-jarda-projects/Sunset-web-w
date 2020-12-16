// "async" is optional
export default async ({ Vue }) => {
  Vue.prototype.$bus = new Vue({
    data () {
      return {
        $layout: undefined
      }
    }
  })
}
