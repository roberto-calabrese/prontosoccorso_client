import {defineStore} from 'pinia'

export const useApiStore = defineStore('api', {
    state: () => ({
        settings: null as any,
        github: null as any,
    }),
    actions: {
        fetchSettings: async function () {
            this.settings = await fetch('settings');
        },
        fetchGitHub: async function () {
            this.github = await fetch('github');
        },
    },
})