<script setup lang="ts">
import {
	useProductStore,
	type IMaterialItem,
	type IProductMaterial,
} from "~/store/product.store";

defineProps<{
	materialGroup: IProductMaterial;
	material: IMaterialItem;
}>();

const productStore = useProductStore();
const { toMoney } = useCurrency();
</script>

<template>
	<div class="flex flex-col gap-3">
		<button @click="productStore.selectOption(materialGroup.id, material.id)"
			class="rounded-[1.125rem] transition-colors overflow-hidden outline-accent-300 outline-offset-[-3px]" :class="{
				outline: materialGroup.selectedValue === material.id,
				'outline-0': materialGroup.selectedValue !== material.id,
			}">
			<NuxtImg provider="directus" :src="material.image" width="160" height="160" format="webp" loading="lazy"
				placeholder class="w-[5.1875rem] h-[5.1875rem] aspect-square  lg:h-[10rem] lg:w-[10rem]" />
		</button>
		<span class="flex items-start flex-col gap-1">
			<span class="hidden lg:block text-base font-medium">{{
				material.name
			}}</span>
			<span v-if="material.price" class="text-base lg:text-sm font-semibold">{{ toMoney(material.price) }}</span>
		</span>
	</div>
</template>

<style scoped></style>
