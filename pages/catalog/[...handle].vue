<script lang="ts" setup>
import { useNuxtData, useRoute } from "~/.nuxt/imports";
import {
	computed,
	ref,
	useDirectusItems,
	watchEffect,
	watch,
	shallowRef,
} from "~/.nuxt/imports";
import { IBreadCrumb, ICategory } from "../../types/common";
import PageHeader from "../../components/page/Header.vue";
import CatalogCategories from "../../components/catalog/CatalogCategories.vue";
import UiPagination from "../../components/ui/UiPagination.vue";
import CatalogFilters from "../../components/catalog/CatalogFilters.vue";
import CatalogProducts from "../../components/catalog/CatalogProducts.vue";
import { IProduct } from "../../types/product";
import { useUrlSearchParams } from "@vueuse/core/index";
import UiSpinner from "~/components/ui/UiSpinner.vue";

const { getItems } = useDirectusItems();
const { data: categories } = useNuxtData<ICategory[]>("categories");
const route = useRoute();
const isLoading = ref<boolean>(true);
const pageHandle = computed(() =>
	Array.isArray(route.params.handle)
		? "/" + route.params.handle.join("/")
		: route.params.handle
);
const activeCategory = computed<ICategory | undefined>(() =>
	categories.value?.find((item) => item.handle.endsWith(pageHandle.value))
);
const items = ref<ICategory[]>([]);
const products = ref<IProduct[]>([]);
const params = useUrlSearchParams("history", {
	initialValue: {
		page: 1,
	},
});
const totalCount = ref(0);
const limit = shallowRef(15);

watch(
	() => route,
	() => {
		console.log(route.query);
	},
	{
		deep: true,
		immediate: true,
	}
);
const reFetchData = async () => {
	if (!activeCategory.value) return;
	isLoading.value = true;
	if (activeCategory.value.childrens.length) {
		items.value = await getItems({
			collection: "category",
			params: {
				filter: {
					parentId: {
						_eq: activeCategory.value.id,
					},
				},
				fields: ["id", "handle", "name", "image.*"],
			},
		});
	} else {
		const result = await getItems<IProduct>({
			collection: "products",
			params: {
				filter: {
					categoryId: {
						_eq: activeCategory.value.id,
					},
				},
				meta: "filter_count",
				page: params.page,
				limit: limit.value,
				fields: [
					"id",
					"handle",
					"name",
					"images.directus_files_id",
					"price",
					"count",
				],
			},
		});
		if (result.meta?.filter_count)
			totalCount.value = result.meta.filter_count;
		if (result.data?.length) products.value = result.data;
	}

	isLoading.value = false;
};

watch(
	activeCategory,
	() => {
		reFetchData();
	},
	{
		deep: true,
		immediate: true,
	}
);

watch(
	() => params.page,
	() => {
		reFetchData();
	}
);

const breadCrumbs = computed<IBreadCrumb[]>(() => {
	const array = [
		{
			title: "Каталог",
			path: "/catalog",
		},
	];
	if (activeCategory.value) {
		const paths = activeCategory.value.handle.split("/");
		for (const path of paths) {
			if (!path) continue;

			const category = categories.value.find((item) =>
				item.handle.endsWith(path)
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
</script>

<template>
	<div class="flex-1">
		<PageHeader
			:bread-crumbs="breadCrumbs"
			:link="{
				title: 'Назад',
				path: 'back',
			}"
			:page-name="activeCategory?.name ?? ''"
		/>
		<main
			class="pt-[2.37rem] lg:pt-[4.62rem] w-full lg:pb-[8.25rem] lg:px-[4.38rem] max-w-[120rem] lg:mx-auto px-4 pb-[6.88rem]"
		>
			<template v-if="!isLoading && items.length">
				<CatalogCategories :items="items" />
			</template>
			<template v-else-if="!isLoading">
				<CatalogFilters />
				<CatalogProducts :items="products" />
				<UiPagination
					:page="+params.page"
					@onPage="params.page = $event"
					:total="totalCount"
					:limit="limit"
					class="mt-6"
				/>
			</template>
			<UiSpinner v-else />
		</main>
	</div>
</template>

<style scoped></style>
