import { createRouter, createWebHistory } from 'vue-router';
import Overview from './pages/Overview.vue';
import Member from './pages/Member.vue';
import Department from './pages/Department.vue';
import Login from './pages/Login.vue';

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
	{
		path: '/dep/:name',
		name: 'Department',
		component: Department,
	},
	{
		path: '/login',
		name: 'Login',
		component: Login,
	},
	// this redirects any unknown routes to /overview
	{
		path: '/:pathMatch(.*)*',
		redirect: '/overview',
	},
];

const router = createRouter({
	history: createWebHistory(),
	routes,
});

router.beforeEach((to) => {
	if (to.name !== 'Login' && !sessionStorage.getItem('loggedIn')) {
		router.push('/login');
		return false;
	} else if (to.name === 'Login' && sessionStorage.getItem('loggedIn')) {
		router.push('/');
		return false;
	}
});

export default router;
