<script setup lang="ts">
defineProps<{
	type: string;
	value: string | number;
}>();
</script>

<template>
	<section class="mb-3">
		<span class="inline-block text-right w-1/3 text-black font-medium">{{
			type
		}}</span>
		<span class="inline-block text-left w-1/2 pl-2">{{ value }}</span>
	</section>
</template>

<style></style>
