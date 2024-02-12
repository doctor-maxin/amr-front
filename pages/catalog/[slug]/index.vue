<script setup lang="ts">
import PageHeader from "~/components/page/Header.vue";
import {
	computed,
	IFilterPayload,
	nextTick,
	ref,
	useDirectusItems,
	useFiltersHelpers,
	useListen,
	watch
} from "#imports";
import { IBreadCrumb, ICategory, IFilters } from "~/types/common";
import CatalogCategories from "~/components/catalog/CatalogCategories.vue";
import { useUrlSearchParams } from "@vueuse/core/index";
import CatalogFilters from "~/components/catalog/CatalogFilters.vue";
import UiSpinner from "~/components/ui/UiSpinner.vue";


const route = useRoute()
const isLoading = ref<boolean>(true);
const { getItems, getItemById } = useDirectusItems();
const {data: categories} = useNuxtData<ICategory[]>('categories')
const activeCategory = computed(() =>
	categories.value?.find(item => item.handle === '/' + route.params.slug) || null
)
const { getFiltersFromQuery } = useFiltersHelpers();

const filters = ref<IFilters["filters"]>([]);
const items = ref<ICategory[]>([]);
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

const breadCrumbs = computed<IBreadCrumb[]>(() => {
	const array = [
		{
			title: "Каталог",
			path: "/catalog",
		},
	];
	if (!activeCategory.value) return array;
	array.push({
		title: activeCategory.value.name,
		path: activeCategory.value.handle
	})
	return array
})

const reFetchData = async () => {
	if (!activeCategory.value) return;
	isLoading.value = true;

	if (!activeCategory.value.childrens.length) return;
	let sort = "";
	if (params.sort === "popular") sort = "ordersCount";
	else if (params.sort === "date_created") sort = "date_created";
	else sort = params.sort ?? '';
	const queryFilters = getFiltersFromQuery();

	const list = await getItems<ICategory>({
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
	console.log('queryFilters', queryFilters)

	if (queryFilters?.length) {
		items.value = []
		const filter = {
			_or: [],
			categoryId: {
				_eq: ''
			}
		};
		for (const item of queryFilters) {
			//@ts-ignore
			filter["_or"].push({
				optionsValues: {
					optionValues_id: {
						id: {
							_in: item.values,
						},
					},
				},
			});
		}

		for (const item of list) {
			filter.categoryId._eq = item.id
			const categoryItems = await getItems({
				collection: 'products',
				params: {
					filter,
					fields: ['id']
				}
			})
			if (categoryItems.length) items.value.push(item)
		}
	} else {
		items.value = list
	}

	isLoading.value = false;
}

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


useListen("on-filter", (activeFilters: IFilterPayload[]) => {
	const query = new URLSearchParams();
	for (const item of activeFilters) {
		query.append(
			item.id,
			Array.isArray(item.values) ? item.values.join(",") : item.values
		);
	}
	params.filters = query.toString();
	console.log("[on-filter] fire");
	nextTick(reFetchData);
});
useListen("reset-filters", () => {
	params.filters = "";
	console.log("[reset-filters] fire");
	nextTick(reFetchData)
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
			<template v-if="!isLoading ">
				<CatalogFilters hide-sort :items="filters" />
			</template>
			<template v-if="!isLoading && !items.length">
				<h2 class="text-2xl text-center text-system-gray-900 font-semibold text-opacity-40">
					Категории не найдены
				</h2>
			</template>

			<UiSpinner v-if="isLoading" />
		</main>
	</div>
</template>

<style scoped>

</style>