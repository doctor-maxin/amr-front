<script lang="ts" setup>
import BreadCrumbs from "../../common/BreadCrumbs.vue";
import { IBreadCrumb } from "../../../types/common";
import { IProduct, IVariant } from "../../../types/product";
import ProductInfoDescription from "./info/ProductInfoDescription.vue";
import ProductInfoProperties from "./info/ProductInfoProperties.vue";
import ProductInfoActions from "./info/ProductInfoActions.vue";
import UiButton from "~/components/ui/UiButton.vue";
import { Tabs, useProductStore } from "~/store/product.store";
import { storeToRefs } from "pinia";
import ProductInfoOptions from "~/components/catalog/product/info/ProductInfoOptions.vue";
import { Tooltip } from '@programic/vue3-tooltip';
import type { IProductConstructor, IMaterialItem } from '~/store/product.store'

const productStore = useProductStore()
const { activeTab } = storeToRefs(productStore)
const router = useRouter();

const props = defineProps<{
  product: IProduct;
  variant?: IVariant | null;
  breadCrumbs: IBreadCrumb[];
}>();
const { getItems } = useDirectusItems()
productStore.setProduct(props.product)

const toCheckout = () => {
  router.push({
    path: "/checkout",
    query: {
      productId: props.product.id,
    },
  });
};

watchEffect(async () => {
  const items = await getItems<IProductConstructor>({
    collection: 'productConstructor',
    params: {
      filter: {
        productId: props.product.id
      },
      fields: ['*', 'materials.productConstructorMaterials_id.*', 'materials.productConstructorMaterials_id.items.productConstructorMaterialItem_id.*']
    }
  })
  if (items?.length) {
    const materialItems: IMaterialItem[] = []

    for (const item of items[0].materials) {
      for (const material of item.productConstructorMaterials_id.items) {
        materialItems.push(material.productConstructorMaterialItem_id)
      }
    }

    productStore.setMaterialItems(materialItems)
    productStore.setData(items[0])
  }
})
</script>

<template>
  <div
    class="h-full bg-system-gray-500 flex flex-col lg:pl-[1.87rem] lg:pr-[4.375rem] lg:pb-[4rem] lg:pt-[1.81rem] px-4 pt-[1.635rem] pb-[3.25rem]">
    <div class="flex justify-between max-w-[54rem] gap-2 lg:gap-4 items-center flex-wrap">
      <div class="flex lg:rounded-[5rem] lg:w-fit gap-4 lg:bg-system-gray lg:gap-1 lg:p-[0.31rem]">
        <button :class="{
          'text-opacity-100 lg:bg-system-gray-600':
            activeTab === Tabs.DESC,
          'text-opacity-50': activeTab !== Tabs.DESC,
        }"
          class="text-lg lg:rounded-[5rem] lg:text-base lg:text-opacity-100 lg:py-3 lg:px-[1.385rem] transition-colors lg:font-semibold font-bold text-system-gray-800"
          type="button" @click="productStore.setTab(Tabs.DESC)">
          Описание
        </button>
        <button :class="{
          'text-opacity-100 lg:bg-system-gray-600':
            activeTab === Tabs.PROPS,
          'text-opacity-50': activeTab !== Tabs.PROPS,
        }"
          class="text-lg lg:rounded-[5rem] lg:text-base lg:text-opacity-100 lg:py-3 lg:px-[1.385rem] transition-colors lg:font-semibold font-bold text-system-gray-800"
          type="button" @click="productStore.setTab(Tabs.PROPS)">
          Характеристики
        </button>
      </div>
      <ClientOnly>
        <Tooltip placement="bottom" title="Выберите материал под себя">
          <button v-if="product.have3D" :class="{
            'border-black': activeTab === Tabs.CONST
          }" class="hidden lg:flex rounded-[5rem] border mr-auto gap-3 bg-system-gray py-3.5 px-5 items-center"
            type="button" @click="productStore.setTab(Tabs.CONST)">
            <svgo-const class="text-2xl" filled />
            <span class="text-system-black-950 text-base font-semibold">Конструктор</span>
          </button>
        </Tooltip>
      </ClientOnly>
      <BreadCrumbs :list="breadCrumbs" class="!hidden lg:!flex" />
    </div>
    <main class="flex flex-1 flex-col max-w-[54rem]">
      <ProductInfoDescription v-if="activeTab === Tabs.DESC" :product="product" :variant="variant" />
      <ProductInfoProperties v-else-if="activeTab === Tabs.PROPS" :product="product" :variant="variant" />
      <ProductInfoOptions v-if="activeTab === Tabs.CONST" :product="product" :variant="variant" />
      <div class="lg:hidden flex flex-col gap-4">
        <button v-if="product.have3D && activeTab !== Tabs.CONST"
          class="flex gap-3 w-full lg:hidden px-[1.44rem] py-[1.195rem] rounded-[5rem] bg-system-gray items-center"
          @click="productStore.setTab(Tabs.CONST)">
          <svgo-const class="text-[1.875rem]" filled />
          <span class="text-lg font-bold text-system-black-950">Конструктор</span>
        </button>
        <button v-if="product.have3D && activeTab === Tabs.CONST"
          class="flex gap-3 w-full lg:hidden px-[1.44rem] py-[1.195rem] rounded-[5rem] bg-system-gray items-center"
          @click="productStore.setTab(Tabs.DESC)">
          <svgo-close-arrow class="text-[1.875rem]" filled />
          <span class="text-lg font-bold text-system-black-950">Закрыть конструктор</span>
        </button>
        <UiButton @click="toCheckout" v-if="product.count > 0 && !product.canNotBye" class="w-full h-[3.25rem]"
          title="Покупка в 1 клик" title-class="text-center block mx-auto" type="button" />
      </div>
      <ProductInfoOptions v-if="activeTab === Tabs.CONST" :product="product" :variant="variant" show-variants />
      <ProductInfoActions :product="product" class="mt-auto" />
    </main>
  </div>
</template>

<style scoped></style>
