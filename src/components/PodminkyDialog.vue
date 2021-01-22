<script>
export default {
  name: 'PodminkyDialog',
  props: {
    value: {
      type: Boolean,
      required: true
    }
  },

  data () {
    return {
      alert: false
    }
  },

  watch: {
    value: {
      immediate: true,
      handler (value) {
        this.alert = value
      }
    }
  },

  methods: {
    closeDialog (value) {
      this.alert = value
      this.$emit('input', value)
    }
  }
}
</script>

<template lang="pug">
  q-dialog(:value="alert" @input="closeDialog" style="width: 900px; max-width: 100vw;")
    q-card
      q-page-sticky(position="top-right" :offset="[18, 18]")
        q-fab(icon="close" color="primary" v-close-popup)
      q-card-section
        .text-h6 Podmínky ochrany osobních údajů
      q-card-section.q-pt-none

        .text-h7.q-pb-sm
          strong I. Základní ustanovení

        p 1. Správcem osobních údajů podle čl. 4 bod 7 nařízení Evropského parlamentu a Rady (EU) 2016/679 o ochraně fyzických osob v souvislosti se zpracováním osobních údajů a o volném pohybu těchto údajů (dále jen: „GDPR”) je Altisima software SE IČ 04722019 (dále jen: „správce“).
        p 2. Kontaktní údaje správce jsou:
        p
          | adresa: Kubelíkova 46, Praha 3<br>
          | e-mail: altisima@altisima.cz<br>
          | telefon: 222 711 241
        p 3. Osobními údaji se rozumí veškeré informace o identifikované nebo identifikovatelné fyzické osobě; identifikovatelnou fyzickou osobou je fyzická osoba, kterou lze přímo či nepřímo identifikovat, zejména odkazem na určitý identifikátor, například jméno, identifikační číslo, lokační údaje, síťový identifikátor nebo na jeden či více zvláštních prvků fyzické, fyziologické, genetické, psychické, ekonomické, kulturní nebo společenské identity této fyzické osoby.
        p 4. Správce nejmenoval/jmenoval pověřence pro ochranu osobních údajů. Kontaktními údaji pověřence jsou:

        .text-h7.q-pb-sm
          strong II. Zdroje a kategorie zpracovávaných osobních údajů

        p
          | 1. Správce zpracovává osobní údaje, které jste mu poskytl/a nebo osobní údaje, které správce získal na základě plnění Vaší objednávky:
        ul
          li jméno a příjmení
          li e-mailová adresa
          li poštovní adresa
          li telefon
        p
          | 2. Správce zpracovává Vaše identifikační a kontaktní údaje a údaje nezbytné pro plnění smlouvy.

        .text-h7.q-pb-sm
          strong III. Zákonný důvod a účel zpracování osobních údajů

        p 1. Zákonným důvodem zpracování osobních údajů je
        ul
          li plnění smlouvy mezi Vámi a správcem podle čl. 6 odst. 1 písm. b) GDPR,
          li splnění právní povinnosti správce podle čl. 6 odst. 1 písm. c) GDPR,
          li oprávněný zájem správce na poskytování přímého marketingu (zejména pro zasílání obchodních sdělení a newsletterů) podle čl. 6 odst. 1 písm. f) GDPR,
          li Váš souhlas se zpracováním pro účely poskytování přímého marketingu (zejména pro zasílání obchodních sdělení a newsletterů) podle čl. 6 odst. 1 písm. a) GDPR ve spojení s § 7 odst. 2 zákona č. 480/2004 Sb., o některých službách informační společnosti v&nbsp;případě, že nedošlo k&nbsp;objednávce zboží nebo služby.

        p 2. Účelem zpracování osobních údajů je

        ul
          li vyřízení Vaší objednávky a výkon práv a povinností vyplývajících ze smluvního vztahu mezi Vámi a správcem; při objednávce jsou vyžadovány osobní údaje, které jsou nutné pro úspěšné vyřízení objednávky (jméno a adresa, kontakt), poskytnutí osobních údajů je nutným požadavkem pro uzavření a plnění smlouvy, bez poskytnutí osobních údajů není možné smlouvu uzavřít či jí ze strany správce plnit,
          li plnění právních povinností vůči státu,
          li zasílání obchodních sdělení a činění dalších marketingových aktivit.

        p 3. Ze strany správce nedochází/dochází k&nbsp;automatickému individuálnímu rozhodování ve&nbsp;smyslu čl. 22 GDPR. S&nbsp;takovým zpracováním jste poskytl/a svůj výslovný souhlas.

        .text-h7.q-pb-sm
          strong IV. Doba uchovávání údajů
        p 1. Správce uchovává osobní údaje

        ul
          li po dobu nezbytnou k výkonu práv a povinností vyplývajících ze smluvního vztahu mezi Vámi a správcem a uplatňování nároků z těchto smluvních vztahů (po dobu 15 let od ukončení smluvního vztahu).
          li po dobu, než je odvolán souhlas se zpracováním osobních údajů pro účely marketingu, nejdéle 5 let, jsou-li osobní údaje zpracovávány na základě souhlasu.

        p 2. Po uplynutí doby uchovávání osobních údajů správce osobní údaje vymaže.

        .text-h7.q-pb-sm
          strong V. Příjemci osobních údajů (subdodavatelé správce)
        p 1. Příjemci osobních údajů jsou osoby
        ul
          li podílející se na dodání zboží/služeb/realizaci plateb na základě smlouvy,
          li zajišťující marketingové služby.

        p 2. Správce nemá/má v úmyslu předat osobní údaje do třetí země (do země mimo EU) nebo mezinárodní organizaci. Příjemci osobních údajů ve třetích zemích jsou poskytovatelé mailingových služeb / cloudových služeb.

        .text-h7.q-pb-sm
          strong VI. Vaše práva

        p 1. Za podmínek stanovených v&nbsp;GDPR máte
        ul
          li právo na přístup ke svým osobním údajům dle čl. 15 GDPR,
          li právo opravu osobních údajů dle čl. 16 GDPR, popřípadě omezení zpracování dle čl. 18 GDPR,
          li právo na výmaz osobních údajů dle čl. 17 GDPR,
          li právo vznést námitku proti zpracování dle čl. 21 GDPR,
          li právo na přenositelnost údajů dle čl. 20 GDPR a
          li právo odvolat souhlas se zpracováním písemně nebo elektronicky na adresu nebo e-mail správce uvedený v&nbsp;čl. III těchto podmínek.


        p 2. Dále máte právo podat stížnost u Úřadu pro ochranu osobních údajů v případě, že se domníváte, že bylo porušeno Vaše právo na ochranu osobních údajů, případně se obrátit na soud.

        .text-h7.q-pb-sm
          strong VII. Podmínky zabezpečení osobních údajů
        p 1. Správce prohlašuje, že přijal veškerá vhodná technická a organizační opatření k&nbsp;zabezpečení osobních údajů.
        p 2. Správce přijal technická opatření k&nbsp;zabezpečení datových úložišť a úložišť osobních údajů v&nbsp;listinné podobě.
        p 3. Správce prohlašuje, že k&nbsp;osobním údajům mají přístup pouze jím pověřené osoby.


        .text-h7.q-pb-sm
          strong VIII. Závěrečná ustanovení
        p 1. Odesláním objednávky z internetového objednávkového formuláře potvrzujete, že jste seznámen/a s podmínkami ochrany osobních údajů a že je v celém rozsahu přijímáte.
        p 2. S&nbsp;těmito podmínkami souhlasíte zaškrtnutím souhlasu prostřednictvím internetového formuláře. Zaškrtnutím souhlasu potvrzujete, že jste seznámen/a s podmínkami ochrany osobních údajů a že je v celém rozsahu přijímáte.
        p 3. Správce je oprávněn tyto podmínky změnit. Novou verzi podmínek ochrany osobních údajů zveřejní na svých internetových stránkách a zároveň Vám zašle novou verzi těchto podmínek Vaši e-mailovou adresu, kterou jste správci poskytl/a.

        p Tyto podmínky nabývají účinnosti dnem 25.5.2018.


      q-card-actions(align="right")
        q-btn(no-caps color="orange" label="Zavřít" size="lg" v-close-popup="").q-px-md.q-mt-lg
</template>

<style scoped lang="stylus">
.gekon-btn
  background-color $green
  color white
</style>
