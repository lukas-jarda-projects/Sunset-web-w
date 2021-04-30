<template lang="pug">
  q-layout(view="lHh Lpr lFf")
    q-header(elevated v-model="headerOpen" class="bg-white")
      q-toolbar
        //- Hlavicka: logo
        q-toolbar-title
          .flex.items-center.justify-center.text-primary
            img(src="~assets/logo-sunset-apartment.svg" height="40px").q-my-md.q-mr-xl

            q-btn.text-body1.rounded-button(
              unelevated no-caps rounded
              @click="$router.push({name: 'welcome'})") Úvod

            q-btn.text-body1.rounded-button(
              unelevated no-caps rounded
              @click="$router.push({name: 'about'})") O apartmánu


              // :class="{active: isLinkCurrent({name: 'contact'})}"
            q-btn.text-body1.rounded-button(
              unelevated no-caps rounded
              @click="$router.push({name: 'contact'})") Kontakt


    q-page-container
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

  data () {
    return {
      headerOpen: true
    }
  }

}
</script>

<style lang="stylus" scoped>

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

  .text-body1
    font-family: 'RedHatDisplay-med'
    font-size: 16px
    letter-spacing: 2px

  // aplikuje se na aktivní menu
  .active
    color $secondary !important
    background-color white !important

</style>
