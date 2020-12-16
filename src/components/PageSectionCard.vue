<script>
export default {
  name: 'PageSectionCard'
}
</script>

<template lang="pug">

  q-card(flat).page-section-card
    q-card-section.page-section-card-title
      .flex.no-wrap
        div.icon
          slot(name="icon")
        div
          div.title
            slot(name="title")
          div.content
            slot

</template>

<style scoped lang="stylus">

$gutterSize = 8px
$cardWidth = (($pageFixWidth - 2 * $gutterSize) / 3)
$cardHeight = 150px
$titleHeight = 40px
$contentHeight = $cardHeight - $titleHeight


.q-card__section
  margin 0
  padding 0

.page-section-card
  .gt-xs &
    min-width $cardWidth
    max-width $cardWidth
    padding 0em
    min-height $cardHeight
    max-height $cardHeight

  padding 1em
  overflow hidden

.icon
  padding-right 18px

.title
  text-align left
  font-size 20px
  font-weight bold
  .gt-sm &
    height $titleHeight

.content
  text-align left

  .gt-sm &
    height $contentHeight
    max-height $contentHeight
    overflow hidden

</style>
