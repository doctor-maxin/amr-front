<script setup lang="ts">
import { useRouter } from "nuxt/app";
import { IProduct, IVariant } from "../../../../types/product";
import ProductInfoVariants from "./ProductInfoVariants.vue";

const props = defineProps<{
	variant?: IVariant | null;
	product: IProduct;
}>()
const router = useRouter()

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
		<h1 itemprop="name" class="text-[1.375rem] lg:text-2xl text-system-black-950 font-semibold mb-3">{{ variant?.name ?
			variant.name : product.name }}</h1>
		<p itemprop="description" class="font-medium text-system-black-950" v-html="product.description" />
		<ProductInfoVariants :variants="product.variants" v-if="product.variants?.length && product.canNotBye" />
	</div>
</template>

<style scoped></style>