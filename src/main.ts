import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import './tailwind.css'
import './style.css'

const app = createApp(App)
app.use(createPinia())
app.mount('#app')