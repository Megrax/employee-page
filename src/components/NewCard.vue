<script setup lang="ts">
import IconPlus from '../components/icons/Plus.vue';

defineProps({
	isModalVisible: {
		type: Boolean,
		default: false,
		required: true,
	},
	toggleModalVisible: {
		type: Function,
		default: () => {},
		required: true,
	},
});
</script>

<template>
	<div class="p-4 lg:w-1/4 md:w-1/3">
		<div
			class="h-full py-2 flex flex-col items-center text-center rounded-md"
			@click="() => toggleModalVisible()"
		>
			<div
				class="flex justify-center items-center flex-shrink-0 rounded-lg w-32 h-32 object-cover object-center mb-4 cursor-pointer border hover:shadow-lg bg-gray-00"
			>
				<IconPlus class="text-gray-400" />
			</div>
			<div class="w-full">
				<h2 class="title-font font-medium text-lg text-gray-900"></h2>
				<h3 class="text-gray-500 mb-3"></h3>
				<p class="mb-4"></p>
			</div>
		</div>
	</div>
</template>

<style></style>
