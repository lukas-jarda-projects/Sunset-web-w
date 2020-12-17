<template lang="pug">
  div.text-center.q-ma-md
    q-input(filled v-model="$v.name.$model" label="Jméno" :error="$v.name.$error" error-message="Vyplňte jméno").q-my-sm
    q-input(filled v-model="$v.company.$model" label="Společnost" :error="$v.company.$error" error-message="Vyplňte jméno společnosti").q-my-sm
    q-input(filled type="email" v-model="$v.email.$model" label="Email" :error="$v.email.$error" error-message="Zadejte platný email").q-my-sm
    q-input(filled v-model="$v.phone.$model" label="Telefon" :error="$v.phone.$error" error-message="Vyplňte Váš telefon").q-my-sm
    div.flex.justify-between
      q-checkbox.q-pl-none(filled v-model="$v.souhlas.$model" label="Souhlas se zpracováním os. údajů" :error="$v.souhlas.$error" error-message="prosím odsouhlaste")
      q-btn(no-caps :ripple="false" label="Ukaž podmínky" flat size="small" type="link" @click="podminkyOpen = true")
    podminky-dialog(v-model="podminkyOpen")
    div(style="height: 180px; padding-top: 1em;")
      q-input(outlined type="textarea" v-model="$v.text.$model" :error="$v.text.$error" label="Napište nám jaké řešení potřebujete" error-message="Prosíme, vyplňte obsah zprávy" filled)
    q-btn(:disabled="$v.$anyError" no-caps color="primary" label="Odeslat poptávku" size="lg" @click="sendForm").q-px-md.q-mt-lg
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
import axios from 'axios'
import PodminkyDialog from 'src/components/PodminkyDialog'
import { postForm } from 'src/postForm'
import { email, required } from 'vuelidate/lib/validators'

export default {
  name: 'JidelnaFormular',
  components: { PodminkyDialog },
  data () {
    return {
      name: '',
      company: '',
      email: '',
      phone: '',
      text: '',
      souhlas: false,
      podminkyOpen: false
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
    },
    souhlas: {
      required,
      souhlas (val) {
        return val === true
      }
    }
  },

  methods: {
    async sendSklikConversion () {
      window.seznam_cId = 100057253
      window.seznam_value = null
      const code = await axios.get('https://www.seznam.cz/rs/static/rc.js')
      // eslint-disable-next-line no-eval
      eval(code)
    },
    async sendForm () {
      this.$v.$touch()
      if (this.$v.$invalid) {
        return
      }
      try {
        await postForm({
          name: 'dorsys.cz-contact-form',
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
        }).onDismiss(() => {
          this.clearForm()
        })
        await this.sendSklikConversion()
      } catch (err) {
        this.$q.dialog({
          message: 'Nepodařilo se zaslat poptávku...'
        })
      }
    },
    clearForm () {
      this.name = ''
      this.email = ''
      this.phone = ''
      this.text = ''
      this.company = ''
      this.$v.$reset()
    }
  }
}
</script>
