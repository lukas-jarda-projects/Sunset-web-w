<template>
  <div id="q-app" :class="responsiveClasses">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  computed: {
    responsiveClasses () {
      const classes = {}
      for (const cls of Object.keys(this.$q.screen.gt)) {
        classes[`gt-${cls}`] = this.$q.screen.gt[cls]
      }
      return classes
    }
  }
}
</script>
