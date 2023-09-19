import {defineStore} from "pinia";
import {FavoritesStore} from "../types/favorites";
import {useAppConfig} from "~/.nuxt/imports";
import {toast} from "vue3-toastify";
import { useFetch } from '@vueuse/core'
import {AppConfigInput} from "../types/common";

export const useFavoritesStore = defineStore('favorites', {
    state: (): FavoritesStore => ({
        items: []
    }),
    getters: {
        favoritesTotalLength: (state) => state.items.length
    },
    actions: {
        hasProduct(id: string) {
          return this.items.includes(id)
        },
        async getList() {
            const {data} = await useFetch('/api/favorites').json<string[]>()
            if (data.value?.length) this.items = data.value
        },
        async addProduct(id: string) {
            const appConfig: AppConfigInput = useAppConfig()

            if (this.items.includes(id)) {
                const {data} = await useFetch('/api/favorites/' + id).delete().json<string[]>()
                if (data.value?.length) {
                    this.items = data.value
                    toast.success(appConfig.messages?.productRemoved)
                }
            } else {
                const {data} = await useFetch('/api/favorites/' + id).post().json<string[]>()
                if (data.value?.length) {
                    this.items = data.value
                    toast.success(appConfig.messages?.productAdded)
                }
            }
        }
    }
})