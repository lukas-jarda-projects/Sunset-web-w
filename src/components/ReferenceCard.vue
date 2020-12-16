<script>
export default {
  name: 'reference-card'
}
</script>

<template lang="pug">

  q-card(flat).reference-card
    q-card-section.page-section-card-title
      div.title
        slot(name="name")
      div.content
        slot(name="popis")

</template>

<style scoped lang="stylus">

$gutterSize = 19px
$cardWidth = (($pageFixWidth - 2 * $gutterSize) / 3)
$cardHeight = 200px
$titleHeight = 40px
$contentHeight = $cardHeight - $titleHeight


.q-card__section
  margin 0
  margin-top 30px
  padding 0

.reference-card
  .gt-xs &
    min-height $cardHeight
    max-height $cardHeight
    min-width $cardWidth
    max-width $cardWidth
    overflow hidden
    padding 0
  padding 1em

.icon
  padding-right 18px

.title
  text-align center
  font-size 20px
  height $titleHeight
  font-weight bold
  .gt-sm &
    text-align left


.content
  text-align left
  .gt-sm &
    height $contentHeight
    max-height $contentHeight
  overflow hidden

</style>
