import { createRouter, createWebHistory } from 'vue-router';
import Overview from './pages/Overview.vue';
import Member from './pages/Member.vue';

const routes = [
	{
		path: '/overview',
		name: 'Overview',
		component: Overview,
	},
	{
		path: '/member/:id',
		name: 'Member',
		component: Member,
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
