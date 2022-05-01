import { createRouter, createWebHistory } from 'vue-router';
import Overview from './pages/Overview.vue';
import Detail from './pages/Detail.vue';

const routes = [
	{
		path: '/overview',
		name: 'Overview',
		component: Overview,
	},
	{
		path: '/detail',
		name: 'Detail',
		component: Detail,
	},
];

export default createRouter({
	history: createWebHistory(),
	routes,
});
