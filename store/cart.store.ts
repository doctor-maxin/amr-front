import { defineStore } from "pinia";
import { useAppConfig, useCartFetch, useCookie } from "~/.nuxt/imports";
import { CartItem, CartState, DeliveryTypes } from "~/types/cart";
import { toast } from "vue3-toastify";
import { IPromoCode } from "~/types/common";

export const useCartStore = defineStore("cart", {
	state: (): CartState => {
		// const cartState = useCookie("cart");
		const items = [];
		// if (cartState.value) {
		// 	console.log(cartState.value);
		// 	items.push(...JSON.parse(cartState.value));
		// }

		return {
			items,
			discount: null,
			delivery: {
				calculated: false,
				amount: 0,
				type: DeliveryTypes.delivery,
			},
		};
	},
	getters: {
		cartTotalLength: (state) => state.items.length,
	},
	actions: {
		setDelivery(data: CartState["delivery"]) {
			this.delivery = data;
		},
		setPromoCode(promocode: IPromoCode) {
			this.discount = promocode;
		},
		async clearCart() {
			const { client } = useCartFetch();
			await client<CartItem[]>("/", {}).delete();
			this.items = [];
		},
		async getCart() {
			// const { client } = useCartFetch();
			//
			// const { data } = await client<CartItem[]>("/").json();
			// if (Array.isArray(data.value)) {
			// 	this.items = data.value;
			// } else if (typeof data.value === "string") {
			// 	this.items = JSON.parse(data.value);
			// }
		},
		async removeItem(id: string) {
			const { client } = useCartFetch();
			await client<CartItem[]>("/" + id).delete();
			this.items = this.items.filter((item) => item.id !== id);
		},
		async setLine(id: string, count: number) {
			const { client } = useCartFetch();

			const { data } = await client<CartItem[]>("/")
				.post({
					id,
					count,
				})
				.json();
			this.items = this.items.map((item) => {
				if (item.id === id)
					return {
						...item,
						count,
					};
				return item;
			});
		},
		async addProduct(id: string, count = 1) {
			const { client } = useCartFetch();
			const appConfig = useAppConfig();

			const { data } = await client<CartItem[]>("/")
				.post({
					id,
					count,
				})
				.json();
			if (Array.isArray(data.value)) {
				this.items = data.value;
				toast.success(appConfig.messages?.productAdded);
			} else if (Array.isArray(data.value?.cart)) {
				this.items = data.value.cart;
				toast.success(appConfig.messages?.productAdded);
			}
		},
	},
	persist: true,
});
