<template lang="pug">
q-layout(view="hHh lpR fFf")
  q-header.bg-white.text-primary(elevated height-hint="98")
    q-toolbar
      q-toolbar-title
        a(href="#" @click="$router.push({name: 'index'})")
          img.logo(src="~assets/logo-sunset-apartment.svg"
            height="40px" style="z-index: 2").q-mt-md.q-my-sm.q-ml-lg

      // desktop menu
      q-tabs(align="right" active-color='secondary' indicator-color='secondary').q-mr-lg.gt-sm

        q-route-tab(no-caps to="/"
          @click="$router.push({name: 'index'})").q-px-lg.menu-button.menu-text-style Úvod

        q-route-tab(no-caps to="/about"
          @click="$router.push({name: 'about'})").q-px-lg.menu-button.menu-text-style O apartmánu

        q-route-tab(no-caps to="/photo"
          @click="$router.push({name: 'photo'})").q-px-lg.menu-button.menu-text-style Fotogalerie

        q-route-tab(no-caps to="/contact"
          @click="$router.push({name: 'contact'})").q-px-lg.menu-button.menu-text-style Kontakt

      div
        q-btn(flat no-caps icon-right="menu" label="Menu" @click="right = !right" size="lg").menu-button


      // mobile menu
      q-drawer(v-model="right" side="right" bordered)
        q-tabs(vertical align="right" active-color='secondary' indicator-color='secondary' content-class='menu-text-style')
          q-list.text-body3.q-mt-xl

          q-route-tab(no-caps to="/" @click="$router.push({name: 'index'})").menu-text-style Úvod
          q-route-tab(no-caps to="/about" @click="$router.push({name: 'about'})").menu-text-style O apartmánu
          q-route-tab(no-caps to="/photo" @click="$router.push({name: 'photo'})").menu-text-style Fotogalerie
          q-route-tab(no-caps to="/contact" @click="$router.push({name: 'contact'})").menu-text-style Kontakt

          q-btn(dense no-caps flat icon="close" @click="right = !right").menufullwidth zavřít




  q-page-container.transition(name='slide-fade' appear)
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
      headerOpen: false,
      right: false
    }
  }
}

</script>

<style lang="stylus">

.text-body3
  font-size 56px !important
  color $accent
  text-align center


//- page transition
.slide-fade-enter-active {
  transition: all 3s ease-in;
}

.slide-fade-leave-active {
  transition: all 3s ease-out;
}

.slide-fade-enter {
  transform: translateX(0px);
  opacity: 0;
}

.slide-fade-leave-to {
  transform: translateX(0px);
  opacity: 0;
}

.menu-text-style
  font-family 'RedHatDisplay-med'
  font-size 18px !important

// aplikuje se na aktivní menu
.menu-button
  color $primary
  height 80px
  padding 0 50px
  letter-spacing 0.6px

.menufullwidth
  font-size 18px  !important
  width 100%
  margin-top 10px
  padding 10px
  color $dark +150


</style>
