<script lang="ts" setup>
import { useRouter, computed, useEvent } from "../../../../.nuxt/imports";
import { useCurrency } from "../../../../composables/useCurrency";
import { useCartStore } from "../../../../store/cart.store";
import { useFavoritesStore } from "../../../../store/favorites.store";
import { IProduct } from "../../../../types/product";
import { storeToRefs } from "pinia";

const props = defineProps<{
	product: IProduct;
}>();
const cartStore = useCartStore();
const favoritesStore = useFavoritesStore();
const router = useRouter();
const { items } = storeToRefs(cartStore);

const { toMoney } = useCurrency();
const addProductItem = (id: string) => {
	cartStore.addProduct(id);
};
const toCheckout = () => {
	router.push({
		path: "/checkout",
		query: {
			productId: props.product.id,
		},
	});
};
const hasInFavorites = (id: string) => {
	return favoritesStore.hasProduct(id);
};
const addProductToFavorites = (id: string) => {
	favoritesStore.addProduct(id);
};

const hasInCart = computed(() => {
	console.log(items.value);
	return items.value.find((item) => item.id === props.product.id);
});
</script>

<template>
	<div
		class="fixed z-10 w-full left-0 bottom-4 px-4 lg:static lg:px-0"
		itemprop="offers"
		itemscope
		itemtype="http://schema.org/Offer"
	>
		<div
			class="bg-system-gray gap-2 lg:gap-4 rounded-[6.875rem] pl-6 pr-2 py-2 lg:pl-[3rem] lg:pr-[0.81rem] lg:py-[0.81rem] flex items-center"
		>
			<div class="flex flex-col">
				<span class="text-lg font-bold" itemprop="price"
					>{{ product.canNotBye ? "от " : ""
					}}{{ toMoney(product.price) }}</span
				>
				<span hidden itemprop="priceCurrency">RUB</span>
				<link
					v-if="product.count"
					itemprop="availability"
					href="http://schema.org/InStock"
				/>
				<span class="text-xs font-medium">без учета доставки</span>
			</div>
			<button
				@click="addProductToFavorites(product.id)"
				class="rounded-full ml-auto flex items-center justify-center border border-system-black-950 lg:w-[4rem] lg:h-[4rem] w-[3.25rem] h-[3.25rem]"
				type="button"
			>
				<svgo-heart
					class="text-2xl"
					filled
					:class="{
						'fill-white': hasInFavorites(product.id),
					}"
				/>
			</button>
			<button
				@click="toCheckout"
				v-if="product.count > 0 && !product.canNotBye"
				:disabled="product.count <= 0"
				class="px-[1.375rem] hidden rounded-full border border-system-black-950 lg:flex items-center justify-center h-[4rem]"
				type="button"
			>
				<span class="font-semibold">Покупка в 1 клик</span>
			</button>
			<button
				v-if="!product.canNotBye"
				:disabled="product.count <= 0"
				@click="addProductItem(product.id)"
				class="rounded-full lg:gap-[0.88rem] disabled:bg-system-gray-600 disabled:border-system-gray-600 disabled:cursor-not-allowed border border-system-black-950 bg-system-black-950 flex items-center justify-center lg:w-auto lg:h-[4rem] w-[3.25rem] h-[3.25rem] text-white lg:px-6"
				type="button"
			>
				<svgo-cart class="text-2xl" filled />
				<span class="hidden lg:block font-semibold text-white">
					{{
						product.count <= 0
							? "Товар распродан"
							: hasInCart
							? "В коризне"
							: "В корзину"
					}}</span
				>
			</button>
			<button
				type="button"
				@click="useEvent('open:product-form', product)"
				class="rounded-full lg:gap-[0.88rem] disabled:bg-system-gray-600 disabled:border-system-gray-600 disabled:cursor-not-allowed border border-system-black-950 bg-system-black-950 flex items-center justify-center lg:w-auto lg:h-[4rem] w-[3.25rem] h-[3.25rem] text-white lg:px-6"
			>
				<span class="hidden lg:block font-semibold text-white">
					Оформить заказ
				</span>
			</button>
		</div>
	</div>
</template>

<style scoped></style>
