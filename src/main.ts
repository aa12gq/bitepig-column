import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'

const app = createApp(App)
app.use(router).use(router).use(store).use(mavonEditor).mount('#app')
