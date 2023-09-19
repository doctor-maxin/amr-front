<script lang="ts" setup>
import {ref} from "../../../.nuxt/imports";
import BreadCrumbs from "../../common/BreadCrumbs.vue";
import {IBreadCrumb} from "../../../types/common";
import {IProduct} from "../../../types/product";
import ProductInfoDescription from "./info/ProductInfoDescription.vue";
import ProductInfoProperties from "./info/ProductInfoProperties.vue";
import ProductInfoActions from "./info/ProductInfoActions.vue";

const props = defineProps<{
	product: IProduct;
	breadCrumbs: IBreadCrumb[];
}>()

enum Tabs {
	DESC = 'description',
	PROPS = 'properties'
}

const activeTab = ref<Tabs>(Tabs.DESC)
</script>

<template>
	<div class="bg-system-gray-500 flex flex-col lg:pl-[1.87rem] lg:pr-[4.375rem] lg:pb-[4rem] lg:pt-[1.81rem] px-4 pt-[1.635rem] pb-[3.25rem]">
		<div class="flex justify-between max-w-[54rem] items-center">
			<div class="flex lg:rounded-[5rem] lg:w-fit gap-4 lg:bg-system-gray lg:gap-1 lg:p-[0.31rem]">
				<button :class="{
			'text-opacity-100 lg:bg-system-gray-600': activeTab === Tabs.DESC,
			'text-opacity-50': activeTab !== Tabs.DESC,
		}"
				        class="text-lg lg:rounded-[5rem] lg:text-base lg:text-opacity-100 lg:py-3 lg:px-[1.385rem] transition-colors lg:font-semibold font-bold text-system-gray-800 " type="button" @click="activeTab = Tabs.DESC">Описание
				</button>
				<button :class="{
			'text-opacity-100 lg:bg-system-gray-600': activeTab === Tabs.PROPS,
			'text-opacity-50': activeTab !== Tabs.PROPS,

		}"
				        class="text-lg lg:rounded-[5rem] lg:text-base lg:text-opacity-100 lg:py-3 lg:px-[1.385rem] transition-colors lg:font-semibold font-bold text-system-gray-800" type="button" @click="activeTab = Tabs.PROPS">Характеристики
				</button>
			</div>
			<BreadCrumbs class="!hidden lg:!flex" :list="breadCrumbs" />
		</div>
		<main class="flex flex-1 flex-col max-w-[54rem]">
			<ProductInfoDescription :product="product" v-if="activeTab === Tabs.DESC" />
			<ProductInfoProperties :product="product" v-else />
			<ProductInfoActions :product="product" class="mt-auto" />
		</main>
	</div>
</template>

<style scoped>

</style>