<script>
export default {
  name: 'page-section',

  props: {
    fullWidth: { type: Boolean, default: false }
  }
}
</script>

<template lang="pug">
  div.page-section(:class="{'page-fixed-width': fullWidth === false}")
    slot

</template>
