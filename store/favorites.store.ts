import {defineStore} from "pinia";
import {FavoritesStore} from "../types/favorites";
import {useAppConfig} from "~/.nuxt/imports";
import {toast} from "vue3-toastify";
import { useFetch } from '@vueuse/core'
import {AppConfigInput} from "../types/common";
import { useFavoritesFetch } from "~/composables/useFavoritesFetch";

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
            const {client} = useFavoritesFetch()
            const {data} = await client('/').json<string[]>()
            if (data.value?.length) this.items = data.value
        },
        async addProduct(id: string) {
            const {client} = useFavoritesFetch()
            const appConfig: AppConfigInput = useAppConfig()

            if (this.items.includes(id)) {
                const {data} = await client('/' + id).delete().json<string[]>()
                if (data.value?.length) {
                    this.items = data.value
                    toast.success(appConfig.messages?.productRemoved)
                }
            } else {
                const {data} = await client('/' + id).post().json<string[]>()
                if (data.value?.length) {
                    this.items = data.value
                    toast.success(appConfig.messages?.productAdded)
                }
            }
        }
    }
})