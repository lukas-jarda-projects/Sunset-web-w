<script>
export default {
  name: 'page-section-double-card',
  data () {
    return {
      selectedTab: 'detail'
    }
  }
}
</script>

<template lang="pug">

  q-card(bordered).page-section-card
    q-card-section
      .page-section-card-icon
        div
          q-avatar.avatar
            div
              slot(name="icon")

      .page-section-card-title
        slot(name="title")

      .page-section-card-content
        q-tab-panels(:value="selectedTab" animated).no-alt-scroll
          q-tab-panel(name="detail")
            div
              slot
          q-tab-panel(name="kalkulace")
            div
              slot(name="second")
      .page-section-tabs
        q-tabs(v-model="selectedTab" align="justify" dense no-caps indicator-color="primary" )
          q-tab(label="Popis" name="detail" style="width: 50%")
          q-tab(label="Kalkulace" name="kalkulace" style="width: 50%")

</template>

<style scoped lang="stylus">

  $cardWidth = ($pageFixWidth - ($numberOfCardsPerLine - 1) * $gutterSize) / $numberOfCardsPerLine
  $cardHeight ?= $cardWidth
  $contentHeight = $cardHeight - $iconContainerSize - $titleContainerSize - $tabsContainerSize

  $avatarWidth = $iconSize + $avatarMargin
  $avatarHeight = $avatarWidth

  .q-card__section
    margin 0


  .page-section-card
    overflow hidden
    .gt-xs &
      max-height $cardHeight
      min-width $cardWidth
      max-width $cardWidth


    margin-left 5px
    margin-right 5px
    margin-bottom 20px
    min-width auto
    max-width auto
    max-height auto
    overflow hidden

  .page-section-card-icon
    text-align center
    height $iconContainerSize

    .avatar
      margin-top 11px
      width: $avatarWidth
      height: $avatarHeight
      background $avatarBackground

    >>> img
      width $iconSize
      height $iconSize

  .page-section-card-title
    text-align center
    font-size 20px
    height $titleContainerSize
    min-height $titleContainerSize
    max-height $titleContainerSize
    font-family  $alt-title-font

  .page-section-card-content
    text-align center
    .gt-sm &
      height $contentHeight
      max-height $contentHeight
    overflow hidden

  .page-section-tabs
    height $tabsContainerSize
    max-height $tabsContainerSize

</style>
