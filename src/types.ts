export type TData = {
	title: string;
	teamSlogan: string;
	departments: TDepartment[];
	employees: TEmployee[];
};

export type TDepartment = {
	name: string;
	description: string;
	members: string[];
};

export type TEmployee = {
	id: string;
	name: string;
	department: string;
	position: string;
	bio: string;
	detail: Record<string, string>;
};
