import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './libs/http'

const app = createApp(App)
app.use(router).use(router).use(store).mount('#app')
