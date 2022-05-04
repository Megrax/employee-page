<script setup lang="ts">
import { getPRs } from '../services';
import { repoInfo } from '../constants';
const PRs = await getPRs();
</script>
<template>
	<div class="alert shadow-md w-1/4 absolute top-16 right-16">
		<div>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				class="stroke-info flex-shrink-0 w-6 h-6"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
				></path>
			</svg>
			<div>
				<h3 class="font-bold">New Pull Request!</h3>
				<div class="text-xs">You have {{ PRs.length }} pending requests.</div>
			</div>
		</div>
		<div class="flex-none">
			<a
				:href="`https://github.com/${repoInfo.owner}/${repoInfo.name}/pulls`"
				target="_blank"
				><button class="btn btn-sm">See</button></a
			>
		</div>
	</div>
</template>
