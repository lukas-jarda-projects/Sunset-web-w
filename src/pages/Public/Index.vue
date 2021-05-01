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
  name: 'PageIndex',

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
  q-page
    page-section(:fullWidth="true")

    q-carousel.top-carousel(
      autoplay swipeable animated v-model="slide"
      arrows navigation infinite height="500px"
      transition-next="jump-left" transition-prev="jump-right").no-alt-scroll

      q-carousel-slide(name="1" img-src="~assets/carusel-sunset-apartment-01.jpg")
        carousel-content
          template(#title) Luxusní
          template(#description) apartmán v&nbsp;první řadě

      q-carousel-slide(name="2" img-src="~assets/carusel-sunset-apartment-02.jpg")
        carousel-content
          template(#title) S&nbsp;přímým
          template(#description) výhledem na moře z 1. patra

      q-carousel-slide(name="3" img-src="~assets/carusel-sunset-apartment-03.jpg")
        carousel-content
          template(#title) Krásné
          template(#description) a křišťálově čisté moře <br> s nádhernými plážemi

      q-carousel-slide(name="4" img-src="~assets/carusel-sunset-apartment-04.jpg")
        carousel-content
          template(#title) Ostrov Pag
          template(#description) nejjižnější ostrov z vnitřního pásu <br> Kvarnerského souostroví



    page-section.section-nadpis.text-center
      .row.justify-center.page-section-ourstory
        .col-xs-12.col-sm-8.col-md-7.q-px-md.q-mb-xl
          h2 Náš příběh
          | JídelnaSQL navazuje na předchozí produkty Jídelna a Kasiopeja, jde o komplexní software na vedení strávníků, evidenci objednávek, plateb a řešení pokladního prodeje. Pro větší gastronomické provozy nabízíme kompletní řešení objednávek výdeje nebo prodeje, s tím, že moduly stravovacího systému lze volně kombinovat.

    page-section
      h2.text-center Nabízená řešení
      .flex.justify-center(:class="{'q-gutter-lg': !$q.screen.lt.sm}")

        jidelna-section-double-card
          template(#title) Evidence strávníků
          template(#icon)
            img(src="~assets/reseni-01.jpg" alt="Chip")
          template(#default)
            div.text-left.ulli
              | Základní funkcí je evidence strávníků, přihlášek stravy a plateb.
              p
              | Jídelna SQL umožňuje nastavení cen pro kategorie, stravy nebo jednotlivá menu.
              p
              | Systém je velmi variabilní a je vhodný pro gastronomické provozy všech velikostí.
          template(#second)
            br
            div Přístup do webového rozhraní aplikace Gekon včetně aktualizací a správy dat
            div.q-mb-md.alt-cena 4.600 Kč #[small bez DPH ročně]
            h3 Vyžádejte si kalkulaci řešení přímo pro Vás.

        jidelna-section-double-card
          template(#title) Identifikační média
          template(#icon)
            img(src="~assets/reseni-02.jpg" alt="Chip")
          template(#default)
            div.text-left.ulli
              | V rámci stravovacího provozu jsou k identifikaci strávníků využívány bezkontaktní čipy.
              p
              | Ty mohou být v kartě nebo čipovém přívěsku.
              p
              | Naše řešení je univerzální, umožňujeme využití i vlastních karet jako jsou karty ISIC nebo městské karty.

          template(#second)
            br
            div Program Gekon pro Školní jídelny včetně instalace, nastavení, školení a platby za Licenční podporu
            div.q-mb-md.alt-cena 800 Kč #[small bez DPH měsíčně]
            h3 Vyžádejte si kalkulaci řešení přímo pro Vás.

        jidelna-section-double-card
          template(#title) Internetové objednávky
          template(#icon)
            img(src="~assets/reseni-03.jpg" alt="Chip")
          template(#default)
            div.text-left.ulli
              | Nejednodušší a cenově nejpřístupnější způsob zadání objednávek a odhlášek stravy je internetové rozhraní.
              p
              | Modul e-jídelníček, který zajišťuje internetové objednávky je optimalizovaný pro pohodlné ovládání na PC, tabletu nebo mobilním telefonu.

          template(#second)
            br
            div Gekon pro Závodní jídelnu s jednou provozovnou včetně instalace, nastavení, školení a platby za Licenční podporu
            div.q-mb-md.alt-cena 1.300 Kč #[small bez DPH měsíčně]
            h3 Vyžádejte si kalkulaci řešení přímo pro Vás.

        jidelna-section-double-card
          template(#title) Objednávkové kiosky
          template(#icon)
            img(src="~assets/reseni-04.jpg" alt="Chip")
          template(#default)
            div.text-left.ulli
              | Pro objednávky stravy v jídelně využijete objednávkový kiosek TT1703, ten je v provedení antivandal s kvalitním dotykovým displejem krytým sklem.
              p
              | Software pro objednávání jídel můžete provozovat i na vlastním hardware.
          template(#second)
            br
            div Gekon pro provoz s dietním stravováním včetně instalace, nastavení, školení a platby za Licenční podporu
            div.q-mb-md.alt-cena 2.800 Kč #[small bez DPH měsíčně]
            h3 Vyžádejte si kalkulaci řešení přímo pro Vás.

        jidelna-section-double-card
          template(#title) Výdej jídel
          template(#icon)
            img(src="~assets/reseni-05.jpg" alt="Chip")
          template(#default)
            div.text-left.ulli
              | Pro výdej, signalizaci stavu objednaného jídla, můžete vybírat z několika variant výdejních terminálů.
              p
              | Ty jsou vždy vybaveny ovládacím programem Terkom, který zajišťuje rychlou a spolehlivou komunikaci s databází a je téměř bezobslužný.

          template(#second)
            br
            div Gekon pro stravovací společnost včetně instalace, nastavení, školení a platby za Licenční podporu
            div.q-mb-md.alt-cena 1.300 Kč #[small bez DPH měsíčně za provozovnu]
            h3 Vyžádejte si kalkulaci řešení přímo pro Vás.

        jidelna-section-double-card
          template(#title) Pokladní prodej
          template(#icon)
            img(src="~assets/reseni-06.jpg" alt="Chip")
          template(#default)
            div.text-left.ulli
              | Pokladní prodej doplňkového sortimentu nebo bezobjednávkový provoz stravovacího úseku zajistí modul Pokladna.
              p
              | Samozřejmostí je napojení na EET a přehledné kontrolní sestavy.
          template(#second)
            br
            div Gekon pro bufet včetně instalace, nastavení, školení a platby za Licenční podporu
            div.q-mb-md.alt-cena 1.300 Kč #[small bez DPH měsíčně]
            h3 Vyžádejte si kalkulaci řešení přímo pro Vás.

    page-section
      h2 Vlastnosti systému
      .flex.q-gutter-sm(:class="{'justify-center': $q.screen.gt.xs}")
        page-section-card
          template(#icon)
            img(src="~assets/Jidelna-icon.svg" alt="Icona" height="36px")
          template(#title) Bezpečná databáze
          template
            | Využíváme databázi Postresql, ta zajišťuje síťový provoz, připojení terminálů pro výdej nebo objednávku a synchronizaci s e-jídelníčkem.

        page-section-card
          template(#icon)
            img(src="~assets/Jidelna-icon.svg" alt="Icona" height="36px")
          template(#title) Nastavení evidence
          template
            | Strávníky můžete třídit podle kategorií, stravovacích zvyklostí, tříd, rozvozových míst nebo podnikových středisek.

        page-section-card
          template(#icon)
            img(src="~assets/Jidelna-icon.svg" alt="Icona" height="36px")
          template(#title) Nastavení cen
          template
            | Cena jídla, služeb nebo doplňkového sortimentu je evidovaná v ceníku. Ten umožňuje další nastavení podle potřeb provozu.

        page-section-card
          template(#icon)
            img(src="~assets/Jidelna-icon.svg" alt="Icona" height="36px")
          template(#title) Zadávání jídelníčku
          template
            | Jídelníček umožňuje vyhledávání v recepturách, je možné ho ukládat nebo kopírovat. Zobrazuje se včetně alergenů.

        page-section-card
          template(#icon)
            img(src="~assets/Jidelna-icon.svg" alt="Icona" height="36px")
          template(#title) Displej pokladny
          template
            | Pokladnu si nastavíte podle vlastních potřeb a zvyklostí. Centrálně můžete spravovat několik pokladen, tlačítka jsou uživatelsky konfigurovatelná.

        page-section-card
          template(#icon)
            img(src="~assets/Jidelna-icon.svg" alt="Icona" height="36px")
          template(#title) Dostupnost objednávek
          template
            | Server pro internetové objednávky je dozorován 7 dní v týdnu 24 hodin denně, zákazníkům garantujeme bezvýpadkový provoz.

        page-section-card
          template(#icon)
            img(src="~assets/Jidelna-icon.svg" alt="Icona" height="36px")
          template(#title) Možnosti komunikace
          template
            | V e-jídelníčku můžete využívat automatické reporty, kdy je strávník informován o objednávkách a stavu konta nebo poslat zprávu.

        page-section-card
          template(#icon)
            img(src="~assets/Jidelna-icon.svg" alt="Icona" height="36px")
          template(#title) Dostupný servis
          template
            | Terminály stravovacího systému jsou napojeny na dohledový server, díky tomu mohou naši servisní pracovníci rychle reagovat na případný výpadek.

        page-section-card
          template(#icon)
            img(src="~assets/Jidelna-icon.svg" alt="Icona" height="36px")
          template(#title) Zálohování dat
          template
            | Data jsou každý den automaticky zálohována, umístění zálohy může být na vašem zařízení v rámci sítě nebo na internetovém úložišti.

    //page-section.text-center.q-mt-xl
      div.alt-bg.q-py-xl
        h2.alt-reset-m-p Ke stažení
        p Jídelnu SQL můžete ve variantě LITE používat zdarma. Využijte náš instalátor pro malé provozy.
        q-btn(rounded no-caps label="Stáhnout zdarma" size="lg" @click="login").q-px-xl.q-mb-lg.gekon-btn


    page-section
      .cenareseni
        h2.text-center Cena řešení
        .text-h6.text-center Potřebujete evidovat strávníky, přihlášky a platby za stravu?
      .flex.justify-center(:class="{'q-gutter-lg': !$q.screen.lt.sm}")

        jidelna-section-price-card
            h3 verze LITE
            div.alt-cena 300 Kč
              p #[small bez DPH/měsíc]
            div.text-center.ulli
              br
              | Evidence 50ti strávníků.
              p
              | Plná verze software.
              p
              | Podpora našich techniků zdarma.
              p
              | Upgrade programu zdarma.
              p
              |
              br
              q-btn(outline color='primary', icon='check', label='Objednat', @click='scrollToObjednat')

        jidelna-section-price-card
            h3 verze pro Školy
            div.alt-cena 1 100 Kč
              p #[small bez DPH/měsíc]
            div.text-center.ulli
              br
              | Evidence bez omezení.
              p
              | Plná verze software.
              p
              | Podpora našich techniků zdarma.
              p
              | Upgrade programu zdarma.
              p
              |
              br
              q-btn(outline color='primary', icon='check', label='Objednat', @click='scrollToObjednat')

        jidelna-section-price-card
            h3 verze pro Komerci
            div.alt-cena 2 000 Kč
              p #[small bez DPH/měsíc]
            div.text-center.ulli
              br
              | Napojení na EET.
              p
              | Plná verze software.
              p
              | Podpora našich techniků zdarma.
              p
              | Upgrade programu zdarma.
              p
              |
              br
              q-btn(outline color='primary', icon='check', label='Objednat' @click="scrollToObjednat")

    page-section
      h2 Realizovaná řešení
      .row.gekon-btn
        .col.gekon-card-solution
          h2.gekon-counter-b
            animated-number(:number="250" :time="1200" :restart="true")
          p.text-center.gekon-counter-s Instalací
        .col.gekon-card-solution
          h2.gekon-counter-b
            animated-number(:number="108" :time="1200" :restart="true")
          p.text-center.gekon-counter-s e-Jídelníčků
        .col.gekon-card-solution
          h2.gekon-counter-b
            animated-number(:number="74" :time="1200" :restart="true")
          p.text-center.gekon-counter-s Objednávkových kiosků
        .col.gekon-card-solution
          h2.gekon-counter-b
            animated-number(:number="182" :time="1200" :restart="true")
          p.text-center.gekon-counter-s Výdejních terminálů

    page-section
      h2 Fotky stravovacího systému
      .q-pa-md
        .q-gutter-y-md()
          q-card
            q-tabs.text-primary(v-model='tab' no-caps class='md-md' active-color='accent' indicator-color='accent')
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

    page-section.section-nadpis.text-center
      .row.justify-center.page-section-ourstory
        .col-xs-12.col-sm-8.col-md-7.q-px-md.q-mb-xl
          h4.q-mb-md Sledujte nás
          q-btn(round outline color='primary', icon='eva-facebook', type="a" href="https://www.facebook.com/altisimacz" target="_blank" size="15px")
          q-btn.q-mx-lg(round outline color='primary' icon='eva-twitter' type="a" href="https://twitter.com/AltisimaSe?ref_src=twsrc%5Etfw" target="_blank" size="15px")

</template>

<style scoped lang="stylus">

.invisible-link
  text-decoration none
  color inherit

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
    margin 42px 0 0 0
    font-size 42px
    // font-size clamp(20px, 4vw, 42px)
  .gekon-counter-s
    margin 0 5px 42px 5px
    font-size 16px
    //font-size clamp(10px, 2vw, 16px)

@media screen and (max-width: 600px)
  .gekon-counter-b
    margin 22px 0 0 0
    font-size 20px
    // font-size clamp(20px, 4vw, 42px)
  .gekon-counter-s
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
  margin 50px 0 20px 0
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
  marging 20px

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



</style>

