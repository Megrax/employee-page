import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import StarportPlugin from 'vue-starport';
import './index.css';
import 'vue-universal-modal/dist/index.css';

const app = createApp(App).use(router).use(StarportPlugin());

app.mount('#app');
