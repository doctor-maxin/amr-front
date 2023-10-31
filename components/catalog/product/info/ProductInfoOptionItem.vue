<script setup lang="ts">
import {useProductStore} from "~/store/product.store";

const props = defineProps<{
  id: number;
  materialId: number;
  material: IProductMaterial;
}>()

const productStore = useProductStore()
const item = computed(() =>  productStore.getMaterialItem(props.id))
const {toMoney} = useCurrency()
</script>

<template>
<div v-if="item && productStore.data" class="flex flex-col gap-3" >
  <button
      @click="productStore.selectOption(materialId, id)"
      class="rounded-[1.125rem] transition-colors overflow-hidden outline-accent-300 outline-offset-[-3px]" :class="{
    'outline': material.selectedValue === id,
    'outline-0': material.selectedValue !== id,
  }">
  <NuxtImg provider="directus" :src="item.image" width="160" height="160" fit="cover" format="webp" loading="lazy" placeholder class=" w-[5.1875rem] h-[5.1875rem] aspect-square lg:h-[10rem] lg:w-[10rem] "  />
  </button>
  <span class="flex items-start flex-col gap-1">
    <span class="hidden lg:block text-base font-medium">{{item.name}}</span>
    <span class="text-base lg:text-sm font-semibold">{{toMoney(item.price)}}</span>
  </span>
</div>
</template>

<style scoped>

</style>