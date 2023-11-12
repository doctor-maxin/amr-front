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
const { getParentId, getCategoryChildIds } = useCategoriesHelper()

const { data } = await useAsyncData(() =>
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
				"variants.images.directus_files_id",
				"optionsValues.optionValues_id.value",
				"optionsValues.optionValues_id.parentId.name",
			],
		},
	}),
);
const product = computed<IProductWithCategory | null>(() =>
	data.value?.length ? data.value[0] : null,
);
const { data: categories } = useNuxtData<ICategory[]>("categories");
const activeVariants = ref<IVariant | null>(null);

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

			const category = categories.value.find(
				(item) => item.handle?.endsWith(path),
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
	title: product.value?.name ?? "Детальная карточка товара",
});

useListen("select:variant", (variant: IVariant) => {
	activeVariants.value = variant;

	useHead({
		title: variant.name,
	});
});

const productImages = computed(() => {
	if (activeVariants.value?.images?.length) {
		return activeVariants.value.images;
	}
	return product.value?.images ? product.value.images : [];
});

const productSeemsCategegoryId = computed(() => {
	if (!product.value) return ''
	console.log('product.value.canNotBye', product.value.categoryId)
	if (product.value.canNotBye && product.value.categoryId) {
		const parentId = getParentId(product.value.categoryId?.id)
		if (parentId) {
			const ids = getCategoryChildIds(parentId)
			return ids;
		}
	}
	return product.value.categoryId?.id
})
</script>

<template>
	<div class="flex-1" itemscope itemtype="http://schema.org/Product">
		<div v-if="product" class="grid w-full pb-[2.38rem] lg:pb-[6.25rem] grid-cols-1 lg:grid-cols-2">
			<ProductSlider :list="productImages" />
			<ProductInfo :variant="activeVariants" :bread-crumbs="breadCrumbs" :product="product" />
		</div>
		<div>
			<ProductProjects :product-id="product?.id" />
		</div>
		<div>
			<ProductSeems :product-id="product?.id" :category-id="productSeemsCategegoryId" />
		</div>
	</div>
</template>

<style scoped></style>
