<script lang="ts" setup>
import { IProduct, IVariant } from "../../../../types/product";

defineProps<{
	variant?: IVariant | null;
	product: IProduct;
}>()
</script>

<template>
	<div class="pt-[1.38rem] lg:pt-8 pb-[3.25rem]">
		<h1 class="text-[1.375rem] lg:text-2xl text-system-black-950 font-semibold mb-3" itemprop="name">
			{{ variant?.name ?
				variant.name : product.name }}</h1>
		<div class="flex max-w-[35.625rem] gap-2 lg:gap-3 flex-col">
			<template v-for="prop of product.optionsValues">
				<div class="flex justify-between text-system-black-950">
					<span class="font-medium ">
						{{ prop.optionValues_id.parentId.name }}
					</span>
					<span class="font-semibold text-right">
						{{ prop.optionValues_id.value }}
					</span>
				</div>
			</template>
		</div>
	</div>
</template>

<style scoped></style>