<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import secrets from '../../secrets.json';

const username = ref<string>('');
const password = ref<string>('');
const isCorrect = ref<boolean>(true);
const router = useRouter();

const handleLogin = () => {
	if (
		username.value === secrets.username &&
		password.value === secrets.password
	) {
		sessionStorage.setItem('loggedIn', 'true');
		router.push('/');
	} else {
		isCorrect.value = false;
	}
};
</script>

<template>
	<section class="login text-gray-600">
		<div
			class="container px-5 py-24 mx-auto flex flex-wrap items-center justify-center"
		>
			<div
				class="lg:w-2/5 md:w-2/3 bg-gray-100 rounded-lg p-10 flex flex-col w-4/5 mt-10 md:mt-0"
			>
				<div class="flex flex-col md:flex-row justify-between items-center">
					<h2 class="text-gray-900 text-lg font-medium title-font mb-5">
						Sign In
					</h2>
					<h4 class="text-red-500 text-sm title-font mb-5" v-show="!isCorrect">
						Username or password incorrect!
					</h4>
				</div>
				<div class="relative mb-4">
					<label for="username" class="leading-7 text-sm text-gray-600"
						>Username</label
					>
					<input
						type="text"
						id="username"
						name="username"
						v-model="username"
						:class="`${
							isCorrect ? '' : 'border-red-500'
						} w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out`"
					/>
				</div>
				<div class="relative mb-6">
					<label for="password" class="leading-7 text-sm text-gray-600"
						>Password</label
					>
					<input
						type="password"
						id="password"
						name="password"
						v-model="password"
						:class="`${
							isCorrect ? '' : 'border-red-500'
						} w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out`"
					/>
				</div>
				<button
					class="text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg"
					@click="handleLogin"
				>
					Login
				</button>
			</div>
		</div>
	</section>
</template>

<style>
.login {
	font-family: Helvetica, Arial, sans-serif;
}
</style>
