<template lang="pug">
  div
    span(v-for="lang in languages")
      q-btn(:class="{active: currentLocale === lang.value}" unelevated round size="md" :to="{params: {lang: lang.value}}")
        q-icon(:name="lang.image")
</template>

<style scoped lang="stylus">
  .active
    background-image url("/statics/000-flags-select.svg")
</style>

<script>
export default {
  name: 'lang-switcher-flags',
  computed: {
    currentLocale () {
      console.log({ 'language': this.$root.$i18n.locale })
      return this.$root.$i18n.locale
    },
    languages () {
      return [
        { label: 'Cz', value: 'cs', image: 'img:/statics/002-czech-republic.svg' },
        { label: 'Sk', value: 'sk', image: 'img:/statics/003-slovakia.svg' },
        { label: 'En', value: 'en', image: 'img:/statics/001-united-kingdom.svg' }
      ]
    }
  },

  methods: {
    switchLanguage (lang) {
      this.$router.push({
        params: {
          lang: lang.value
        }
      })
    }
  }
}
</script>
