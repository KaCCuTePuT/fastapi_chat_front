import { createStore } from 'vuex'
import auth from './auth'

const store = createStore({
  state: {
    // backendUrl: 'http://188.225.79.64/',
    backendUrl: 'http://127.0.0.1:8000/',
    isLoading: false,
  },
  mutations: {
    setLoading: (state, status) => {
      state.isLoading = status
    },
  },
  getters: {
    getServerUrl: (state) => {
      return state.backendUrl
    },
  },
  modules: {
    auth,
  },
})

export default store
