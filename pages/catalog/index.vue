<script setup lang="ts">
import PageHeader from "../../components/page/Header.vue";
import { IBreadCrumb, ICategory } from "../../types/common";
import CatalogFilters from "../../components/catalog/CatalogFilters.vue";
import CatalogCategories from "../../components/catalog/CatalogCategories.vue";
import UiPagination from "../../components/ui/UiPagination.vue";
import {
	markRaw,
	computed,
	useAsyncData,
	useDirectusItems,
} from "~/.nuxt/imports";

const breadCrumbs = markRaw<IBreadCrumb[]>([
	{
		title: "Каталог",
		path: "/",
	},
]);

const { getItems } = useDirectusItems();

const { data: categories } = await useAsyncData<ICategory[]>(
	"fullCategories",
	() =>
		getItems<ICategory>({
			collection: "category",
			params: {
				fields: ["*", "image.*"],
			},
		}),
);

const mainCategories = computed(
	() => categories.value?.filter((item) => !item.parentId),
);
</script>

<template>
	<div class="flex-1">
		<PageHeader
			page-name="Каталог"
			:link="{
				title: 'Назад',
				path: 'back',
			}"
			:bread-crumbs="breadCrumbs"
		/>
		<main
			class="pt-[2.37rem] lg:pt-[4.62rem] lg:pb-[8.25rem] lg:px-[4.38rem] max-w-[111.25rem] lg:mx-auto px-4 pb-[6.88rem]"
		>
			<CatalogCategories :items="mainCategories" />
		</main>
	</div>
</template>

<style scoped></style>
