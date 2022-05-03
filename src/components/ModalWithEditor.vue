<script lang="ts" setup>
import { ref, computed } from 'vue';
import { VAceEditor } from 'vue3-ace-editor';
import ace from 'ace-builds';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/theme-katzenmilch';
import workerJsonUrl from 'ace-builds/src-noconflict/worker-json?url';
import {
	checkEditorSyntaxError,
	checkRequiredInfo,
	checkIDUnique,
	processNewMember,
} from '../utils';
import { createBranch, createCommit, createPR } from '../services';

ace.config.setModuleUrl('ace/mode/json_worker', workerJsonUrl);

const props = defineProps({
	isVisible: {
		type: Boolean,
		default: false,
		required: true,
	},
	onClose: {
		type: Function,
		default: (payload: MouseEvent) => {},
		required: true,
	},
	content: {
		type: String,
		default: '',
		required: true,
	},
});

const editorInstance = ref<ace.Ace.Editor>();
const isSyntaxValid = ref<boolean>(true);
const isRequiredFilled = ref<string | true>(true);
const isIDUnique = ref<boolean>(true);
const requestStage = ref<
	'idle' | 'branching' | 'committing' | 'pulling' | 'done'
>('idle');
const requestBtnText = computed(() => {
	switch (requestStage.value) {
		case 'idle':
			return 'Request';
		case 'branching':
			return 'Creating branch...';
		case 'committing':
			return 'Creating commit...';
		case 'pulling':
			return 'Creating PR...';
		case 'done':
			return 'Done!';
		default:
			return 'Request';
	}
});

const editorInit = (editor: ace.Ace.Editor) => (editorInstance.value = editor);

const handleCancel = () => {
	isSyntaxValid.value = true;
	isRequiredFilled.value = true;
	isIDUnique.value = true;
	props.onClose();
};

const handleRequest = async () => {
	if (requestStage.value !== 'done') {
		if (checkEditorSyntaxError(editorInstance.value as ace.Ace.Editor)) {
			isSyntaxValid.value = false;
			return;
		} else {
			isSyntaxValid.value = true;
		}
		if (
			typeof checkRequiredInfo(editorInstance.value as ace.Ace.Editor) ===
			'string'
		) {
			isRequiredFilled.value = checkRequiredInfo(
				editorInstance.value as ace.Ace.Editor
			);
			return;
		} else {
			isRequiredFilled.value = true;
		}
		if (!checkIDUnique(editorInstance.value as ace.Ace.Editor)) {
			isIDUnique.value = false;
			return;
		} else {
			isIDUnique.value = true;
		}
		const content = (editorInstance.value as ace.Ace.Editor).getValue();
		const processedData = processNewMember(content);
		requestStage.value = 'branching';
		await createBranch(JSON.parse(content).id);
		requestStage.value = 'committing';
		await createCommit('new', JSON.parse(content).id, processedData);
		requestStage.value = 'pulling';
		await createPR(JSON.parse(content).id, JSON.parse(content).name);
		requestStage.value = 'done';
	} else {
		handleCancel();
	}
};
</script>

<template>
	<Modal v-model="isVisible" :close="onClose">
		<div class="w-2/5 h-12 bg-white rounded-tl-xl rounded-tr-xl">
			<div class="text-xl font-semibold my-4 ml-4 title">
				Request to add a new member:
			</div>
		</div>
		<div class="w-2/5 h-96 bg-white pt-6">
			<v-ace-editor
				@init="editorInit"
				v-model:value="content"
				lang="json"
				theme="katzenmilch"
				class="w-full h-full"
				:options="{ useWorker: true, fontSize: '15px' }"
			/>
		</div>
		<div
			class="w-2/5 h-24 rounded-bl-xl rounded-br-xl flex flex-row justify-between items-center bg-white"
		>
			<div>
				<div v-show="!isSyntaxValid" class="ml-4 text-red-500">
					Invalid JSON syntax.
				</div>
				<div
					v-show="isSyntaxValid && typeof isRequiredFilled === 'string'"
					class="ml-4 text-red-500"
				>
					{{ isRequiredFilled }}
				</div>
				<div
					v-show="
						isSyntaxValid &&
						typeof isRequiredFilled === 'boolean' &&
						!isIDUnique
					"
					class="ml-4 text-red-500"
				>
					Employee's id should be unique.
				</div>
			</div>
			<div>
				<button
					v-show="requestStage !== 'done'"
					class="btn mr-4 normal-case"
					@click="handleCancel"
				>
					Cancel
				</button>
				<button
					:class="`btn ${
						['branching', 'committing', 'pulling'].includes(requestStage)
							? 'loading'
							: ''
					} ${
						requestStage === 'done' ? 'btn-success' : ''
					} btn-primary mr-4 normal-case`"
					@click="handleRequest"
				>
					{{ requestBtnText }}
				</button>
			</div>
		</div>
	</Modal>
</template>

<style scoped>
.title {
	font-family: Avenir, Helvetica, Arial, sans-serif;
}
</style>
