<script>
export default {
  name: 'jidelna-section-blog-card',
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
      .page-section-card-content
          q-tab-panel(name="detail")
            div
              slot

</template>

<style scoped lang="stylus">

  $cardWidth = ($pageFixWidth - ($gekonNumberOfCardsPerLine - 1) * $gutterSize) / $gekonNumberOfCardsPerLine
  $jidelnaCardHeight ?= $cardWidth
  $contentHeight = $jidelnaCardHeight - $gekonTitleContainerSize -280px

  .q-card__section
    margin 0
    padding 0

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

  .page-section-card-title
    text-align left
    font-size 20px
    font-family $alt-title-font
    height $gekonTitleContainerSize
    min-height $gekonTitleContainerSize
    max-height $gekonTitleContainerSize

  .page-section-card-content
    text-align left
    .gt-xs &
      height $contentHeight
      max-height $contentHeight
    overflow hidden

</style>
