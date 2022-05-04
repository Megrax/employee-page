import { defineStore } from 'pinia';

export const useBannedIDs = defineStore('bannedIDs', {
	state: (): { list: any[] } => {
		return { list: [] };
	},
	actions: {
		changeState(params: any) {
			this.list = [...params];
		},
	},
});
