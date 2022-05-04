<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { createBranch, createCommit, createPR } from '../services';
import { processDeleteMember } from '../utils';
import data from '../../data.json';
defineProps({
	isVisible: {
		type: Boolean,
		default: false,
	},
});
const route = useRoute();
const requestStage = ref<
	'idle' | 'branching' | 'committing' | 'pulling' | 'done'
>('idle');
const requestBtnText = computed(() => {
	switch (requestStage.value) {
		case 'idle':
			return 'Confirm';
		case 'branching':
			return 'Creating branch...';
		case 'committing':
			return 'Creating commit...';
		case 'pulling':
			return 'Creating PR...';
		case 'done':
			return 'Done!';
		default:
			return 'Confirm';
	}
});
const handleDelete = async () => {
	if (requestStage.value !== 'done') {
		const processedData = processDeleteMember(route.params.id as string);
		requestStage.value = 'branching';
		await createBranch(route.params.id as string, 'delete-member');
		requestStage.value = 'committing';
		await createCommit(
			'delete-member',
			route.params.id as string,
			processedData
		);
		requestStage.value = 'pulling';
		await createPR(
			'delete-member',
			route.params.id as string,
			data.employees.find((e) => e.id === route.params.id)?.name as string
		);
		requestStage.value = 'done';
	} else {
	}
};
</script>
<template>
	<input
		type="checkbox"
		id="my-modal"
		class="modal-toggle"
		v-model="isVisible"
	/>
	<div class="modal">
		<div class="modal-box">
			<h3 class="font-bold text-lg">
				Are you sure to remove
				{{ data.employees.find((e) => e.id === route.params.id)?.name }} from
				the team?
			</h3>
			<p class="py-4">
				This will create a Pull Request to
				<span class="text-red-400 font-semibold">remove</span> the member from
				our member list.
			</p>
			<div class="modal-action">
				<label
					for="my-modal"
					v-show="requestStage !== 'done'"
					class="btn normal-case"
					>Cancel</label
				>
				<button
					@click="handleDelete"
					v-show="requestStage !== 'done'"
					:class="`btn ${
						['branching', 'committing', 'pulling'].includes(requestStage)
							? 'loading'
							: ''
					} btn-error normal-case text-white`"
				>
					{{ requestBtnText }}
				</button>
				<label
					for="my-modal"
					v-show="requestStage === 'done'"
					class="btn btn-success normal-case"
					>{{ requestBtnText }}</label
				>
			</div>
		</div>
	</div>
</template>

<style></style>
