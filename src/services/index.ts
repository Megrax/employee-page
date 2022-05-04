// @ts-ignore
import { Octokit } from 'https://cdn.skypack.dev/octokit';
import { repoInfo } from '../constants';
import { base64Encode } from '../utils';

const octokit = new Octokit({
	// @ts-ignore
	auth: process.env.VUE_APP_GITHUB_TOKEN,
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

export const createBranch = async (id: string) => {
	const latestSHA = await getLatestMainBranchSHA();
	await octokit.request(`POST /repos/{owner}/{repo}/git/refs`, {
		owner: repoInfo.owner,
		repo: repoInfo.name,
		ref: `refs/heads/${repoInfo.branchPrefix}-${id}`,
		sha: latestSHA,
	});
};

export const createCommit = async (
	action: 'new' | 'modify',
	id: string,
	content: any
) => {
	const latestSHA = await getLatestFileSHA();
	const base64Content = base64Encode(content);

	await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
		owner: repoInfo.owner,
		repo: repoInfo.name,
		path: repoInfo.targetFile,
		message: action === 'new' ? `add(member): ${id}` : `modify(member): ${id}`,
		committer: {
			name: repoInfo.committer,
			email: repoInfo.committerEmail,
		},
		content: base64Content,
		sha: latestSHA,
		branch: `${repoInfo.branchPrefix}-${id}`,
	});
};

export const createPR = async (id: string, name: string) => {
	await octokit.request('POST /repos/{owner}/{repo}/pulls', {
		owner: repoInfo.owner,
		repo: repoInfo.name,
		title: `Introducing ${name}!`,
		body: `Welcome, ${name}! 🥳
> This is an automatically generated Pull Request, which means that someone has made changes to our team on the website.`,
		head: `${repoInfo.branchPrefix}-${id}`,
		base: 'main',
	});
};
