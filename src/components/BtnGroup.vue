<script setup lang="ts">
import { useRouter } from 'vue-router';
import IconReply from '../components/icons/Reply.vue';
import IconHome from '../components/icons/Home.vue';

const router = useRouter();

const handleGoHome = () => {
	router.push('/overview');
};

const handleGoBack = () => {
	router.back();
};
</script>

<template>
	<div
		class="absolute top-16 right-48 w-8 h-8 flex justify-center items-center cursor-pointer text-gray-400 hover:text-gray-600 transition-colors duration-200"
		@click="handleGoBack"
	>
		<IconReply />
	</div>
	<div
		class="absolute top-28 right-48 w-8 h-8 flex justify-center items-center cursor-pointer text-gray-400 hover:text-gray-600 transition-colors duration-200"
		@click="handleGoHome"
	>
		<IconHome />
	</div>
</template>

<style></style>
