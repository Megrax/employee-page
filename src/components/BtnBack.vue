<script setup lang="ts">
import { useRouter } from 'vue-router';
import Icon from '../components/icons/Reply.vue';

const router = useRouter();

const handleGoBack = () => {
	router.back();
};
</script>

<template>
	<div
		class="absolute top-16 right-48 w-8 h-8 flex justify-center items-center cursor-pointer text-gray-400 hover:text-gray-600 transition-colors duration-200"
		@click="handleGoBack"
	>
		<Icon />
	</div>
</template>

<style></style>
