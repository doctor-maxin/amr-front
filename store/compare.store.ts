import { defineStore } from "pinia";
import { IProduct } from "../types/product";
import { toast } from "vue3-toastify";

type CompareStore = {
    ids: string[];
}
export const useCompareStore = defineStore('compare', {
    state: (): CompareStore => ({
        ids: []
    }),
    actions: {
        addToCompare(id: string) {
            const appConfig = useAppConfig();
            if (!this.ids.includes(id)) this.ids.push(id)
            toast.success(appConfig.messages?.productCompare);
        },
        removeFromCompare(id: string) {
            this.ids = this.ids.filter(i => i !== id)
        }
    },
    persist: true
})