import ace from 'ace-builds';
import DATA from '../../data.json';
import { TData, TDepartment } from '../types';

export const checkEditorSyntaxError = (editor: ace.Ace.Editor): boolean => {
	const annotations = editor.getSession().getAnnotations();
	return (
		annotations.filter(
			(annotation) =>
				annotation.type === 'error' || annotation.type === 'warning'
		).length > 0
	);
};

export const checkRequiredInfo = (editor: ace.Ace.Editor): string | true => {
	let res: string | true = true;
	const value = editor.getValue();
	Object.entries(JSON.parse(value)).forEach(([k, v]) => {
		if (k !== 'detail' && k !== 'description' && v === '') {
			if (res === true) {
				res = `${k} is required`;
			}
		}
	});
	return res;
};

export const checkIDUnique = (
	editor: ace.Ace.Editor,
	mode: string,
	oldID?: string
) => {
	if (mode === 'create') {
		const { id } = JSON.parse(editor.getValue());
		return !DATA.employees.some((employee) => employee.id === id);
	} else if (mode === 'modify-member') {
		const { id } = JSON.parse(editor.getValue());
		return !DATA.employees.some(
			(employee) => employee.id === id && employee.id !== oldID
		);
	} else {
		const { name } = JSON.parse(editor.getValue());
		return !DATA.departments.some(
			(department) => department.name === name && department.name !== oldID
		);
	}
};

export const checkIfChanged = (editor: ace.Ace.Editor, oldContent: string) =>
	// parse before stringify to ignore whitespace changes
	JSON.stringify(JSON.parse(oldContent)) !==
	JSON.stringify(JSON.parse(editor.getValue()));

export const processNewMember = (newContent: string) => {
	const data: TData = JSON.parse(JSON.stringify(DATA));

	const newMember = JSON.parse(newContent);
	const newMemberDep = newMember.department;
	// check if a new department should be created
	if (!data.departments.some((dep) => dep.name === newMemberDep)) {
		data.departments.push({
			name: newMemberDep,
			description: '',
			members: [newMember.id],
		});
	}
	data.employees.push(newMember);
	return data;
};

export const processModifyMember = (
	newContent: string,
	oldContent: string,
	oldID: string
) => {
	const data: TData = JSON.parse(JSON.stringify(DATA));

	const oldMember = JSON.parse(oldContent);
	const oldMemberDep = oldMember.department;
	const modifiedMember = JSON.parse(newContent);
	const modifiedMemberDep = modifiedMember.department;

	if (oldMemberDep !== modifiedMemberDep) {
		const oldDep = data.departments.find((dep) => dep.name === oldMemberDep);
		oldDep?.members.splice(oldDep.members.indexOf(oldMember.id), 1);
		if (data.departments.some((dep) => dep.name === modifiedMemberDep)) {
			const newDep = data.departments.find(
				(dep) => dep.name === modifiedMemberDep
			);
			newDep?.members.push(modifiedMember.id);
		} else {
			data.departments.push({
				name: modifiedMemberDep,
				description: '',
				members: [modifiedMember.id],
			});
		}
	}

	data.employees[data.employees.findIndex((e) => e.id === oldID)] =
		modifiedMember;
	return data;
};

export const processModifyDepartment = (newContent: string) => {
	const data: TData = JSON.parse(JSON.stringify(DATA));

	const modifiedDep = JSON.parse(newContent);
	let oldDep: TDepartment =
		data.departments[
			data.departments.findIndex((d) => d.name === modifiedDep.name)
		];
	data.departments[
		data.departments.findIndex((d) => d.name === modifiedDep.name)
	] = {
		...modifiedDep,
		members: oldDep.members,
	};
	return data;
};

export const base64Encode = (content: any): string =>
	window.btoa(JSON.stringify(content, null, 2));
