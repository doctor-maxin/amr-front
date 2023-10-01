<script setup lang="ts">
import ProductSlider from "../../components/catalog/product/ProductSlider.vue";
import ProductInfo from "../../components/catalog/product/ProductInfo.vue";
import ProductProjects from "../../components/catalog/product/ProductProjects.vue";
import ProductSeems from "../../components/catalog/product/ProductSeems.vue";
import {
	computed,
	useAsyncData,
	useDirectusItems,
	useRoute,
	ref,
	useNuxtData,
	useListen,
	useHead,
} from "../../.nuxt/imports";
import { IProductWithCategory, IVariant } from "../../types/product";
import { IBreadCrumb, ICategory } from "../../types/common";

const route = useRoute();
const handle = computed(() => route.params.handle);
const { getItems } = useDirectusItems();

const { data } = useAsyncData(() =>
	getItems<IProductWithCategory>({
		collection: "products",
		params: {
			filter: {
				handle: {
					_contains: handle.value,
				},
			},
			fields: [
				"*",
				"images.directus_files_id",
				"categoryId.handle",
				"categoryId.id",
				"variants.*",
				"optionsValues.optionValues_id.value",
				"optionsValues.optionValues_id.parentId.name",
			],
		},
	})
);
const product = computed<IProductWithCategory | null>(() =>
	data.value?.length ? data.value[0] : null
);
const { data: categories } = useNuxtData<ICategory[]>("categories");
const activeVariants = ref<IVariant | null>(null)

const breadCrumbs = computed<IBreadCrumb[]>(() => {
	const array = [
		{
			title: "Каталог",
			path: "/catalog",
		},
	];
	if (product.value) {
		const paths = product.value.categoryId.handle.split("/");
		for (const path of paths) {
			if (!path) continue;

			const category = categories.value.find((item) =>
				item.handle?.endsWith(path)
			);
			if (!category) continue;
			array.push({
				title: category.name,
				path: "/catalog" + category.handle,
			});
		}
	}
	return array;
});

useHead({
	title: product.value?.name ?? 'Детальная карточка товара'
})

useListen('select:variant', (variant: IVariant) => {
	activeVariants.value = variant;
})
</script>

<template>
	<div class="flex-1" itemscope itemtype="http://schema.org/Product">
		<div
			v-if="product"
			class="grid w-full pb-[2.38rem] lg:pb-[6.25rem] grid-cols-1 lg:grid-cols-[minmax(0,_1fr)_2fr] xl:grid-cols-[minmax(0,_1fr)_1.5fr] 2xl:grid-cols-[minmax(0,_1fr)_1fr]"
		>
			<ProductSlider :list="product.images" />
			<ProductInfo :bread-crumbs="breadCrumbs" :product="product" />
		</div>
		<div>
			<ProductProjects :product-id="product?.id" />
		</div>
		<div>
			<ProductSeems
				:product-id="product?.id"
				:category-id="product?.categoryId?.id"
			/>
		</div>
	</div>
</template>

<style scoped></style>
