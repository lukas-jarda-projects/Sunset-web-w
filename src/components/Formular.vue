<template lang="pug">
  div.text-center.q-ma-md
    q-input(filled v-model="$v.name.$model" label="Jméno" :error="$v.name.$error" error-message="Vyplňte jméno").q-my-sm
    q-input(filled v-model="$v.company.$model" label="Společnost" :error="$v.company.$error" error-message="Vyplňte jméno společnosti").q-my-sm
    q-input(filled type="email" v-model="$v.email.$model" label="Email" :error="$v.email.$error" error-message="Zadejte platný email").q-my-sm
    q-input(filled v-model="$v.phone.$model" label="Telefon" :error="$v.phone.$error" error-message="Vyplňte Váš telefon").q-my-sm
    div(style="height: 180px; padding-top: 1em;")
      q-input(outlined type="textarea" v-model="$v.text.$model" :error="$v.text.$error" label="Napište nám jaké řešení potřebujete" error-message="Prosíme, vyplňte obsah zprávy" filled)
    q-btn(rounded no-caps label="Odeslat poptávku" size="lg" @click="sendForm").q-px-md.q-mt-lg.gekon-btn
    p.q-mb-xl.q-mt-md Zanechte nám své kontaktní údaje a my se Vám ozveme.
</template>
<style scoped lang="stylus">
.gekon-btn
  background-color $orange
  color white

h3
  font-size 20px
  line-height 30px
  font-weight medium
p
  font-size 16px

li
  font-size 16px

</style>

<script>
import { postForm } from 'src/postForm'
import { email, required } from 'vuelidate/lib/validators'

export default {
  name: 'JidelnaFormular',

  data () {
    return {
      name: '',
      company: '',
      email: '',
      phone: '',
      text: ''
    }
  },

  validations: {
    name: {
      required
    },
    company: {
      required
    },
    email: {
      required, email
    },
    phone: {
      required
    },
    text: {
      required
    }

  },

  methods: {
    async sendForm () {
      this.$v.$touch()
      if (this.$v.$invalid) {
        return
      }
      try {
        await postForm({
          name: 'gekon.cz-contact-form',
          formData: {
            name: this.name,
            company: this.company,
            email: this.email,
            phone: this.phone,
            text: this.text
          }
        })
        this.$q.dialog({
          message: 'Děkujeme, poptávka byla odeslána...'
        })
      } catch (err) {
        this.$q.dialog({
          message: 'Nepodařilo se zaslat poptávku...'
        })
      }
    }
  }
}
</script>
