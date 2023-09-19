<script lang="ts" setup>
import PageHeader from '~/components/page/Header.vue'
import {markRaw, ref, useAppConfig, useDirectusItems, watchEffect} from "../.nuxt/imports";
import {IBreadCrumb} from "../types/common";
import {useFavoritesStore} from "../store/favorites.store";
import {storeToRefs} from "pinia";
import {IProductPicked} from "../types/product";
import UiSpinner from "../components/ui/UiSpinner.vue";
import ProductItem from "../components/catalog/product/ProductItem.vue";
import {useUrlSearchParams} from "@vueuse/core/index";
import UiPagination from "../components/ui/UiPagination.vue";

const breadCrumbs = markRaw<IBreadCrumb[]>([{
	title: 'Главная',
	path: '/'
}, {
	title: 'Избранное',
	path: '/favorites'
}])
const favoritesStore = useFavoritesStore()
const {items} = storeToRefs(favoritesStore)
const {getItems} = useDirectusItems()
const appConfig = useAppConfig()
const params = useUrlSearchParams('history', {
	initialValue: {
		page: 1
	}
})
const products = ref<IProductPicked[]>([])
const totalCount = ref<number>(0)
const isLoading = ref<boolean>(false)

watchEffect(async () => {
	if (items.value.length) {
		isLoading.value = true;
		const response = await getItems<IProductPicked>({
			collection: 'products',
			params: {
				filter: {
					id: {
						_in: items.value
					}
				},
				meta: 'filter_count',
				limit: 9,
				page: params.page,
				fields: ['id', 'handle', 'name', 'price', 'images.directus_files_id']
			}
		})
		if (response?.meta?.filter_count) totalCount.value = response.meta.filter_count
		if (response.data) products.value = response.data
		isLoading.value = false;
	}
})
</script>

<template>
	<main class="flex-1">
		<PageHeader :bread-crumbs="breadCrumbs" page-name="Избранное"/>
		<div class="pt-[2.375rem] px-4 pb-[6.88rem] lg:pb-[8.75rem] lg:pt-[4.63rem]">
			<template v-if="isLoading">
				<UiSpinner/>
			</template>
			<template v-else>
				<template v-if="products.length">
					<div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-[1.875rem]">
						<template v-for="item of products">
							<ProductItem :item="item"/>
						</template>
					</div>
					<UiPagination :limit="9" :page="+params.page" :total="totalCount" class="mt-6"
					              @onPage="params.page = $event"/>
				</template>
				<div v-else
				     class="mt-[1rem] text-center mx-auto lg:text-2xl font-semibold lg:mt-[2.5rem] text-system-black-900 text-opacity-40">
					{{ appConfig.favorites.emptyList }}
				</div>
			</template>
		</div>
	</main>
</template>

<style scoped>

</style>