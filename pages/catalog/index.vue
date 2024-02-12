<script setup lang="ts">

import PageHeader from "~/components/page/Header.vue";
import CatalogCategories from "~/components/catalog/CatalogCategories.vue";
import { IBreadCrumb, ICategory } from "~/types/common";

const {getItems} = useDirectusItems()
const items = await getItems<ICategory>({
	collection: "category",
	params: {
		filter: {
			parentId: {
				_null: true,
			},
		},
		fields: ["id", "handle", "name", "image.*", "filters"],
	},
});
const breadCrumbs = markRaw<IBreadCrumb[]>([{
	path: '/catalog',
	title: 'Каталог'
}])
</script>

<template>
	<div class="flex-1">
		<PageHeader :bread-crumbs="breadCrumbs" :link="{
			title: 'Назад',
			path: 'back',
		}" page-name="Каталог" />
		<main
			class="pt-[2.37rem] lg:pt-[4.62rem] w-full lg:pb-[8.25rem] lg:px-[4.38rem] max-w-[120rem] lg:mx-auto px-4 pb-[6.88rem]">
			<CatalogCategories :items="items" />
		</main>
	</div>
</template>

<style scoped>

</style>