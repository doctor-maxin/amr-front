<script lang="ts" setup>
import {
	nextTick,
	useFiltersHelpers,
	useListen,
	useNuxtData,
	useRoute,
} from "#imports";
import {
	computed,
	ref,
	useDirectusItems,
	useHead,
	watch,
	shallowRef,
} from "#imports";
import { IBreadCrumb, ICategory, IFilters } from "../../../types/common";
import PageHeader from "../../../components/page/Header.vue";
import CatalogCategories from "../../../components/catalog/CatalogCategories.vue";
import UiPagination from "../../../components/ui/UiPagination.vue";
import CatalogFilters from "../../../components/catalog/CatalogFilters.vue";
import CatalogProducts from "../../../components/catalog/CatalogProducts.vue";
import { IProduct, ICatalogProduct } from "../../../types/product";
import { useUrlSearchParams } from "@vueuse/core/index";
import UiSpinner from "~/components/ui/UiSpinner.vue";
import { IFilterPayload } from "../../../composables/useEventBus";
import fetchSeo from "~/composables/fetchSeo";

await fetchSeo()

const { getItems, getItemById } = useDirectusItems();
const { data: categories } = useNuxtData<ICategory[]>("categories");
const route = useRoute();
const isLoading = ref<boolean>(true);
const pageHandle = computed(() => `/${route.params.slug}/${route.params.handle}`);
const activeCategory = computed<ICategory | undefined>(() =>
	categories.value?.find((item) => item.handle?.endsWith(pageHandle.value))
);
useHead({
	title: activeCategory.value ? activeCategory.value.name : 'Каталог'
})

const filters = ref<IFilters["filters"]>([]);
const items = ref<ICategory[]>([]);
const { getFiltersFromQuery } = useFiltersHelpers();
const products = ref<ICatalogProduct[]>([]);
const params = useUrlSearchParams<{
	page: number;
	sort?: string;
	filters: string;
}>("history", {
	initialValue: {
		page: 1,
		filters: "",
		sort: "popular",
	},
});
const totalCount = ref(0);
const limit = shallowRef(15);

const reFetchData = async (withFilterCheck = true) => {
	if (!activeCategory.value) return;
	isLoading.value = true;

	let sort = "";
	if (params.sort === "popular") sort = "ordersCount";
	else if (params.sort === "date_created") sort = "date_created";
	else sort = params.sort;

	const filter = {
		categoryId: {
			_eq: activeCategory.value.id,
		},
	};
	const queryFilters = getFiltersFromQuery();
	if (withFilterCheck && queryFilters?.length) {
		filter["_and"] = [];

		for (const item of queryFilters) {
			filter["_and"].push({
				optionsValues: {
					optionValues_id: {
						id: {
							_in: item.values,
						},
					},
				},
			});
		}
	}
	if (activeCategory.value.childrens.length) {
		items.value = await getItems({
			collection: "category",
			params: {
				filter: {
					parentId: {
						_eq: activeCategory.value.id,
					},
				},
				fields: ["id", "handle", "name", "image.*", "filters"],
			},
		});
	} else {
		const result = await getItems<ICatalogProduct>({
			collection: "products",
			params: {
				filter,
				meta: "*",
				page: params.page,
				sort,
				limit: limit.value,
				fields: [
					"id",
					"handle",
					"name",
					"images.directus_files_id",
					"price",
					"canNotBye",
					"count",
					'variants.id',
					'variants.name',
					'variants.images.directus_files_id',
				],
			},
		});
		if (typeof result.meta?.filter_count !== "undefined")
			totalCount.value = result.meta.filter_count;
		if (Array.isArray(result.data)) {
			products.value = []
			for (const product of result.data) {
				if (product?.variants?.length) {
					for (const variant of product.variants)
						products.value.push({
							...product,
							name: variant.name,
							images: variant.images?.length ? variant.images : product.images,
							handle: product.handle + '?variantId=' + variant.id
						})
				} else {
					products.value.push(product)
				}
			}
		}
	}

	isLoading.value = false;
};

const getFilters = async () => {
	if (!activeCategory.value) return;
	const response = await getItemById<IFilters>({
		collection: "category",
		id: activeCategory.value?.id,
		params: {
			fields: [
				"filters.options_id.name",
				"filters.options_id.id",
				"filters.options_id.values.value",
				"filters.options_id.values.id",
			],
		},
	});
	filters.value = response.filters;
};

watch(
	activeCategory,
	() => {
		reFetchData();
		getFilters();
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

useListen("on-filter", (activeFilters: IFilterPayload[]) => {
	const query = new URLSearchParams();
	for (const item of activeFilters) {
		query.append(
			item.id,
			Array.isArray(item.values) ? item.values.join(",") : item.values
		);
	}
	params.filters = query.toString();
	nextTick(() => {
		reFetchData(true);
	});
});
useListen("reset-filters", () => {
	params.filters = "";
	reFetchData(false);
});
useListen("on-sort", (sort) => {
	params.sort = sort;
	reFetchData();
});
</script>

<template>
	<div class="flex-1">
		<PageHeader :bread-crumbs="breadCrumbs" :link="{
			title: 'Назад',
			path: 'back',
		}" :page-name="activeCategory?.name ?? ''" />
		<main
			class="pt-[2.37rem] lg:pt-[4.62rem] w-full lg:pb-[8.25rem] lg:px-[4.38rem] max-w-[120rem] lg:mx-auto px-4 pb-[6.88rem]">
			<template v-if="!isLoading && items.length">
				<CatalogCategories :items="items" />
			</template>
			<template v-else-if="!isLoading">
				<CatalogFilters v-if="totalCount" :items="filters" />
				<template v-if="products?.length">
					<CatalogProducts :items="products" />
					<UiPagination :page="+params.page" @onPage="params.page = $event" :total="totalCount" :limit="limit"
						class="mt-6" />
				</template>
				<h2 v-else class="text-2xl text-center text-system-gray-900 font-semibold text-opacity-40">
					В этой категории пока нет товаров
				</h2>
			</template>
			<UiSpinner v-else />
		</main>
	</div>
</template>

<style scoped></style>
