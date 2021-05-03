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
  name: 'ContactPage',

  meta: {
    title: 'ContactPage'
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
        { src: 'statics/galerie/int-obj/1_objednavka.png', alt: 'Objednávka', thumbnail: null },
        { src: 'statics/galerie/int-obj/2_prehled.PNG', alt: 'Přehled', thumbnail: null },
        { src: 'statics/galerie/int-obj/3_finance.png', alt: 'Finance', thumbnail: null },
        { src: 'statics/galerie/int-obj/4_maily.png', alt: 'Maily', thumbnail: null }
      ],
      imagesJidelna: [
        { src: 'statics/galerie/jid-sql/1_titulni-orbazovka.jpg', alt: 'Titulní obrazovka', thumbnail: null },
        { src: 'statics/galerie/jid-sql/2_jidelnicek.jpg', alt: 'Jídelníček', thumbnail: null },
        { src: 'statics/galerie/jid-sql/3_pokladna.jpg', alt: 'Pokladna', thumbnail: null }
      ],
      imagesObjednavkovy: [
        { src: 'statics/galerie/obj-ter/1_TT1703.jpg', alt: 'Terminál', thumbnail: null },
        { src: 'statics/galerie/obj-ter/2_TT1703.jpg', alt: 'Terminál', thumbnail: null },
        { src: 'statics/galerie/obj-ter/3_identifikace.jpg', alt: 'Identifikace', thumbnail: null },
        { src: 'statics/galerie/obj-ter/4_objednavka.jpg', alt: 'Objednávka', thumbnail: null }
      ],
      imagesVydej: [
        { src: 'statics/galerie/vyd-ter/1_TT3503vydej.jpg', alt: 'Terminál výdej', thumbnail: null },
        { src: 'statics/galerie/vyd-ter/2_identifikace.jpg', alt: 'Identifikace', thumbnail: null },
        { src: 'statics/galerie/vyd-ter/3_vydej.jpg', alt: 'Výdej', thumbnail: null },
        { src: 'statics/galerie/vyd-ter/4_TT3511semafor.jpg', alt: 'Semafor na terminálu', thumbnail: null }
      ],
      imagesZolik: [
        { src: 'statics/galerie/zolik/zolik-config.jpg', alt: 'Žolík konfigurace', thumbnail: null },
        { src: 'statics/galerie/zolik/zolik-menu.jpg', alt: 'Žolík nabídka', thumbnail: null },
        { src: 'statics/galerie/zolik/zolik-open.jpg', alt: 'Žolík výměna papíru', thumbnail: null },
        { src: 'statics/galerie/zolik/zolik-print.jpg', alt: 'Žolík tisk', thumbnail: null }
      ],
      blogPosts: []
    }
  },

  methods: {
    login () {
      window.location.href = 'https://sunset-apartment.com'
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
  q-page
    page-section
      .row.q-mt-xl


    page-section(:fullWidth="true")
      h1.text-center Kontakt
      .row.items-center
        .col-lg-7.col-md-12
          img(src="~assets/kontakt-apartman.jpg" height="300px")
        .col-lg-4.col-md-12.col-xs-12
          .column.q-my-lg
            .col-6
              span.text-paragraph ulice &nbsp;
              span.text-paragraph-bold Kralja Tomislava 45
            .col.q-mb-sm
              span.text-paragraph město &nbsp;
              span.text-paragraph-bold Povljana
            .col.q-mb-sm
              span.text-paragraph ostrov &nbsp;
              span.text-paragraph-bold Pag
            .col.q-mb-sm
              span.text-paragraph stát &nbsp;
              span.text-paragraph-bold Chorvatsko
            .col.q-mb-sm
              span.text-paragraph GPS &nbsp;
              span.text-paragraph-bold 44.3491100N &nbsp; 15.0980000E

    page-section(:fullWidth="true")
      a(href="https://mapy.cz/s/rasofaloze" target="_blank")
        q-carousel.top-carousel(v-model="slide" height="500px")
          q-carousel-slide(name="1" img-src="~assets/carusel-sunset-apartment-10.jpg")
            carousel-content
              template(#title) <br><br><br>
              template(#description) ul. Kralja Tomislava 45 <br> Povljana - ostrov Pag

    page-section(:fullWidth="true")
      .row.q-mt-sm
        .col-lg-7.col-md-12
          img(src="~assets/map-with-poi.png" height="500px")
        .col-lg-4.pad.col-md-12
          .row.items-center.q-mt-xl
            .col-1
              .numberCircle 1
            .col.text-left.q-mt-sm.q-ml-sm
              .text &nbsp; apartmán

          .row.items-center
            .col-1
              .numberCircle.red 2
            .col.text-left.q-mt-sm.q-ml-sm
              .text &nbsp; pláž Dubrovník

          .row.items-center
            .col-1
              .numberCircle.red 3
            .col.text-left.q-mt-sm.q-ml-sm
              .text &nbsp; pláž Malý Dubrovník

          .row.items-center
            .col-1
              .numberCircle.red 4
            .col.text-left.q-mt-sm.q-ml-sm
              .text &nbsp; obchod, cukrárna

          .row.items-center
            .col-1
              .numberCircle.red 5
            .col.text-left.q-mt-sm.q-ml-sm
              .text &nbsp; pošta

          .row.items-center
            .col-1
              .numberCircle.red 6
            .col.text-left.q-mt-sm.q-ml-sm
              .text &nbsp; lékárna

          .row.items-center
            .col-1
              .numberCircle.red 7
            .col.text-left.q-mt-sm.q-ml-sm
              .text &nbsp; pekárna

          .row.items-center
            .col-1
              .numberCircle.red 8
            .col.text-left.q-mt-sm.q-ml-sm
              .text &nbsp; centrum obce

          .row.items-center
            .col-1
              .numberCircle.red 9
            .col.text-left.q-mt-sm.q-ml-sm
              .text &nbsp; supermarket


</template>

<style scoped lang="stylus">
p
  font-family RedHatText-reg
  font-size $alt-text-size

.textCircle
  font-family RedHatDisplay-reg
  margin 0 0 0 20px
/*
  .numberCircle
    width 35px
    height 35px

    padding 10px
    border-radius 50%
    text-align center
    margin 0 0 20px 0



    */

$circleSize = 1em

.numberCircle
  font-size 23px
  font-family RedHatDisplay-bld
  color black
  border 3px solid #ed7d31
  background $accent
  width $circleSize
  height $circleSize
  box-sizing initial
  text-align center
  border-radius 50%
  line-height 1em
  box-sizing content-box
  margin-top 17px

.red
  background red !important

.text
  font-size 20px
  font-family $alt-text-font

.text-paragraph
  font-size $alt-text-size
  font-family $alt-text-font

.text-paragraph-bold
  font-size $alt-text-size
  font-family RedHatDisplay-med

.col-xs-12
  margin 20px


</style>
