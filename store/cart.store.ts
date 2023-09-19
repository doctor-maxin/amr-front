import {defineStore} from "pinia";
import {useAppConfig} from "~/.nuxt/imports";
import {CartItem, CartState, DeliveryTypes} from "../types/cart";
import {toast} from "vue3-toastify";
import {useFetch} from "@vueuse/core";

export const useCartStore = defineStore('cart', {
    state: (): CartState => ({
        items: [],
        discount: {
            promoCode: null,
            amount: 0
        },
        delivery: {
            calculated: false,
            amount: 0,
            type: DeliveryTypes.delivery
        }
    }),
    getters: {
        cartTotalLength: (state) => state.items.length,
    },
    actions: {
        async getCart() {
            const {data} = await useFetch<CartItem[]>('/api/cart').json()
            if (data.value?.length) this.items = data.value
        },
        async removeItem(id: string) {
            await useFetch<CartItem[]>('/api/cart/' + id).delete()
            this.items = this.items.filter(item => item.id !== id)
        },
        async setLine(id: string, count: number) {
            const {data} = await useFetch<CartItem[]>('/api/cart').post({
                id,
                count
            }).json()
            this.items = this.items.map(item => {
                if (item.id === id) return {
                    ...item,
                    count
                }
                return item
            })
        },
        async addProduct(id: string, count = 1) {
            const appConfig = useAppConfig()

            const {data} = await useFetch<CartItem[]>('/api/cart').post({
                id,
                count
            }).json()
            if (data.value?.length) {
                this.items = data.value
                toast.success(appConfig.messages?.productAdded)
            }
        }
    }
})