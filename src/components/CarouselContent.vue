<script>
export default {
  name: 'CarouselContent',
  computed: {
    classes () {
      if (this.$q.screen.lt.md) {
        return {
          'is-small': true
        }
      }
      return {}
    }
  }
}
</script>

<template lang="pug">
  .page-fixed-width.absolute-center()
    q-slide-transition(appear :duration="1500" )
      div(:class="classes").text-center
        h6
          slot(name="semi-title")
        h1
          slot(name="title")
        p
          slot(name="description")

</template>

<style scoped lang="stylus">
  h1
    font-family RedHatDisplay-bld
    color white
    font-size 77px
    line-height 1.3em
    margin 0
    padding 0
    text-shadow 0px 0px 5px #000000

  h6
    font-family RedHatDisplay-med
    color white
    font-size 33px
    font-width bold
    line-height 1.3em
    letter-spacing .035rem
    margin 0
    padding 0
    text-shadow 0px 0px 5px #000000

  p
    font-family RedHatDisplay-med
    color white
    font-size 20px
    line-height 1.3em
    letter-spacing .035rem
    margin 15px
    padding 0
    text-shadow 0px 0px 5px #000000

  .is-small
    h1
      color white
      font-size 42px
      font-width bold
      line-height 1.2em
      letter-spacing .035rem
      margin 0
      padding 0

    h6
      color white
      font-size 20px
      font-width bold
      line-height 1.3em
      letter-spacing .035rem
      margin 0
      padding 0

    p
      color white
      font-size 16px
      line-height 1.3em
      letter-spacing .035rem
      margin 5px
      padding 0

</style>
