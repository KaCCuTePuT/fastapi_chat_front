import axios from 'axios'
import store from '@/store'

export default {
  state: {
    status: '',
    token: localStorage.getItem('token') || '',
    phone: localStorage.getItem('phone') || '',
  },
  mutations: {
    auth_request(state) {
      state.status = 'loading'
    },
    auth_success(state, token, phone) {
      state.status = 'success'
      state.token = token
      state.phone = phone
    },
    auth_error(state) {
      state.status = 'error'
    },
    logout(state) {
      state.status = ''
      state.token = ''
      state.phone = ''
    },
  },
  actions: {
    login({ commit }, user) {
      console.log(user)
      return new Promise((resolve, reject) => {
        commit('auth_request')
        axios({
          url: `${store.getters.getServerUrl}auth`,
          data: user,
          method: 'POST',
        })
          .then((resp) => {
            const token = resp.data.access_token
            const phone = user.phone
            localStorage.setItem('token', token)
            localStorage.setItem('phone', phone)
            commit('auth_success', { token, phone })
            resolve(resp)
          })
          .catch((err) => {
            commit('auth_error')
            localStorage.removeItem('token')
            localStorage.removeItem('phone')
            reject(err)
          })
      })
    },
  },
  getters: {
    isLoggedIn: (state) => !!state.token,
    authStatus: (state) => state.status,
    getPhone: (state) => state.phone,
    getToken: (state) => state.token,
  },
}
