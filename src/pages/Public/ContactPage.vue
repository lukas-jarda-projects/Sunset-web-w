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
      slideReferences: '1'
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



    .row.items-center.justify-start
      .col-lg-6.col-md-12.col-xs-12.text-left.no-padding.no-margin

        template(v-if="$q.platform.is.desktop")
          img(src="~assets/kontakt-apartman.jpg" height="300px")

        template(v-if="$q.platform.is.mobile")
          img(src="~assets/kontakt-apartman-xs.jpg" width="100%")

      .col-lg-5.col-md-12.col-xs-12
        .column.justify-center
          .row
            .col-2.text-right.q-pr-lg
              span.text-paragraph ulice
            .col
              span.text-paragraph-bold Put Lanterne 7
          .row
            .col-2.text-right.q-pr-lg
              span.text-paragraph město
            .col
              span.text-paragraph-bold Povljana
          .row
            .col-2.text-right.q-pr-lg
              span.text-paragraph ostrov
            .col
              span.text-paragraph-bold Pag
          .row
            .col-2.text-right.q-pr-lg
              span.text-paragraph stát
            .col
              span.text-paragraph-bold Chorvatsko
          .row
            .col-2.text-right.q-pr-lg
              span.text-paragraph GPS
            .col
              span.text-paragraph-bold 44.3491100N &nbsp; 15.0980000E






  page-section(:fullWidth="true")
    .row.justify-end
      .col-12.text-right
        template(v-if="$q.platform.is.desktop")
          img(src="~assets/mapa-z-letadla.jpg").image-right

        template(v-if="$q.platform.is.mobile")
          img(src="~assets/mapa-z-letadla-xs.jpg" width="100%")

  page-section(:fullWidth="true")
    .row
      .col-lg-6.col-md-12
        a(href="https://mapy.cz/s/rasofaloze" target="_blank")
          template(v-if="$q.platform.is.desktop")
            img(src="~assets/map-with-poi.png" height="420px")

          template(v-if="$q.platform.is.mobile")
            img(src="~assets/map-with-poi.png" width="100%")

      .col-lg-4.pad.col-md-12
        .row.items-center.q-mt-lg
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

  page-section.text-center
    h2 Volné termíny
    template(v-if="$q.platform.is.desktop")
      iframe(
        src="https://calendar.google.com/calendar/embed?height=600&wkst=2&bgcolor=%23ffffff&ctz=Europe%2FPrague&showTitle=0&showNav=1&showPrint=0&showTabs=0&showCalendars=0&showTz=0&src=c3Vuc2V0MGFwYXJ0bWVudEBnbWFpbC5jb20&src=ZTQ0YzRiNzU2NTM0OTg1YmVhODYxMDk1ZmMzOWQ4NmE3MTI2M2I3NGZmN2ZjMmRkNzY2ZWQ3OWFlZTdiNjEwMEBncm91cC5jYWxlbmRhci5nb29nbGUuY29t&color=%23D50000&color=%230B8043"
        style="border-width:0" width="800" height="400" frameborder="0" scrolling="no"
      )

    template(v-if="$q.platform.is.mobile")
      iframe(
          src="https://calendar.google.com/calendar/embed?height=600&wkst=2&bgcolor=%23ffffff&ctz=Europe%2FPrague&showTitle=0&showNav=1&showPrint=0&showTabs=0&showCalendars=0&showTz=0&src=c3Vuc2V0MGFwYXJ0bWVudEBnbWFpbC5jb20&src=ZTQ0YzRiNzU2NTM0OTg1YmVhODYxMDk1ZmMzOWQ4NmE3MTI2M2I3NGZmN2ZjMmRkNzY2ZWQ3OWFlZTdiNjEwMEBncm91cC5jYWxlbmRhci5nb29nbGUuY29t&color=%23D50000&color=%230B8043"
          style="border-width:0" width="320" height="400" frameborder="0" scrolling="no"
        )
    //-test


</template>

<style scoped lang="stylus">

$circleSize = 1em

p
  font-family RedHatText-reg
  font-size $alt-text-size

.textCircle
  font-family RedHatDisplay-reg
  margin 0 0 0 20px


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
  marging 0 0 24px 0

.text-paragraph-bold
  font-size $alt-text-size
  font-family RedHatDisplay-med

.col-xs-12
  margin 20px

.col-md
  .image-right
    height auto
    width 100%


.image-left
  height auto
  width 100%


@media screen and (min-width: 1501px)
  .image-right
    height auto
    width 70%
    align right


@media screen and (max-width: 1500px)
  .image-right
    height auto
    width 100%
    align right


</style>
