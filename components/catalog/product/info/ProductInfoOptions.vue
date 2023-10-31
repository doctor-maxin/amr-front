<script setup lang="ts">
import {IProduct, IVariant} from "~/types/product";
import {useProductStore} from "~/store/product.store";
import ProductInfoOptionItem from "~/components/catalog/product/info/ProductInfoOptionItem.vue";

const props = defineProps<{
  variant?: IVariant | null;
  product: IProduct;
  showVariants?: boolean;
}>()
const productStore = useProductStore()

</script>

<template>
  <div class="pt-[1.38rem] lg:pt-8 pb-[3.25rem]" v-if="!showVariants">
    <h1 itemprop="name" class="text-[1.375rem] lg:text-2xl text-system-black-950 font-semibold mb-3">{{ variant?.name ?
        variant.name : product.name }}</h1>
    <transition name="fade">
    <div v-if="!productStore.isLoading && productStore.data">
      <p itemprop="description" class="font-medium text-system-black-950" v-text="productStore.data?.description" />

    </div>
    </transition>
  </div>
  <div v-else>
    <transition name="fade">
      <div v-if="!productStore.isLoading && productStore.data" class="py-12 flex flex-col gap-16 lg:gap-14 lg:pb-8 lg:pt-0 lg:-mt-5 max-w-full">
      <div v-for="item in productStore.data.materials">
        <div class="text-lg font-semibold mb-[1.38rem]">{{item.productConstructorMaterials_id.name}}</div>
        <div class="flex gap-4 p-1 overflow-x-auto snap-mandatory snap-x snap-start">
          <ProductInfoOptionItem v-for="id of item.productConstructorMaterials_id.items" :material="item.productConstructorMaterials_id" :material-id="item.productConstructorMaterials_id.id" :key="id" :id="id" />
        </div>
      </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>

</style>