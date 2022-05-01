<script setup lang="ts">
import Avatar from 'vue-boring-avatars';
defineProps({
	name: { type: String, required: true },
	age: { type: Number, required: true },
	position: { type: String, required: true },
	bio: { type: String, required: true },
});
</script>

<template>
	<div class="p-4 lg:w-1/4 md:w-1/3">
		<div
			class="h-full py-2 flex flex-col items-center text-center rounded-md cursor-pointer hover:shadow-lg"
		>
			<Avatar
				variant="beam"
				:name="name"
				:square="true"
				class="flex-shrink-0 rounded-lg w-32 h-32 object-cover object-center mb-4"
			/>
			<div class="w-full">
				<h2 class="title-font font-medium text-lg text-gray-900">
					{{ name }}
				</h2>
				<h3 class="text-gray-500 mb-3">{{ position }}</h3>
				<p class="mb-4">
					{{ bio }}
				</p>
			</div>
		</div>
	</div>
</template>

<style></style>
