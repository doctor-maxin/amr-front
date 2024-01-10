<script lang="ts" setup>
import UiButton from "~/components/ui/UiButton.vue";
import { useUrlSearchParams } from "@vueuse/core";
import { IProduct } from "~/types/product";
import { onMounted, ref, useDirectusItems, watch, useHead } from "../.nuxt/imports";
import { useFavoritesStore } from "~/store/favorites.store";
import { useCartStore } from "~/store/cart.store";
import fetchSeo from "~/composables/fetchSeo";

await fetchSeo()
const params = useUrlSearchParams<{
	search?: string;
}>("history");
const search = ref(params?.search?.toString() ?? "");
const { getItems } = useDirectusItems();
const isLoading = ref(false);
const list = ref<IProduct[]>([]);
const favoritesStore = useFavoritesStore();
const { toMoney } = useCurrency()
const cartStore = useCartStore();

useHead({
	title: 'Поиск'
})

watch(search, (val) => {
	params.search = val;
});

const searchProducts = async () => {
	try {
		isLoading.value = true;
		const _regex = search.value.replace(/[^a-zа-яё0-9\s]/gi, " ").trim()

		const items = await getItems<IProduct>({
			collection: "products",
			params: {
				filter: {
					_and: _regex.split(' ').map(word => ({
						name: {
							_icontains: word
						}
					})),
				},
				fields: [
					'id',
					"images.directus_files_id",
					"price",
					"handle",
					"name",
					"meta",
					'count',
					'canNotBye'
				],
				limit: 8,
				page: 1,
			},
		});
		list.value = items;
		params.search = String(search.value).trim().replace(/[^А-яЁё A-Za-z]/g, '')
	} catch (e: any) {
		console.error(e);
	}
	isLoading.value = false;
};
onMounted(() => {
	if (search.value) searchProducts();
});

const addProductToFavorites = (id: string) => {
	favoritesStore.addProduct(id);
};
const hasInFavorites = (id: string) => {
	return favoritesStore.hasProduct(id);
};
const addProductItem = (id: string) => {
	cartStore.addProduct(id);
};
</script>

<template>
	<main class="px-4 flex-1 pt-[2.375rem] lg:pt-[4.5rem] lg:px-0 lg:max-w-[73.5rem] mx-auto w-full pb-[6.8rem]">
		<form action="" class="relative flex items-center mb-[2.37rem] lg:mb-[5rem]" @submit.prevent="searchProducts">
			<input v-model="search"
				class="border transition-colors focus:outline-none hover:border-accent-300 focus:border-accent-300 appearance-none seaerch w-full border-black rounded-[2.38rem] pl-7 pr-[7rem] py-3.5 text-base font-semibold"
				placeholder="Поиск по запросу" type="search" />
			<UiButton type="submit" class="!py-3 !px-[1.7rem] max-h-11 absolute right-[0.31rem]" title="Поиск"
				title-class="text-[1rem] font-medium" variant="dark" />
		</form>
		<h2 v-if="list.length" class="hidden text-2xl lg:mb-[1.38rem] font-semibold lg:block">
			Товары:
		</h2>
		<template v-if="isLoading">
			<span class="text-2xl font-semibold">Загрузка...</span>
		</template>
		<template v-else>
			<div class="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-y-[1.38rem] lg:gap-x-[1.88rem]" v-if="list?.length">
				<template v-for="product of list" :key="product.id">
					<div
						class="w-full group/item p-[1.125rem] lg:p-[0.875rem] bg-system-gray-500 rounded-[1.25rem] grid grid-cols-[4.375rem_auto_1.5rem] items-center lg:grid-cols-[6.25rem_auto_1.5rem] gap-[1.31rem] lg:gap-[1.44rem]">
						<nuxt-link :to="`/catalog${product.handle ?? ''}`">
							<NuxtImg :src="product.images?.length
								? product.images[0].directus_files_id
								: '668abdf6-1ee7-42fe-a5a6-b5ce1f846586'
								" provider="directus" width="150" class="rounded-[0.635rem] lg:rounded-[1.25rem] aspect-square object-cover" />
						</nuxt-link>
						<div class="flex flex-col gap-[0.135rem]">
							<nuxt-link :to="`/catalog${product.handle ?? ''}`">
								<span class="font-semibold text-system-black-900 lg:text-2xl">{{ product.name
								}}</span></nuxt-link>
							<span class="font-semibold text-system-black-900 lg:text-2xl">{{ toMoney(product.price)
							}}</span>
						</div>
						<div
							class="flex flex-col h-full lg:group-hover/item:opacity-100 items-end transition-opacity lg:opacity-0  justify-between w-6 overflow-visible">
							<button @click.stop="addProductToFavorites(product.id)" type="button" class="group">
								<svgo-heart filled class="text-2xl group-hover:text-accent-300 transition-colors" :class="{
									'text-accent-300': hasInFavorites(product.id),
								}" />
							</button>
							<button v-if="!product.canNotBye" type="button" class="flex group gap-2 items-center" :class="{
								'hidden cursor-not-allowed lg:flex lg:text-gray-300': product.count <= 0,
							}" @click="addProductItem(product.id)" :disabled="product.count <= 0">
								<svgo-cart filled class="text-2xl group-hover:text-accent-300 transition-colors" />
								<span
									class="text-base group-hover:text-accent-300 transition-colors whitespace-nowrap font-semibold">В
									корзину</span>
							</button>
						</div>
					</div>
				</template>
			</div>
			<div v-else>
				<span class="text-2xl font-semibold">Ничего не найдено...</span>
			</div>
		</template>
	</main>
</template>

<style scoped></style>
