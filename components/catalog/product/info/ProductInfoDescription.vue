<script setup lang="ts">
import { useRouter } from "nuxt/app";
import { useDirectusItems, useAsyncData } from "../../../../.nuxt/imports";
import {IProduct} from "../../../../types/product";
import ProductInfoVariants from "./ProductInfoVariants.vue";

const props = defineProps<{
	product: IProduct;
}>()
const { getItems} = useDirectusItems()
const router = useRouter()

const {data: variants} = useAsyncData(() => getItems({
	collection: 'variants', 
	filter: {
		productId: {
			_in: [props.product.id]
		}
	},
	fields: ['*']
}))

const toCheckout = () => {
	router.push({
		path: "/checkout",
		query: {
			productId: props.product.id,
		},
	});
};
</script>

<template>
<div class="pt-[1.38rem] lg:pt-8 pb-[3.25rem]">
	<h1 itemprop="name" class="text-[1.375rem] lg:text-2xl text-system-black-950 font-semibold mb-3">{{product.name}}</h1>
	<p itemprop="description" class="font-medium text-system-black-950" v-html="product.description" />
	<ProductInfoVariants  :variants="variants" v-if="variants?.length && product.canNotBye" />
	<button
				@click="toCheckout"
				v-if="product.count > 0 && !product.canNotBye"
				:disabled="product.count <= 0"
				class="px-[1.375rem] mt-4 w-full  rounded-full border border-system-black-950 lg:hidden items-center justify-center h-[4rem]"
				type="button"
			>
				<span class="font-semibold">Покупка в 1 клик</span>
			</button>
</div>
</template>

<style scoped>

</style>