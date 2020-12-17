<script>
export default {
  name: 'jidelna-section-price-card',
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
      .page-section-card-title
        slot(name="title")

      .page-section-card-content
        q-tab-panels(:value="selectedTab" animated).no-alt-scroll
          q-tab-panel(name="detail")
            div
              slot

</template>

<style scoped lang="stylus">

  $cardWidth = ($pageFixWidth - ($gekonNumberOfCardsPerLine - 1) * $gutterSize) / $gekonNumberOfCardsPerLine
  $jidelnaCardHeight ?= $cardWidth
  $contentHeight = $jidelnaCardHeight - $gekonTitleContainerSize

  $avatarWidth = $gekonIconSize + $gekonAvatarMargin
  $avatarHeight = $avatarWidth

  .q-card__section
    margin 0

  .page-section-card
    overflow hidden
    .gt-xs &
      max-height $jidelnaCardHeight
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
    height $gekonIconContainerSize

  .page-section-card-title
    text-align center
    font-size 20px
    font-family  $alt-title-font
    height $gekonTitleContainerSize
    min-height $gekonTitleContainerSize
    max-height $gekonTitleContainerSize

  .page-section-card-content
    text-align center
    .gt-sm &
      height $contentHeight
      max-height $contentHeight
    overflow hidden

  .page-section-tabs
    height $gekonTabsContainerSize
    max-height $gekonTabsContainerSize

</style>
