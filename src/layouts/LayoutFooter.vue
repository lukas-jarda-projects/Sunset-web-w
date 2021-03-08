<template lang="pug">
  div.q-pa-lg.footer
    .flex.items-end.justify-between.q-gutter-lg.page-fixed-width
      div.text-center
        a(href="https://altisima.cz" target="_blank")
          img(src="~/assets/logo-altisima.svg" alt="logo altisima" immediate="true" width="140")
        .alt-text-caption
          | Altisima software SE
      div.text-center
        .alt-text-caption
          | Altisima je také výrobce řešení
        a(href="https://dorsys.cz" target="_blank")
          img(src="~/assets/logo-dorsys-p.svg" alt="logo dorsys" width="130")
        a(href="https://gekon-sw.cz" target="_blank")
          img(src="~/assets/logo-gekon.svg" alt="logo gekon" width="130").q-mb-xs
      div.text-left
        .alt-text-caption
          strong Telefon:
          span   +420 222 711 241
        .alt-text-caption
          strong Adresa:
          span   Kubelíkova 46, 130 00 Praha 3
        .alt-text-caption
          strong IČO:
          span  04722019,
          strong  DIČ:
          span  CZ04722019

</template>
<style scoped lang="stylus">
.footer
  background-color $orange-light
  color $footer-color

  .alt-text-caption
    font-decoration none
    color $footer-color

</style>

<script>
export default {
  name: 'layout-footer'
}
</script>
