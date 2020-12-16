<script>
import { mixin as VueTimers } from 'vue-timers'

export default {
  name: 'AnimatedNumber',

  mixins: [ VueTimers ],

  props: {
    number: { default: 0 },
    time: { default: 1000 },
    restart: { default: false }
  },

  data: function () {
    return {
      displayNumber: 0,
      increment: 0,
      started: false,
      done: false
    }
  },

  timers: {
    ticked: { time: 20, autostart: true, repeat: true }
  },

  watch: {
    number: {
      handler () {
        this.increment = this.number / (this.time / 50)
      },
      immediate: true

    }
  },

  computed: {
    formattedNumber () {
      return Intl.NumberFormat('cs-CZ').format(Math.floor(this.displayNumber))
    }
  },

  methods: {
    onIntersection (entry) {
      if (entry.isIntersecting) {
        if (this.started === false || (this.restart === true && this.done === true)) {
          this.started = true
          this.done = false
          this.displayNumber = 0
        }
      }
    },

    ticked () {
      if (!this.started || this.done === true) {
        return
      }
      if (this.displayNumber < this.number) {
        this.displayNumber = this.displayNumber + this.increment
        return
      }
      this.done = true
    }
  }
}

</script>


<template lang="pug">
  span(v-intersection="onIntersection") {{formattedNumber}}

</template>
