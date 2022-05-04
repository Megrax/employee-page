import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import StarportPlugin from 'vue-starport';
import { createPinia } from 'pinia';
import './index.css';

const app = createApp(App).use(router).use(StarportPlugin()).use(createPinia());

app.mount('#app');
