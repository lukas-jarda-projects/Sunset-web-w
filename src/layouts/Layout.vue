<template lang="pug">
q-layout(view="hHh lpR fFf")
  q-header.bg-white.text-primary(elevated, height-hint="98")
    q-toolbar
      q-toolbar-title
        a(href="#" @click="$router.push({name: 'index'})")
          img.logo(src="~assets/logo-sunset-apartment.svg"
            height="40px" style="z-index: 2").q-mt-md.q-my-sm.q-ml-lg


      q-tabs(align="right" active-color='secondary' indicator-color='secondary').q-mr-lg.gt-sm
        q-route-tab(no-caps to="" label="Úvod"
          @click="$router.push({name: 'index'})").q-px-lg

        q-route-tab(no-caps to="about" label="O apartmánu"
          @click="$router.push({name: 'about'})").q-px-lg

        q-route-tab(no-caps to="photo" label="Foto galerie"
          @click="$router.push({name: 'photo'})").q-px-lg

        q-route-tab(no-caps to="contact" label="Kontakt"
          @click="$router.push({name: 'contact'})").q-px-lg

      div.q-mr-lg.lt-md
        q-btn(dense flat round icon="menu" @click="right = !right")

      q-drawer(v-model="right" side="right" bordered)

        q-tabs(vertical align="right" active-color='secondary' indicator-color='secondary')
          q-list.text-body3.q-mt-xl
          q-route-tab(dense no-caps to="", label="Úvod" @click="$router.push({name: 'index'})")
          q-route-tab(no-caps to="about", label="O apartmánu" @click="$router.push({name: 'about'})")
          q-route-tab(no-caps to="photo", label="Foto galerie" @click="$router.push({name: 'photo'})")
          q-route-tab(no-caps to="contact", label="Kontakt" @click="$router.push({name: 'contact'})")
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



// aplikuje se na aktivní menu
.active
  color $secondary !important
  background-color white !important

.menu-button
  // font-size 24px !important
  font-family 'RedHatDisplay-bld'
  color $primary
  height 80px
  padding 0 80px
  letter-spacing 2px
  //margin 0 20px

.menufullwidth
  font-size 24px
  width 100%
  padding 10px
  color $dark +150




</style>
