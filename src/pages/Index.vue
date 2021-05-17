<script>
import AnimatedNumber from 'components/AnimatedNumber'
import CarouselContent from 'components/CarouselContent'
import PageSectionDoubleCard from 'components/PageSectionDoubleCard'
import ReferenceCard from 'components/ReferenceCard'
import JidelnaGallery from 'components/JidelnaGallery'
import JidelnaSectionDoubleCard from 'components/JidelnaSectionDoubleCard'
import JidelnaSectionPriceCard from 'components/JidelnaSectionPriceCard'
import JidelnaSectionBlogCard from 'components/JidelnaSectionBlogCard'
import JidelnaFormular from '../components/Formular'
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
  name: 'IndexPage',

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
    JidelnaFormular,
    LayoutFooter,
    PageSectionCard,
    PageSection
  },

  data () {
    return {
      slide: '1',
      slideReferences: '1',
      tab: 'internetoveobj'
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
    page-section(:fullWidth="true")

    q-carousel.top-carousel(
      :autoplay="2800" swipeable animated v-model="slide"
      arrows navigation infinite height="500px"
      transition-next="jump-left" transition-prev="jump-right").no-alt-scroll

      q-carousel-slide(name="1" img-src="~assets/carusel-sunset-apartment-01.jpg")
        carousel-content
          template(#title) Luxusní apartmán
          // template(#description) apartmán v&nbsp;první řadě

      q-carousel-slide(name="2" img-src="~assets/carusel-sunset-apartment-02.jpg")
        carousel-content
          template(#title) S&nbsp;přímým výhledem<br>na moře
          // template(#description) výhledem na moře z 1. patra

      q-carousel-slide(name="3" img-src="~assets/carusel-sunset-apartment-03.jpg")
        carousel-content
          template(#title) Křišťálově<br>čisté moře
          // template(#description) a křišťálově čisté moře <br> s nádhernými plážemi

      q-carousel-slide(name="4" img-src="~assets/carusel-sunset-apartment-04.jpg")
        carousel-content
          template(#title) Objevte krásy ostrova Pag
          // template(#description) nejjižnější ostrov z vnitřního pásu <br> Kvarnerského souostroví



    page-section.section-nadpis.text-center
      .row.justify-center.page-section-ourstory
        .col-xs-12.col-sm-12.col-md-12
          h2 Luxusní poschoďový apartmán <br>v první řadě s přímým výhledem na moře
        .col-xs-12.col-sm-8.col-md-6.q-mt-lg
          p.text-paragraph Nově postavený, pohodlně vybavený apartmán o velikosti 4kk pro 4–8 osob s plně vybavenou kuchyní, 3 ložnice, 2 koupelny a balkon s výhledem na otevřené moře. Apartmán je umístěný na skalnatém výběžku ostrova PAG v městečku Povljana, pár minut v docházkové vzdálenosti od pláže.
          p.text-paragraph Krásné a křišťálově čisté moře s nádhernými plážemi, malebné vesničky, kde se zastavil čas, čistá a nedotčená příroda, jedinečné klima a teplé prosluněné počasí s minimem srážek. To je ostrov Pag a jeho letovisko Povljana.


    page-section
      div.q-mb-lg
        h2 Jak se dostat do Povljany
      .flex.q-gutter-sm(:class="{'justify-center': $q.screen.gt.xs}")
        a.invisible-link(href="https://www.google.cz/maps/dir/Praha/Povljana,+Chorvatsko/@46.5479148,6.4374715,6z/data=!4m13!4m12!1m5!1m1!1s0x470b939c0970798b:0x400af0f66164090!2m2!1d14.4378005!2d50.0755381!1m5!1m1!1s0x4762210f43b9d72b:0x400ad50862bc880!2m2!1d15.1128014!2d44.3461794" target="_blank")
          page-section-card
            template(#icon)
              q-icon(name="directions_car" style="font-size: 36px;").text-accent
              //img(src="~assets/logo-sa-icon.svg" alt="Icona" height="36px")
            template(#title) Autem
            template
              | Cesta autem vám čistého času zabere cca 9 hodin, celá cesta je kromě části v ČR a posledních 50 Km před Pagem po dálnici. Užitečné tipy a rady na cestu si můžete přečíst v našem průvodci, který jsme sepsali na základě vlastních zkušeností.
              div.text-secondary
                | Klikněte, otevře se trasa na mapě >

        a.invisible-link(href="https://www.regiojet.cz/chorvatsko/index.html?ref=/vlakem-do-chorvatska" target="_blank")
          page-section-card
            template(#icon)
              q-icon(name="train" style="font-size: 36px;").text-accent
              //img(src="~assets/logo-sa-icon.svg" alt="Icona" height="36px")
            template(#title) Vlakem
            template
              | Společnost Regiojet spustila prodej vlakových jízdenek na léto 2021. Pohodlně se dostanete přímým spojem z Prahy do města Gracač a odtud pak navazujícím autobusem do Povljany. Jízdenky se dají zakoupit od 1 190 Kč.
              div.text-secondary
                | Klikněte, otevře se nákup jízdenek >

        a.invisible-link(href="https://www.zadar-airport.hr/en/destinations#prg" target="_blank")
          page-section-card
            template(#icon)
              q-icon(name="flight" style="font-size: 36px;").text-accent
              //img(src="~assets/logo-sa-icon.svg" alt="Icona" height="36px")
            template(#title) Letecky
            template
              | Do Povljany, respektive do Zadaru, se dostanete letecky, letenky se dají koupit od 1000 Kč za osobu jednosměrný let. V Zadaru si můžete na týden půjčit auto v průměru za 3500 Kč/týden, případně si vzít UBER za velmi přijatelnou cenu.
              div.text-secondary
                | Klikněte, otevře se nákup letenek >


    page-section
      .row.gekon-btn
        .col.gekon-card-solution
          h2.gekon-counter-b.text-white
            animated-number(:number="920" :time="1200" :restart="true") km
          p.text-center.gekon-counter-s km Praha
        .col.gekon-card-solution
          h2.gekon-counter-b.text-white
            animated-number(:number="780" :time="1200" :restart="true")
          p.text-center.gekon-counter-s km Brno
        .col.gekon-card-solution
          h2.gekon-counter-b.text-white
            animated-number(:number="50" :time="1200" :restart="true")
          p.text-center.gekon-counter-s km Zadar letiště
        .col.gekon-card-solution
          h2.gekon-counter-b.text-white
            animated-number(:number="13" :time="1200" :restart="true")
          p.text-center.gekon-counter-s km město Pag

    page-section.section-nadpis.text-center
      .row.justify-center.page-section-ourstory
        .col-xs-12.col-sm-12.col-md-12
          h2 Lokalita
        .col-xs-12.col-sm-8.col-md-6.q-mt-lg
          p.text-paragraph.text-left
            | Letovisko Povljana leží doslova v kouzelné přírodní zátoce na jihovýchodním pobřeží ostrova Pag.
            | Samotný ostov Pag je nejjižnější ostrov z vnitřního pásu Kvarnerského souostroví, který leží na rozhraní mezi oblastí Kvarneru a Severodalmátskými ostrovy.
          p.text-paragraph.text-left
            | Původně zemědělská obec Povljana zažila v poslední době mohutný rozvoj a díky své poloze a výjimečnému množství zeleně v okolí je dnes významným turistickým střediskem.
            | Vyznavači letní pohody a klidu také jistě ocení, že je městečko Povljana směrem od západu chráněno před silnými větry Bora a Sirocco.
          p.text-paragraph.text-left
            | Z pobřeží letoviska je překrásný výhled na otevřené moře a dlouhé písečné a kamenité pláže s pozvolným vstupem do moře jsou ideální pro klidnou rodinnou dovolenou.
            | V těsné blízkosti našeho apartmánu je nejen nejznámější místní pláž Dubrovník, ale i zbylé čtyři pláže Mali Dubrovnik, Perilo, Livade a Stará Povljana.
          p.text-paragraph.text-left
            | Zkrátka oblast Povljany je skutečným dovolenkovým rájem s nekonečnou možností koupání v křišťálově čistém moři a celou řadu jiných volnočasových aktivit.
            | Navíc zde můžete prožít několik dní u blízkého přírodního jezera Segal s léčivým bahnitým sedimentem, což ocení nejen starší ročníky.


    page-section.section-nadpis.text-center
      .row.justify-center.page-section-ourstory
        .col-xs-12.col-sm-12.col-md-12
          h2 Užitečné informace
        .col-xs-12.col-sm-8.col-md-6.q-mt-lg
           p.text-paragraph.text-left
            | Patříte mezi ty lidi, kteří všechno ví, všechno znají, všude byli a nic je nepřekvapí? Tak zrovna pro vás tento text určen není. Ale pro vás zbývající jsme připravili a shromáždili na jedno místo všechny důležité informace, které by mohli přispět k prožití vaší klidné dovolené na kouzelném místě, které jsme objevili během našich toulek světem. Přejeme vám pohodové čtení…

    page-section.section-nadpis.text-center.q-mt-lg
      .row.justify-center.page-section-ourstory
        .col-xs-12.col-sm-12.col-md-12
          a(href="statics/Uzitecne-rady-a-tipy.pdf" target="_blank").invisible-link
            .row.justify-center
              .col-sm-5.col-xs-4.pdf-download-icon.text-right
                img(src="~assets/pdf-icon-color.svg" height="36px")
              .col.text-left
                .div Stahujte PDF soubor:
                .pdf-download Užitečné rady a tipy


</template>

<style scoped lang="stylus">

.pdf-download-icon
  margin 6px

.pdf-download
  text-decoration none
  font-family RedHatDisplay-med
  font-size 18px
  line-height 20px
  letter-spacing .035rem

.jaksedostatat-link
  color orange !importatnt

.invisible-link
  text-decoration none
  color inherit

a:hover
  color $secondary !important


.cenareseni
  margin 0px 0px 20px 0px

.alt-grey-bg
  background-color #F6F6F6

.alt-bg
  background-color $jidelna-blue-light

.gekon-card-solution
  color white
  border 1px solid white

.gekon-btn
  background-color $orange
  color white

@media screen and (min-width: 601px)
  .gekon-counter-b
    font-family RedHatDisplay-reg
    margin 42px 0 0 0
    font-size 42px
    // font-size clamp(20px, 4vw, 42px)
  .gekon-counter-s
    font-family RedHatDisplay-reg
    margin 0 5px 42px 5px
    font-size 16px
    //font-size clamp(10px, 2vw, 16px)

@media screen and (max-width: 600px)
  .gekon-counter-b
    font-family RedHatDisplay-reg
    margin 22px 0 0 0
    font-size 20px
    // font-size clamp(20px, 4vw, 42px)
  .gekon-counter-s
    font-family RedHatDisplay-reg
    margin 0 5px 22px 5px
    font-size 10px
    //font-size clamp(10px, 2vw, 16px)

.alt-reset-m-p
  margin 0
  padding 0

.alt-blog-nadpis
  color $primary
  font-size 23px
  font-weight bold

.alt-cena
  color $primary
  font-size 26px
  font-weight bold

h2
  text-align center
  margin 50px 0 0px 0
  padding 0

h3
  font-size 26px
  color $accent
  text-align center
  margin 0px 0 30px 0
  padding 0

.page-section-ourstory
  font-size $alt-text-size
  text-align center
  marging 20px 0px 0px 0px

ul
  // list-style-image: url('~assets/app-icon.png')
  // list-style-image: url('~assets/odrazka.svg')
  list-style-type disc !important
  line-height 18px
  margin 0
  padding 0
  li
    list-style-position inside
    padding-left: 1.3em;
    text-indent: -1.3em;
    margin-bottom 13px

.text-paragraph
  font-size $alt-text-size
  font-family $alt-text-font

</style>

