<template>
	<div
		class="lg:pt-[5.3125rem] pt-[3.875rem] page-layout relative flex flex-col min-h-screen"
	>
		<ClientOnly>
			<TheHeader />
		</ClientOnly>
		<NuxtLoadingIndicator>
			<CustomPageLoader />
		</NuxtLoadingIndicator>
		<NuxtPage />
		<TheFooter />
		<ToTopBtn />
		<MapLoader />
		<ProductForm />
	</div>
</template>
<script lang="ts" setup>
import TheHeader from "~/components/TheHeader.vue";
import TheFooter from "~/components/TheFooter.vue";
import ToTopBtn from "./components/common/ToTopBtn.vue";
import MapLoader from "./components/common/MapLoader.vue";
import ProductForm from "./components/forms/ProductForm.vue";
import { useCartStore } from "./store/cart.store";
import {
	useAsyncData,
	useDirectusAuth,
	useDirectusItems,
	useDirectusToken,
	useDirectusUser,
} from "./.nuxt/imports";
import { useFavoritesStore } from "./store/favorites.store";
import CustomPageLoader from "./components/common/CustomPageLoader.vue";

const { getItems, getSingletonItem } = useDirectusItems();
const cartStore = useCartStore();
const favoritesStore = useFavoritesStore();
const { refreshTokens, token, checkAutoRefresh } = useDirectusToken();
const user = useDirectusUser();

if (token.value) {
	await checkAutoRefresh();

	if (!user.value) token.value = "";
}

await Promise.all([
	cartStore.getCart(),
	favoritesStore.getList(),
	useAsyncData("categories", () =>
		getItems({
			collection: "category",
			params: {
				fields: ["id", "name", "childrens", "handle", "parentId"],
			},
		})
	),
	useAsyncData("settings", () =>
		getSingletonItem({
			collection: "settings",
		})
	),
	useAsyncData("customerPages", () =>
		getSingletonItem({
			collection: "customerPage",
			params: {
				fields: [
					"navBars.title",
					"navBars.id",
					"navBars.handle",
					"title",
				],
			},
		})
	),
]);
</script>
