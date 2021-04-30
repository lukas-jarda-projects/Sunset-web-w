<script>
import get from 'lodash/get'
import { api } from '../api/api'
import { callApi } from '../api/utils/callApi'
import { isLinkCurrent } from '../lib/router/routerUtils'

export default {
  name: 'CommonMixin',
  computed: {
    api () { return api },
    isWeb () { return this.$q.screen.width > 1000 },
    basicDataLoaded () { return this.$store.state.loading.basicDataLoaded },
    currentLocale () {
      return this.$root.$i18n.locale.split('-')[0]
    }
  },
  methods: {
    $tt (key) { return this.$t(`${this.$options.name}.${key}`) },



    isLinkCurrent (link) { return isLinkCurrent(this.$route, this.$router, link) },

    notifySuccess (message) {
      this.$q.notify({
        message,
        position: 'top',
        color: 'positive'
      })
    },

    /**
     * @param {String} event
     * @param {Object} payload
     * @returns {Promise<*>}
     */
    async callApi (event, payload) {
      return callApi(event, payload)
    },

    get
  }
}
</script>
