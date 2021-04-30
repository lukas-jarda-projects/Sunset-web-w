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
    h1.text-center Foto galerie
    .q-pa-md
      .q-gutter-y-md()
        q-card.no-shadow
          q-tabs.text-primary(v-model='tab' no-caps active-color='secondary' indicator-color='secondary')
            q-tab(name='internetoveobj' label='Internetové objednávky')
            q-tab(name='jidelnasql' label='JídelnaSQL')
            q-tab(name='objednavkovyterminal' label='Objednávkový terminál')
            q-tab(name='vydejniterminal' label='Výdejní terminál')
            q-tab(name='zolik' label='Tisk stravenek')
          q-separator

          q-tab-panels(v-model='tab' animated='')
            q-tab-panel(name='internetoveobj')
              jidelna-gallery(:images="imagesInternet")
            q-tab-panel(name='jidelnasql')
              jidelna-gallery(:images="imagesJidelna")
            q-tab-panel(name='objednavkovyterminal')
              jidelna-gallery(:images="imagesObjednavkovy")
            q-tab-panel(name='vydejniterminal')
              jidelna-gallery(:images="imagesVydej")
            q-tab-panel(name='zolik')
              jidelna-gallery(:images="imagesZolik")

</template>

<style scoped lang="stylus">


</style>
