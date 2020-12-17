<script>

import TinyBox from 'components/TinyBox'

export default {
  name: 'JidelnaGallery',
  components: { TinyBox },
  props: {
    images: { type: Array, required: true }
  },
  data () {
    return {
      index: null,
      headerOpenCache: false
    }
  },

  watch: {
    index: {
      handler () {
        if (this.index === null) {
          this.$bus.$layout.headerOpen = this.headerOpenCache
        }
      }
    }
  },

  methods: {
    open (key) {
      this.headerOpenCache = this.$bus.$layout.headerOpen
      this.$bus.$layout.headerOpen = false
      this.index = key
    }
  }
}
</script>


<template lang="pug">
  div
    .flex.items-center.justify-center.q-gutter-lg
      div.cursor-pointer(v-for="(image, key) in images")
        q-img.gek-screenshots(
          :src="image.thumbnail || image.src"
          :alt="image.alt"
          @click.stop="open(key)")
          .absolute-bottom.text-center(style="height: 1.4em; padding: 0em;margin: 0em;")
            | {{ image.alt }}


    tiny-box(:images="images" v-model="index" :no-thumbs="true" :loop="true")

</template>


<style scoped lang="stylus">
  .gek-screenshots
    width 300px
    border 1px solid $gekon-primary
    box-shadow 0px 0px 5px 0px rgba(0, 0, 0, .18)
</style>
