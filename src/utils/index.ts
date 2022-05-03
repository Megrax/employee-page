import ace from 'ace-builds';
import data from '../../data.json';

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
		if (k !== 'detail' && v === '') {
			if (res === true) {
				res = `${k} is required`;
			}
		}
	});
	return res;
};

export const checkIDUnique = (editor: ace.Ace.Editor) => {
	const id = JSON.parse(editor.getValue());
	return !data.employees.some((employee) => employee.id === id.id);
};

export const processNewMember = (newContent: string) => {
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

export const base64Encode = (content: any): string =>
	window.btoa(JSON.stringify(content, null, 2));
