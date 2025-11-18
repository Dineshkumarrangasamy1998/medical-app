import { createApp } from 'vue'
import './style.css'
import 'vue3-toastify/dist/index.css'
import App from './App.vue'
import router from './router'

import Vue3EasyDataTable from 'vue3-easy-data-table'
import 'vue3-easy-data-table/dist/style.css'

// Custom table style overrides are in style.css

const app = createApp(App);
app.component('EasyDataTable', Vue3EasyDataTable);
app.use(router).mount('#app')