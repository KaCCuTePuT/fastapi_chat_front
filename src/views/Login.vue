<template>
  <form>
    <h1>FA Chat</h1>
    <input
      v-model="phone"
      type="text"
      :disabled="disablePhone"
      class="d-flex justify-content-center form-control"
      placeholder="Телефон"
      aria-label="Телефон"
      aria-describedby="basic-addon1"
    />
    <input
      v-if="showCodeInput"
      v-model="codeFromUser"
      type="text"
      class="d-flex justify-content-center form-control"
      placeholder="Введите полученный код из смс"
      aria-label="Код"
      aria-describedby="basic-addon1"
    />
    <div class="row">
      <button @click.prevent="sendCode()" class="btn btn-primary">
        Получить код
      </button>
      <button
        @click.prevent="loginHandler"
        type="submit"
        class="btn btn-primary"
      >
        Войти
      </button>
    </div>
  </form>
</template>

<script>
import sendVerificationCode from '@/api'

export default {
  name: 'Login',
  data() {
    return {
      phone: '+7',
      showCodeInput: false,
      disablePhone: false,
      codeFromUser: '',
      codeFromOurFunction: '',
    }
  },
  methods: {
    async sendCode() {
      let phone = this.phone
      this.codeFromOurFunction = await sendVerificationCode(phone)
      console.log(this.codeFromOurFunction)
      this.showCodeInput = true
      this.disablePhone = true
    },
    loginHandler() {
      let phone = this.phone
      let verification_code1 = this.codeFromUser
      let verification_code2 = this.codeFromOurFunction
      this.$store
        .dispatch('login', { phone, verification_code1, verification_code2 })
        .then(() => console.log('Вы залогинены'))
        .catch((err) => console.log(err))
      this.$router.push('/main')
    },
  },
}
</script>
