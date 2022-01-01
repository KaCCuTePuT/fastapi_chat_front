import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// import '@/assets/jquery-1.10.2.min'
// import '@/assets/bootstrap.bundle.min'
import '@/assets/bootstrap.min.css'
import '@/assets/main.css'

createApp(App).use(router).use(store).mount('#app')
