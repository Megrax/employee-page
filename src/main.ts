import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import StarportPlugin from 'vue-starport';
import './index.css';

const app = createApp(App).use(router).use(StarportPlugin());
app.mount('#app');
