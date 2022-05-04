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
	checkIfChanged,
	processNewMember,
	processModifyMember,
	processModifyDepartment,
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
	mode: {
		type: String,
		default: '',
		required: true,
	},
	id: {
		type: String,
		default: '',
		required: false,
	},
});

const originalContent = JSON.parse(JSON.stringify(props.content)); // simple deep clone
const editorInstance = ref<ace.Ace.Editor>();
const isSyntaxValid = ref<boolean>(true);
const isRequiredFilled = ref<string | true>(true);
const isIDUnique = ref<boolean>(true);
const isChanged = ref<boolean>(true);
const requestStage = ref<
	'idle' | 'branching' | 'committing' | 'pulling' | 'done'
>('idle');
const modalTitle = computed(() => {
	switch (props.mode) {
		case 'create':
			return 'Request to add a new member:';
		case 'modify-member':
			return 'Request to modify member info:';
		case 'modify-department':
			return 'Request to modify department info:';
		default:
			break;
	}
});
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
		if (
			!checkIDUnique(
				editorInstance.value as ace.Ace.Editor,
				props.mode,
				props.id
			)
		) {
			isIDUnique.value = false;
			return;
		} else {
			isIDUnique.value = true;
		}
		if (
			!checkIfChanged(editorInstance.value as ace.Ace.Editor, originalContent)
		) {
			isChanged.value = false;
			return;
		} else {
			isChanged.value = true;
		}

		const content = (editorInstance.value as ace.Ace.Editor).getValue();
		let processedData;
		switch (props.mode) {
			case 'create':
				processedData = processNewMember(content);
				break;
			case 'modify-member':
				processedData = processModifyMember(content, originalContent, props.id);
				break;
			case 'modify-department':
				processedData = processModifyDepartment(content);
				break;
		}
		requestStage.value = 'branching';
		await createBranch(
			JSON.parse(content).id || JSON.parse(content).name,
			props.mode
		);
		requestStage.value = 'committing';
		await createCommit(
			props.mode,
			JSON.parse(content).id || JSON.parse(content).name,
			processedData
		);
		requestStage.value = 'pulling';
		await createPR(
			props.mode,
			JSON.parse(content).id || JSON.parse(content).name,
			JSON.parse(content).name
		);
		requestStage.value = 'done';
	} else {
		handleCancel();
	}
};
</script>

<template>
	<input type="checkbox" id="modify-modal" class="modal-toggle" />
	<div class="modal">
		<div class="modal-box">
			<h3 class="font-bold text-lg">{{ modalTitle }}</h3>
			<p class="pt-4 h-96">
				<v-ace-editor
					@init="editorInit"
					v-model:value="content"
					lang="json"
					theme="katzenmilch"
					class="w-full h-full"
					:options="{ useWorker: true, fontSize: '15px' }"
				/>
			</p>

			<div class="modal-action flex flex-row items-center">
				<div class="absolute left-6">
					<div v-show="!isSyntaxValid" class="text-red-500">
						Invalid JSON syntax.
					</div>
					<div
						v-show="isSyntaxValid && typeof isRequiredFilled === 'string'"
						class="text-red-500"
					>
						{{ isRequiredFilled }}
					</div>
					<div
						v-show="
							isSyntaxValid &&
							typeof isRequiredFilled === 'boolean' &&
							!isIDUnique
						"
						class="text-red-500"
					>
						{{
							mode === 'modify-department'
								? "Departments' name should be unique."
								: "Employees' id should be unique."
						}}
					</div>
					<div
						v-show="
							isSyntaxValid &&
							typeof isRequiredFilled === 'boolean' &&
							isIDUnique &&
							!isChanged
						"
						class="text-red-500"
					>
						Content is not changed.
					</div>
				</div>
				<label
					for="modify-modal"
					v-show="requestStage !== 'done'"
					class="btn normal-case"
					>Cancel</label
				>
				<button
					@click="handleRequest"
					v-show="requestStage !== 'done'"
					:class="`btn ${
						['branching', 'committing', 'pulling'].includes(requestStage)
							? 'loading'
							: ''
					} btn-primary normal-case text-white ml-2`"
				>
					{{ requestBtnText }}
				</button>
				<label
					for="modify-modal"
					@click="handleRequest"
					v-show="requestStage === 'done'"
					class="btn btn-success normal-case"
					>{{ requestBtnText }}</label
				>
			</div>
		</div>
	</div>
</template>

<style scoped>
.title {
	font-family: Avenir, Helvetica, Arial, sans-serif;
}
</style>
