<script>
import AnimatedNumber from 'components/AnimatedNumber'
import CarouselContent from 'components/CarouselContent'
import PageSectionDoubleCard from 'components/PageSectionDoubleCard'
import ReferenceCard from 'components/ReferenceCard'
import JidelnaGallery from 'components/JidelnaGallery'
import JidelnaSectionDoubleCard from 'components/JidelnaSectionDoubleCard'
import JidelnaSectionPriceCard from 'components/JidelnaSectionPriceCard'
import JidelnaSectionBlogCard from 'components/JidelnaSectionBlogCard'
import PageSection from 'components/PageSection'
import PageSectionCard from 'components/PageSectionCard'
import LayoutFooter from 'layouts/LayoutFooter'
import { scroll, date } from 'quasar'

const { setScrollPosition, getScrollTarget } = scroll

function formatDate (datum, format) {
  return date.formatDate(datum, format, {
    months: ['leden', 'únor', 'březen', 'duben', 'květen', 'červen', 'červenec', 'srpen', 'září', 'říjen', 'listopad', 'prosinec'],
    monthsShort: ['led', 'ún', 'bře', 'dub', 'kvě', 'čer', 'čvc', 'srp', 'zář', 'říj', 'lis', 'pro'],
    days: ['neděle', 'pondělí', 'úterý', 'středa', 'čtvrtek', 'pátek', 'sobota'],
    daysShort: ['ne', 'po', 'út', 'st', 'čt', 'pá', 'so']
  })
}

export default {
  name: 'PhotoPage',

  meta: {
    title: 'Sunset-apartment'
  },

  components: {
    JidelnaGallery,
    AnimatedNumber,
    JidelnaSectionDoubleCard,
    JidelnaSectionPriceCard,
    JidelnaSectionBlogCard,
    ReferenceCard,
    CarouselContent,
    PageSectionDoubleCard,
    LayoutFooter,
    PageSectionCard,
    PageSection
  },

  data () {
    return {
      slide: '1',
      slideReferences: '1',
      tab: 'internetoveobj',
      imagesInternet: [
        { src: 'statics/galerie/3159.jpg', alt: 'Obývák', thumbnail: null },
        { src: 'statics/galerie/3154.jpg', alt: 'Obývák', thumbnail: null },
        { src: 'statics/galerie/3157.jpg', alt: 'Obývák', thumbnail: null },
        { src: 'statics/galerie/3184.jpg', alt: 'Kuchyň', thumbnail: null },
        { src: 'statics/galerie/3180.jpg', alt: 'Předsíň', thumbnail: null },
        { src: 'statics/galerie/3151.jpg', alt: 'Interiér', thumbnail: null },
        { src: 'statics/galerie/3213.jpg', alt: 'Interiér', thumbnail: null },
        { src: 'statics/galerie/3216.jpg', alt: 'Interiér', thumbnail: null },
        { src: 'statics/galerie/3125.jpg', alt: 'Veranda', thumbnail: null },
        { src: 'statics/galerie/3126.jpg', alt: 'Veranda', thumbnail: null },
        { src: 'statics/galerie/3083.jpg', alt: 'Ložnice I', thumbnail: null },
        { src: 'statics/galerie/3089.jpg', alt: 'Ložnice I', thumbnail: null },
        { src: 'statics/galerie/3094.jpg', alt: 'Ložnice I', thumbnail: null },
        { src: 'statics/galerie/3087.jpg', alt: 'Výhled z ložnice I', thumbnail: null },
        // { src: 'statics/galerie/3193.jpg', alt: 'Koupelna I', thumbnail: null },
        // { src: 'statics/galerie/3196.jpg', alt: 'Koupelna I', thumbnail: null },
        { src: 'statics/galerie/3131.jpg', alt: 'Ložnice II (dětská)', thumbnail: null },
        { src: 'statics/galerie/3136.jpg', alt: 'Ložnice II (dětská)', thumbnail: null },
        { src: 'statics/galerie/3147.jpg', alt: 'Ložnice II (dětská)', thumbnail: null },
        { src: 'statics/galerie/3197.jpg', alt: 'Koupelna I', thumbnail: null },
        { src: 'statics/galerie/3199.jpg', alt: 'Koupelna I', thumbnail: null },
        // { src: 'statics/galerie/3014.jpg', alt: 'Podkroví', thumbnail: null },
        { src: 'statics/galerie/3025.jpg', alt: 'Podkroví', thumbnail: null },
        { src: 'statics/galerie/3024.jpg', alt: 'Podkroví', thumbnail: null },
        { src: 'statics/galerie/3061.jpg', alt: 'Podkroví', thumbnail: null },
        // { src: 'statics/galerie/3060.jpg', alt: 'Podkroví', thumbnail: null },
        // { src: 'statics/galerie/3036.jpg', alt: 'Koupelna II', thumbnail: null },
        { src: 'statics/galerie/3052.jpg', alt: 'Koupelna II', thumbnail: null },
        { src: 'statics/galerie/3042.jpg', alt: 'Koupelna II', thumbnail: null },

        { src: 'statics/galerie/3225.jpg', alt: 'Dům', thumbnail: null },
        { src: 'statics/galerie/3236.jpg', alt: 'Parking', thumbnail: null },
        { src: 'statics/galerie/3237.jpg', alt: 'Parking', thumbnail: null },
        { src: 'statics/galerie/3239.jpg', alt: 'Parking', thumbnail: null },
        { src: 'statics/galerie/3232.jpg', alt: 'Koupání před domem', thumbnail: null },
        { src: 'statics/galerie/3231.jpg', alt: 'Okolí domu', thumbnail: null },
        { src: 'statics/galerie/111304.jpg', alt: 'Okolí domu', thumbnail: null },
        { src: 'statics/galerie/112024.jpg', alt: 'Okolí domu', thumbnail: null },
        { src: 'statics/galerie/112047.jpg', alt: 'Okolí domu', thumbnail: null },
        { src: 'statics/galerie/112250.jpg', alt: 'Okolí domu', thumbnail: null },
        { src: 'statics/galerie/105845.jpg', alt: 'Pláž', thumbnail: null },
        { src: 'statics/galerie/120512.jpg', alt: 'Pláž', thumbnail: null },
        { src: 'statics/galerie/120755.jpg', alt: 'Pláž', thumbnail: null },
        { src: 'statics/galerie/0122.jpg', alt: 'Pohled na Povljanu', thumbnail: null },
        { src: 'statics/galerie/0123.jpg', alt: 'Pohled na Povljanu', thumbnail: null },
        { src: 'statics/galerie/0111.jpg', alt: 'Pohled na Povljanu', thumbnail: null },
        { src: 'statics/galerie/0115.jpg', alt: 'Pohled na apartmán', thumbnail: null },
        // { src: 'statics/galerie/0125.jpg', alt: 'Pohled z dronu', thumbnail: null },
        { src: 'statics/galerie/3241.jpg', alt: 'Most na ostrov Pag', thumbnail: null },
        { src: 'statics/galerie/3248.jpg', alt: 'Ostrov Pag', thumbnail: null },
        { src: 'statics/galerie/000074.jpg', alt: 'Ostrov Pag', thumbnail: null },
        { src: 'statics/galerie/_1zapadslunce.jpg', alt: 'Západ slunce na Pagu', thumbnail: null },
        { src: 'statics/galerie/_ostrov1Pag000093.jpg', alt: 'Ostrov Pag', thumbnail: null },
        { src: 'statics/galerie/_ostrov2Pag000089.jpg', alt: 'Ostrov Pag', thumbnail: null },
        { src: 'statics/galerie/_ostrov3Pag000036.jpg', alt: 'Ostrov Pag', thumbnail: null },
        { src: 'statics/galerie/_ostrov5mesteckoPag000022.jpg', alt: 'Městečko Pag', thumbnail: null }


      ]
    }
  },

  methods: {
    login () {
      window.location.href = 'https://jidelna-sql.altisima.cz'
    },

    scrollToObjednat () {
      // console.log('objednat clicked')
      // console.log({ 'this.$refs': this.$refs })
      const el = this.$refs.formular.$el
      // console.log({ 'el': el })
      const target = getScrollTarget(el)
      const offset = el.offsetTop
      const duration = 600
      setScrollPosition(target, offset, duration)
    },

    formatDate (datum) {
      return formatDate(datum, 'DD MMMM, YYYY')
    }
  }

}
</script>

<template lang="pug">
  q-page.bg-white
    page-section
      .row.q-mt-xl
        .col-xs-12.col-sm-1.col-md-2.col-lg-3
        .col-xs-12.col-sm-9.col-md-7.col-lg-6

    page-section
      h1.text-center Fotogalerie
      .q-pa-md
        jidelna-gallery(:images="imagesInternet")

</template>

<style scoped lang="stylus">


</style>
