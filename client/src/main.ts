import { createApp } from 'vue'
import '@/assets/styles/index.scss'
import 'initialize-css/dist/_initialize.scss'
import App from './App.vue'
import router from './router'
import 'remixicon/fonts/remixicon.css'

console.log(import.meta)
console.log(import.meta.env)
console.log(import.meta.env.__APP_ENV__)
import { createPinia } from 'pinia'

createApp(App).use(createPinia()).use(router).mount('#app')
