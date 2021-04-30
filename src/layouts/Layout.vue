<template lang="pug">
q-layout(view="hHh lpR fFf")
  q-header.bg-white.text-primary(elevated, height-hint="98")
    q-toolbar
      q-toolbar-title
        a(href="welcome" @click="$router.push({name: 'welcome'})")
          img.logo(src="~assets/logo-sunset-apartment.svg"
            height="40px").q-mt-md.q-my-sm.q-ml-xl


      q-tabs(align="right" active-color='secondary' indicator-color='secondary').q-mr-xl.gt-sm
        q-route-tab(no-caps to="welcome" label="Úvod" @click="$router.push({name: 'welcome'})").menu-button
        q-route-tab(no-caps to="about" label="O apartmánu" @click="$router.push({name: 'about'})").menu-button
        q-route-tab(no-caps to="photo" label="Foto galerie" @click="$router.push({name: 'photo'})").menu-button
        q-route-tab(no-caps to="contact" label="Kontakt" @click="$router.push({name: 'contact'})").menu-button

      div.q-mr-lg.lt-md
        q-btn(dense flat round icon="menu" @click="right = !right")

      q-drawer(v-model="right" side="right" bordered)

        q-tabs(vertical align="right")
          q-list
            essentiallink(v-for="link in essentialLinks", :key="link.title", v-bind="link")
          q-route-tab(dense no-caps to="welcome", label="Úvod" @click="$router.push({name: 'welcome'})")
          q-route-tab(no-caps to="about", label="O apartmánu" @click="$router.push({name: 'about'})")
          q-route-tab(no-caps to="photo", label="Foto galerie" @click="$router.push({name: 'photo'})")
          q-route-tab(no-caps to="contact", label="Kontakt" @click="$router.push({name: 'contact'})")
          q-btn(dense no-caps flat icon="close" @click="right = !right").menufullwidth zavřít



  q-page-container
    transition(name='slide-fade' appear)
      div
        router-view
        layout-footer.q-mt-lg




    //-  q-layout(view="lHh Lpr lFf")
        q-header(elevated v-model="headerOpen" class="bg-white")
          q-toolbar
            q-toolbar-title
              img.logo(src="~assets/logo-sunset-apartment.svg"
                height="40px").q-my-md.q-mr-xl
            div.gt-sm
              q-btn.menu-button(flat no-caps rounded label="Úvod")
              q-btn.menu-button(flat no-caps rounded color="primary" label="O apartmánu")
              q-btn.menu-button(flat no-caps rounded color="primary" label="Foto galerie")
              q-btn.menu-button(flat no-caps rounded color="primary" label="Kontakt")

            div.lt-md
              q-btn.menu-button(flat no-caps round icon="menu"
                @click="rightDrawerOpen = !rightDrawerOpen"
                )

        q-drawer(v-model="rightDrawerOpen"
          bordered content-class="bg-grey-2")
          q-list
            | sd
            q-item
              q-item-section(avatar)
                q-avatar(color='primary', text-color='white', icon='bluetooth')
              q-item-section Icons only


      //- Hlavicka: logo
        .header.shadow-5
          input#menu-btn.menu-btn(type='checkbox')
          label.menu-icon(for='menu-btn')
            span.navicon

          ul.menu#nav
            li
              a(href="#welcome" @click="$router.push({name: 'welcome'})") Úvod
            li
              a(href="#about" @click="$router.push({name: 'about'})") O apartmánu
            li
              a(href="#photo" @click="$router.push({name: 'photo'})") Foto galerie
            li
              a(href="#contact" @click="$router.push({name: 'contact'})") Kontakt

            //*
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
      headerOpen: true,
      right: false
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
    font-family 'RedHatDisplay-med'
    font-size 16px
    letter-spacing 2px

  // aplikuje se na aktivní menu
  .active
    color $secondary !important
    background-color white !important

  .menu-button
    font-family 'RedHatDisplay-med'
    color $primary
    height 80px

  .menufullwidth
    width 100%
    padding 10px
    color $dark +100

</style>
