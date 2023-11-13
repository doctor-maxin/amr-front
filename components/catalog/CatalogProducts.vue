<script lang="ts" setup>
import {IProductPicked} from "../../types/product";
import ProductItem from "./product/ProductItem.vue";


defineProps<{
	items: IProductPicked[]
}>()
</script>

<template>
	<div v-if="items.length" class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-7">
		<template v-for="item of items" :key="item.id">
			<ProductItem :item="item"/>
		</template>
	</div>
</template>

<style scoped>

</style>