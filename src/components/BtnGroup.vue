<script setup lang="ts">
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import ModalWithEditor from './ModalWithEditor.vue';
import IconReply from '../components/icons/Reply.vue';
import IconHome from '../components/icons/Home.vue';
import IconEdit from '../components/icons/Edit.vue';
import data from '../../data.json';

const router = useRouter();
const route = useRoute();
const isShow = ref<boolean>(false);

const handleGoHome = () => {
	router.push('/overview');
};

const handleGoBack = () => {
	router.back();
};

const handleEdit = () => {
	isShow.value = true;
};
</script>

<template>
	<div
		class="absolute top-16 left-48 w-8 h-8 flex justify-center items-center cursor-pointer text-gray-400 hover:text-gray-600 transition-colors duration-200"
		@click="handleGoBack"
	>
		<IconReply />
	</div>
	<div
		class="absolute top-28 left-48 w-8 h-8 flex justify-center items-center cursor-pointer text-gray-400 hover:text-gray-600 transition-colors duration-200"
		@click="handleGoHome"
	>
		<IconHome />
	</div>
	<div
		class="absolute top-40 left-48 w-8 h-8 flex justify-center items-center cursor-pointer text-gray-400 hover:text-gray-600 transition-colors duration-200"
		@click="handleEdit"
	>
		<IconEdit />
	</div>
	<ModalWithEditor
		:isVisible="isShow"
		:onClose="() => (isShow = false)"
		:content="
			route.name === 'Member'
				? JSON.stringify(
						data.employees.find((e) => e.id === route.params.id),
						null,
						2
				  )
				: JSON.stringify(
						{
							name: data.departments.find((d) => d.name === route.params.name)
								?.name,
							description: data.departments.find(
								(d) => d.name === route.params.name
							)?.description,
						},
						null,
						2
				  )
		"
		:mode="`modify-${route.name.toString().toLowerCase()}`"
		:id="(route.params.id as string) || (route.params.name as string)"
	/>
</template>

<style></style>
