<script setup lang="ts">
import Avatar from 'vue-boring-avatars';
import { useRouter } from 'vue-router';

const props = defineProps({
	id: { type: String, required: true },
	name: { type: String, required: true },
	position: { type: String, required: true },
	bio: { type: String, required: true },
});

const router = useRouter();

const handleGoToDetail = () => {
	router.push({
		name: 'Detail',
		params: { id: props.id },
	});
};
</script>

<template>
	<div class="p-4 lg:w-1/4 md:w-1/3">
		<div
			class="h-full py-2 flex flex-col items-center text-center rounded-md cursor-pointer hover:shadow-lg"
			@click="handleGoToDetail"
		>
			<Starport
				:port="id"
				class="flex-shrink-0 rounded-lg w-32 h-32 object-cover object-center mb-4"
			>
				<Avatar
					variant="beam"
					:name="name"
					:square="true"
					class="flex-shrink-0 rounded-lg w-32 h-32 object-cover object-center mb-4"
				/>
			</Starport>
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
