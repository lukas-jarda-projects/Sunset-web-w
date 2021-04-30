<template lang="pug">
  q-layout(view="lHh Lpr lFf")
    q-header(elevated v-model="headerOpen" class="bg-white")
      //- Hlavicka: logo
      .header.shadow-5
        img.logo(src="~assets/logo-sunset-apartment.svg" height="40px").q-my-md.q-mr-xl
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

body
    margin 0
    font-family Helvetica, sans-serif
    background-color #f4f4f4

a
    color #000

.header
  background-color #fff
  position fixed
  width 100%
  z-index 3
  ul
    margin 0
    padding 0
    list-style none
    overflow hidden
    background-color #fff
  li
    a
      display block
      padding 20px 20px
      text-decoration none
      font-family: 'RedHatDisplay-med'
      font-size: 16px
      color $primary

  .logo
    // display block
    float left
    margin 10px 0 0 30px
    //padding 10px 20px
    text-decoration none
  .menu
    clear both
    max-height 0
    transition max-height .2s ease-out
  .menu-icon
    cursor pointer
    display inline-block
    float right
    padding 28px 20px
    position relative
    user-select none
    .navicon
      background $primary
      display block
      height 3px
      position relative
      transition background .2s ease-out
      width 18px
      &:before
        top 5px
      &:after
        top -5px

  .menu-btn
    display none
    &:checked
      & ~ .menu
        max-height 360px
      & ~ .menu-icon
        .navicon
          background transparent
          &:before
            transform rotate(-45deg)
          &:after
            transform rotate(45deg)

.header li a:hover,
.header .menu-btn:hover
  background-color $accent + 40%

.header .menu-icon .navicon:before,
.header .menu-icon .navicon:after
  background #333
  content ''
  display block
  height 100%
  position absolute
  transition all .2s ease-out
  width 100%

.header .menu-btn:checked ~ .menu-icon:not(.steps) .navicon:before,
.header .menu-btn:checked ~ .menu-icon:not(.steps) .navicon:after
  top 0

@media (min-width: 770px)
  .header
    li
      float left
      a
          padding 20px 30px
    .menu
      clear none
      float right
      max-height none
    .menu-icon
      display none

#nav a:focus, #nav a.active
  color black
  background-color $accent + 40%

</style>
