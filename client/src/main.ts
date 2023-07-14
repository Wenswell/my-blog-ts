import { createApp } from 'vue'
import 'normalize.css'
import '@/assets/styles/index.scss'
import App from './App.vue'
import router from './router'

console.log(import.meta)
console.log(import.meta.env)
console.log(import.meta.env.__APP_ENV__)

createApp(App).use(router).mount('#app')
