// @ts-ignore
import { Octokit } from 'https://cdn.skypack.dev/octokit';
import { repoInfo } from '../constants';
import { base64Encode } from '../utils';

const octokit = new Octokit({
	auth: import.meta.env.VITE_VUE_APP_GITHUB_TOKEN,
});

export const testGithubConnection = async () => {
	const {
		data: { login },
	} = await octokit.rest.users.getAuthenticated();

	console.log('Hello, %s', login);
};

export const getLatestMainBranchSHA = async (): Promise<string> => {
	const { data } = await octokit.request(
		'GET /repos/{owner}/{repo}/git/ref/{ref}',
		{
			owner: repoInfo.owner,
			repo: repoInfo.name,
			ref: 'heads/main',
		}
	);

	return data.object.sha;
};

export const getLatestFileSHA = async (): Promise<string> => {
	const { data } = await octokit.request(
		`GET /repos/{owner}/{repo}/contents/{path}`,
		{
			owner: repoInfo.owner,
			repo: repoInfo.name,
			path: repoInfo.targetFile,
		}
	);

	return data.sha;
};

export const getCorrespondingBranchPrefix = (mode: string) => {
	switch (mode) {
		case 'create':
			return repoInfo.branchPrefixCreate;
		case 'modify-member':
			return repoInfo.branchPrefixModifyMember;
		case 'modify-department':
			return repoInfo.branchPrefixModifyDep;
		default:
			return repoInfo.branchPrefixCreate;
	}
};

export const createBranch = async (id: string, mode: string) => {
	const latestSHA = await getLatestMainBranchSHA();

	await octokit.request(`POST /repos/{owner}/{repo}/git/refs`, {
		owner: repoInfo.owner,
		repo: repoInfo.name,
		ref: `refs/heads/${getCorrespondingBranchPrefix(mode)}-${id}`,
		sha: latestSHA,
	});
};

export const createCommit = async (mode: string, id: string, content: any) => {
	const latestSHA = await getLatestFileSHA();
	const base64Content = base64Encode(content);

	await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
		owner: repoInfo.owner,
		repo: repoInfo.name,
		path: repoInfo.targetFile,
		message:
			mode === 'create'
				? `add(member): ${id}`
				: mode === 'modify-member'
				? `modify(member): ${id}`
				: `modify(department): ${id}`,
		committer: {
			name: repoInfo.committer,
			email: repoInfo.committerEmail,
		},
		content: base64Content,
		sha: latestSHA,
		branch: `${getCorrespondingBranchPrefix(mode)}-${id}`,
	});
};

export const createPR = async (mode: string, id: string, name: string) => {
	let message = { title: '', body: '' };
	switch (mode) {
		case 'create':
			message.title = `Introducing ${name}!`;
			message.body = `Welcome, ${name}! 🥳`;
			break;
		case 'modify-member':
			message.title = `Modifying member ${name}!`;
			message.body = `Applying changes to (member): ${name}`;
			break;
		case 'modify-department':
			message.title = `Modifying department of ${name}!`;
			message.body = `Applying changes to (department): ${name}`;
			break;

		default:
			break;
	}
	await octokit.request('POST /repos/{owner}/{repo}/pulls', {
		owner: repoInfo.owner,
		repo: repoInfo.name,
		title: message.title,
		body: `${message.body}
> This is an automatically generated Pull Request, which means that someone has made changes to our team on the website.`,
		head: `${getCorrespondingBranchPrefix(mode)}-${id}`,
		base: 'main',
	});
};
