import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import StarportPlugin from 'vue-starport';
import VueUniversalModal from 'vue-universal-modal';
import './index.css';
import 'vue-universal-modal/dist/index.css';

const app = createApp(App)
	.use(router)
	.use(StarportPlugin())
	.use(VueUniversalModal, {
		teleportTarget: '#modals',
	});
app.mount('#app');
