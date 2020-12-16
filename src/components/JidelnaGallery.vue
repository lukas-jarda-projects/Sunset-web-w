<script>

import TinyBox from 'components/TinyBox'

const images = [
  { src: 'statics/jidelnasql/images/jidelnasql_1.png', alt: 'Titulní obrazovka', thumbnail: null },
  { src: 'statics/jidelnasql/images/jidelnicek_2.jpg', alt: 'Jídelníček', thumbnail: null },
  { src: 'statics/jidelnasql/images/evidence_stravniku.jpg', alt: 'Evidence strávníků', thumbnail: null },
  { src: 'statics/jidelnasql/images/platby_za_stravu.jpg', alt: 'Platby', thumbnail: null },
  { src: 'statics/jidelnasql/images/pokladna1.jpg', alt: 'Pokladna', thumbnail: null },
  { src: 'statics/jidelnasql/images/generator_tiskovych_sestav.jpg', alt: 'Generátor tiskových sestav', thumbnail: null },
  { src: 'statics/jidelnasql/images/cenik.jpg', alt: 'Ceník', thumbnail: null },
  { src: 'statics/jidelnasql/images/pokladna.jpg', alt: 'Pokladna', thumbnail: null }
]

export default {
  name: 'JidelnaGallery',
  components: { TinyBox },
  data () {
    return {
      index: null,
      headerOpenCache: false
    }
  },
  computed: {
    images () {
      return images
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
