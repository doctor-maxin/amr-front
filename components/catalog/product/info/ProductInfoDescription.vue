<script setup lang="ts">
import {IProduct} from "../../../../types/product";
import ProductInfoVariants from "./ProductInfoVariants.vue";

const props = defineProps<{
	product: IProduct;
}>()

for (const prop in props.product) {
	console.log(prop)

}
</script>

<template>
<div class="pt-[1.38rem] lg:pt-8 pb-[3.25rem]">
	<h1 itemprop="name" class="text-[1.375rem] lg:text-2xl text-system-black-950 font-semibold mb-3">{{product.name}}</h1>
	<p itemprop="description" class="font-medium text-system-black-950" v-html="product.description" />
	<ProductInfoVariants :options="product.optionsValues" v-if="product.optionsValues.length" />
</div>
</template>

<style scoped>

</style>