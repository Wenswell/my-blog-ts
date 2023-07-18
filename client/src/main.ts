import { createApp } from 'vue'
import 'normalize.css'
import '@/assets/styles/index.scss'
import App from './App.vue'
import router from './router'

console.log(import.meta)
console.log(import.meta.env)
console.log(import.meta.env.__APP_ENV__)
import { createPinia } from 'pinia'

const app = createApp(App)
app.use(createPinia())

app.use(router).mount('#app')
