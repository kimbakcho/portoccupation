import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import {Dialog, Quasar} from 'quasar'
import quasarLang from 'quasar/lang/ko-KR'

import '@quasar/extras/material-icons/material-icons.css'
import '@quasar/extras/fontawesome-v5/fontawesome-v5.css'

import 'quasar/src/css/index.sass'
import axios from "axios";


const app = createApp(App)

app.use(router)

axios.defaults.baseURL = import.meta.env.VITE_AXIOS_BASE_URL
axios.defaults.withCredentials = true;
app.use(Quasar, {
    plugins: {
        Dialog
    }, // import Quasar plugins and add here
    lang: quasarLang,
})

app.mount('#app')
