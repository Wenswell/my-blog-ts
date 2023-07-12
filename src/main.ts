import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

console.log(import.meta)
console.log(import.meta.env)
console.log(import.meta.env.__APP_ENV__)

createApp(App).mount('#app')
