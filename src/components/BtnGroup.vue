<script setup lang="ts">
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import ModalWithEditor from './ModalWithEditor.vue';
import ModalConfirm from './ModalConfirm.vue';
import IconReply from '../components/icons/Reply.vue';
import IconHome from '../components/icons/Home.vue';
import IconEdit from '../components/icons/Edit.vue';
import IconDelete from '../components/icons/Delete.vue';
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
	>
		<label for="modify-modal" class="modal-button cursor-pointer">
			<IconEdit />
		</label>
	</div>
	<div
		v-show="route.name === 'Member'"
		class="absolute top-52 left-48 w-8 h-8 flex justify-center items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
	>
		<label for="delete-member-modal" class="modal-button cursor-pointer"
			><IconDelete
		/></label>
	</div>
	<ModalConfirm />
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
