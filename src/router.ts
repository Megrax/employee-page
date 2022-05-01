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
		path: '/detail/:id',
		name: 'Detail',
		component: Detail,
	},
	// this redirects any unknown routes to /overview
	{
		path: '/:pathMatch(.*)*',
		redirect: '/overview',
	},
];

export default createRouter({
	history: createWebHistory(),
	routes,
});
