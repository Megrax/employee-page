<script setup lang="ts">
import { ref, computed } from 'vue';
import BriefCard from '../components/BriefCard.vue';
import NewCard from '../components/NewCard.vue';
import ModalWithEditor from '../components/ModalWithEditor.vue';
import { newMemberTemplate } from '../constants';
import config from '../../data.json';

const isShow = ref<boolean>(false);
const searchValue = ref<string>('');
const filteredResult = computed(() => {
	const search = searchValue.value.toLowerCase();
	return config.employees.filter((e) => {
		return JSON.stringify(e).toLowerCase().includes(search);
	});
});
</script>

<template>
	<section class="text-gray-600 body-font">
		<div class="container px-5 mx-auto">
			<div class="flex flex-col text-center w-full">
				<h1 class="text-2xl font-medium title-font mb-4 text-gray-900">
					{{ config.title }}
				</h1>
				<p class="lg:w-2/3 mx-auto leading-relaxed text-base">
					{{ config.teamSlogan }}
				</p>
			</div>
			<div
				class="flex flex-row justify-center items-center w-2/5 md:w-1/5 mx-auto mt-8"
			>
				<input
					type="text"
					id="full-name"
					name="full-name"
					placeholder="Text here, ENTER to search."
					v-model.lazy="searchValue"
					class="w-full h-8 bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-transparent focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
				/>
			</div>
			<div class="flex justify-center md:justify-start flex-wrap -m-4 mt-10">
				<BriefCard
					v-for="employee in filteredResult"
					:id="employee.id"
					:name="employee.name"
					:bio="employee.bio"
					:position="employee.position"
					:dep="employee.department"
					:key="employee.name"
				/>
				<NewCard
					:isModalVisible="isShow"
					:toggleModalVisible="() => (isShow = true)"
				/>
				<ModalWithEditor
					:isVisible="isShow"
					:onClose="() => (isShow = false)"
					:content="newMemberTemplate"
				/>
			</div>
		</div>
	</section>
</template>
