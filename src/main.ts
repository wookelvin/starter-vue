import { createApp } from 'vue'
import './styles/index.css'
import App from './App.vue'
import { router } from './router'
import { createPinia } from 'pinia'
import { createMetaManager } from 'vue-meta'

const pinia = createPinia();

createApp(App)
    .use(router)
    .use(pinia)
    .use(createMetaManager())
    .mount('#app')
