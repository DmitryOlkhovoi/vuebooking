import './assets/main.css'
import '@vuepic/vue-datepicker/dist/main.css'
import 'primevue/resources/themes/lara-light-indigo/theme.css'
import 'primeicons/primeicons.css'

import VueDatePicker from '@vuepic/vue-datepicker'
import PrimeVue from 'primevue/config'
import AutoComplete from 'primevue/autocomplete'
import Dropdown from 'primevue/dropdown'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

const app = createApp(App)

app.use(createPinia())
app.component('VueDatePicker', VueDatePicker)
app.use(PrimeVue)
app.component('AutoComplete', AutoComplete)
app.component('Dropdown', Dropdown)
app.component('Button', Button)
app.component('InputText', InputText)
app.component('InputNumber', InputNumber)

app.mount('#app')
