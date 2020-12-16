<template lang="pug">
  q-layout(view="lHh Lpr lFf" class="is-gekon")
    q-header(elevated reveal v-model="headerOpen").layout-header
      q-toolbar.page-fixed-width
        img(src="~/assets/logo-jidelnasql.svg" alt="Logo Dorsys" width="150")
        q-toolbar-title
        | JIDELNA
        // lang-switcher-flags
    q-page-container.jidelnasql-bg-img
      transition(name='slide-fade' appear)
        div
          router-view
          layout-footer.q-mt-lg

</template>

<script>
import LangSwitcherFlags from 'components/LangSwitcherFlags'
import LayoutFooter from './LayoutFooter'

// const languages = ['cs', 'sk', 'en']

export default {
  name: 'MainLayout',
  components: { LangSwitcherFlags, LayoutFooter },

  mounted () {
    this.$bus.$layout = this
  },


  props: {
    lang: {
      type: String,
      default: 'cs'
    }
  },

  watch: {
    lang: {
      immediate: true,
      handler (lang) {
        this.$root.$i18n.locale = lang
      }
    }
  },

  data () {
    return {
      headerOpen: true
    }
  }

}
</script>

<style lang="stylus" scoped>
  .layout-header
    background white

  //- page transition
  .slide-fade-enter-active {
    transition: all .5s ease-in;
  }

  .slide-fade-leave-active {
    transition: all .2s ease-out;
  }

  .slide-fade-enter {
    transform: translateX(0px);
    opacity: 0;
  }

  .slide-fade-leave-to {
    transform: translateX(0px);
    opacity: 0;
  }
</style>

<style lang="stylus">

</style>
