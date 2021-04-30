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

  page-section(:fullWidth="true")
    q-carousel.top-carousel(
      autoplay swipeable animated v-model="slide"
      arrows navigation infinite height="500px"
      transition-next="jump-left" transition-prev="jump-right").no-alt-scroll

      q-carousel-slide(name="1" img-src="~assets/carusel-sunset-apartment-05.jpg")
        carousel-content
          template(#title) Luxusní
          template(#description) apartmán v&nbsp;první řadě

      q-carousel-slide(name="2" img-src="~assets/carusel-sunset-apartment-06.jpg")
        carousel-content
          template(#title) S&nbsp;přímým
          template(#description) výhledem na moře z 1. patra

  page-section
    .row.q-mt-xl
      .col-xs-12.col-sm-1.col-md-2.col-lg-3
      .col-xs-12.col-sm-9.col-md-7.col-lg-6
        //-&nbsp;s&nbsp;
        h1.text-nadpis.text-secondary.q-my-xs
          | O apartmánu


        h3.text-nadpis.alt-barva-textu
          | Kuchyň
        p.text-body1.alt-barva-textu
          | V kuchyni je veškeré potřebné vybavení: mikrovlnná trouba, myčka, digestoř, el.trouba, indukční varná deska, kávovar na kávové kapsle, topinkovač, toustovač, rychlovarná konvice, lednice s mrazákem a potřebné kuchyňské nádobí.

        p.text-nadpis.alt-barva-textu
          | Obývací místnost
        p.text-body1.alt-barva-textu
          | Obývací pokoj je vybavený pohodlnou pohovkou s možností úpravy na jedno lůžko  a smart TV s předplaceným kanálem Netflix či YouTube

        p.text-nadpis.alt-barva-textu
          | Ložnice I
        p.text-body1.alt-barva-textu
          | První ložnice je vybavena vestavěnou skříní se zrcadlem, manželskou postelí a nočními stolky

        p.text-nadpis.alt-barva-textu
          | Ložnice II
        p.text-body1.alt-barva-textu
          | Druhá ložnice je vybavena vestavěnou skříní a patrovou postelí až pro tři osoby/děti. Je vhodná jako dětská ložnice

        p.text-nadpis.alt-barva-textu
          | Koupelna I
        p.text-body1.alt-barva-textu
          | Koupelna je vybavená umyvadlem s galerkou, skříňkou na hygienické potřeby, WC, sprchovým koutem a pračkou.

        p.text-nadpis.alt-barva-textu
          | Terasa
        p.text-body1.alt-barva-textu
          | Terasa nabízí nádherný výhled na moře a překrásný večerní západ slunce. Posezení na terase je pro 6 osob

        p.text-nadpis.alt-barva-textu
          | Podkrovní ložnice
        p.text-body1.alt-barva-textu
          | Podkrovní ložnice disponuje manželskou postelí pro dvě osoby, šatní skříní a komodou. Má samostatnou koupelnu.

        p.text-nadpis.alt-barva-textu
          | Koupelna II
        p.text-body1.alt-barva-textu
          | Podkrovní koupelna je vybavena WC, umyvadlem, skříňkou a sprchovým koutem

        p.text-nadpis.alt-barva-textu
          | Parkovací stání
        p.text-body1.alt-barva-textu
          | Parkování pro jedno osobní auto je vyhrazeno přímo u apartmánu označené P1, v případě potřeby je možné parkovat druhé auto na parkovištích v blízkosti apartmánu

        p.text-nadpis.alt-barva-textu
          | Koupání před domem
        p.text-body1.alt-barva-textu
          | Přímo před apartmánem je možnost nádherného koupání, na skalním útesu před apartmánem je skákací můstek a žebřík do vody.

        p.text-nadpis.alt-barva-textu
          | Pláže
        p.text-body1.alt-barva-textu
          | V dosahu apartmánu jsou dvě oblázkové pláže cca 2 minuty chůze po promenádě a ve městečku i písečná pláž, která je v Chorvatsku ojedinělá. V dojezdové vzdálenosti jsou i další krásné pláže, například v blízkém městečku PAG nebo vyhlášená pláž Zrče cca 40 minut autem

        p.text-nadpis.alt-barva-textu
          | Ostatní vybavení
        p.text-body1.alt-barva-textu
          | Klimatizace/topení, WiFi zdarma, pračka, vysavač, vestavěný sušák na prádlo, kávovar Dolce Gusto

        p.text-nadpis.alt-barva-textu
          | Obchody a služby v okolí
        p.text-body1.alt-barva-textu
          | V okolí apartmánu se nachází několik restaurací a kaváren, přímo u domu je pizzerie s večerní živou hudbou. V docházkové vzdálenosti je obchod se smíšeným zbožím, pekárna a cukrárna. Večer jsou kolem promenády trhy a zábavní park pro děti s trampolínou a hrami.  Najdete zde i agenturu pořádající výlety a dobrodružné cesty.


        //page-section
          .row.justify-center.q-mt-md
            .col-12.text-center
              jidelna-gallery(:images="imagesJidelna")

</template>
