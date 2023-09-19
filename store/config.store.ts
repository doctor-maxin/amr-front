import {defineStore} from "pinia";

export const useConfigStore = defineStore('config', {
    state: () => ({
        config: {
            mobileTel: '+7 900 999-99-99'
        }
    }),
    getters: {
        mobileTel: (state) => state.config.mobileTel
    }
})