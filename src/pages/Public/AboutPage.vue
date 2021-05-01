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
  name: 'AboutPage',

  meta: {
    title: 'AboutPage'
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

  page-section
    h1.text-center O apartmánu
    .flex.justify-center(:class="{'q-gutter-lg': !$q.screen.lt.sm}")

      jidelna-section-double-card
        template(#title) Kuchyň
        template(#icon)
          img(src="~assets/reseni-01.jpg" alt="Chip")
        template(#default)
          div.text-left.ulli
            | V kuchyni je veškeré potřebné vybavení: mikrovlnná trouba, myčka, digestoř, el.trouba, indukční varná deska, kávovar na kávové kapsle, topinkovač, toustovač, rychlovarná konvice, lednice s mrazákem a potřebné kuchyňské nádobí.

      jidelna-section-double-card
        template(#title) Obývací místnost
        template(#icon)
          img(src="~assets/reseni-01.jpg" alt="Chip")
        template(#default)
          div.text-left.ulli
            | Obývací pokoj je vybavený pohodlnou pohovkou s možností úpravy na jedno lůžko  a smart TV s předplaceným kanálem Netflix či YouTube.
            div
              a(href="https://netflix.com" target="_blank")
                img(src="https://api.iconify.design/logos-netflix.svg?height=16").q-ma-lg
              a(href="https://youtube.com" target="_blank")
                img(src="https://api.iconify.design/logos:youtube.svg?height=16").q-ma-lg


      jidelna-section-double-card
        template(#title) Ložnice I
        template(#icon)
          img(src="~assets/reseni-01.jpg" alt="Chip")
        template(#default)
          div.text-left.ulli
            | První ložnice je vybavena vestavěnou skříní se zrcadlem, manželskou postelí a nočními stolky.

      jidelna-section-double-card
        template(#title) Ložnice II
        template(#icon)
          img(src="~assets/reseni-01.jpg" alt="Chip")
        template(#default)
          div.text-left.ulli
            | Druhá ložnice je vybavena vestavěnou skříní a patrovou postelí až pro tři osoby/děti. Je vhodná jako dětská ložnice.

      jidelna-section-double-card
        template(#title) Koupelna I
        template(#icon)
          img(src="~assets/reseni-01.jpg" alt="Chip")
        template(#default)
          div.text-left.ulli
            | Koupelna je vybavená umyvadlem s galerkou, skříňkou na hygienické potřeby, WC, sprchovým koutem a pračkou.

      jidelna-section-double-card
        template(#title) Terasa
        template(#icon)
          img(src="~assets/reseni-01.jpg" alt="Chip")
        template(#default)
          div.text-left.ulli
            | Terasa nabízí nádherný výhled na moře a překrásný večerní západ slunce. Posezení na terase je pro 6 osob.

      jidelna-section-double-card
        template(#title) Podkrovní ložnice
        template(#icon)
          img(src="~assets/reseni-01.jpg" alt="Chip")
        template(#default)
          div.text-left.ulli
            | Podkrovní ložnice disponuje manželskou postelí pro dvě osoby, šatní skříní a komodou. Má samostatnou koupelnu.

      jidelna-section-double-card
        template(#title) Koupelna II
        template(#icon)
          img(src="~assets/reseni-01.jpg" alt="Chip")
        template(#default)
          div.text-left.ulli
            | Podkrovní koupelna je vybavena WC, umyvadlem, skříňkou a sprchovým koutem.

      jidelna-section-double-card
        template(#title) Parkovací stání
        template(#icon)
          img(src="~assets/reseni-01.jpg" alt="Chip")
        template(#default)
          div.text-left.ulli
            | Parkování pro jedno osobní auto je vyhrazeno přímo u apartmánu označené P1, v případě potřeby je možné parkovat druhé auto na parkovištích v blízkosti apartmánu.

      jidelna-section-double-card
        template(#title) Koupání před domem
        template(#icon)
          img(src="~assets/reseni-01.jpg" alt="Chip")
        template(#default)
          div.text-left.ulli
            | Přímo před apartmánem je možnost nádherného koupání, na skalním útesu před apartmánem je skákací můstek a žebřík do vody.

      jidelna-section-double-card
        template(#title) Pláže
        template(#icon)
          img(src="~assets/reseni-01.jpg" alt="Chip")
        template(#default)
          div.text-left.ulli
            | V dosahu apartmánu jsou dvě oblázkové pláže cca 2 minuty chůze po promenádě a ve městečku i písečná pláž, která je v Chorvatsku ojedinělá. V dojezdové vzdálenosti jsou i další krásné pláže, například v blízkém městečku PAG nebo vyhlášená pláž Zrče cca 40 minut autem.

      jidelna-section-double-card
        template(#title) Ostatní vybavení
        template(#icon)
          img(src="~assets/reseni-01.jpg" alt="Chip")
        template(#default)
          div.text-left.ulli
            | Klimatizace/topení, WiFi zdarma, pračka, vysavač, vestavěný sušák na prádlo, kávovar Dolce Gusto.

      jidelna-section-double-card
        template(#title) Obchody a služby v okolí
        template(#icon)
          img(src="~assets/reseni-01.jpg" alt="Chip")
        template(#default)
          div.text-left.ulli
            | V okolí apartmánu se nachází několik restaurací a kaváren, přímo u domu je pizzerie s večerní živou hudbou. V docházkové vzdálenosti je obchod se smíšeným zbožím, pekárna a cukrárna. Večer jsou kolem promenády trhy a zábavní park pro děti s trampolínou a hrami.  Najdete zde i agenturu pořádající výlety a dobrodružné cesty.





</template>
<style scoped lang="stylus">
h2
  margin 40px 0 0 0

.photo-text-section
  display block

</style>
