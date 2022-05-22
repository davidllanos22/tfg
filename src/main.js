import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { Settings } from "@/core/settings";


let app = createApp(App);
app.provide("settings", new Settings());
app.use(router).mount('#app');