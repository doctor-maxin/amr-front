<template>
	<div class="lg:pt-[5.3125rem] pt-[3.875rem] page-layout relative flex flex-col min-h-screen">
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
		<FeedBackModal />
	</div>
</template>
<script lang="ts" setup>
import TheHeader from "~/components/TheHeader.vue";
import TheFooter from "~/components/TheFooter.vue";
import ToTopBtn from "./components/common/ToTopBtn.vue";
import MapLoader from "./components/common/MapLoader.vue";
import ProductForm from "./components/forms/ProductForm.vue";
import FeedBackModal from "./components/common/FeedBackModal.vue";
import { useCartStore } from "./store/cart.store";
import {
	useAsyncData,
	useDirectusItems,
	useDirectusToken,
	useHead,
} from "./.nuxt/imports";
import { useFavoritesStore } from "./store/favorites.store";
import CustomPageLoader from "./components/common/CustomPageLoader.vue";

const { getItems, getSingletonItem } = useDirectusItems();
const cartStore = useCartStore();
const favoritesStore = useFavoritesStore();


onMounted(async () => {
	const { refreshTokens, token, checkAutoRefresh, token_expires_in } =
		useDirectusToken();

	console.log("Token", token.value, token_expires_in.value);
	if (token.value) {
		await checkAutoRefresh();

		if (token_expires_in.value === 0) await refreshTokens();
	}
})

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
	useAsyncData("tags", () =>
		getItems({
			collection: "blogTags",
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

useHead({
	script: [
		{
			innerHTML: `
 		(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
    m[i].l=1*new Date();
    for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
    k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
    (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

    ym(95336171, "init", {
         clickmap:true,
         trackLinks:true,
         accurateTrackBounce:true,
         webvisor:true,
         ecommerce:"dataLayer"
    });
    `,
		},
		{
			innerHTML: `
			(function(w,d,u){
                var s=d.createElement('script');s.async=true;s.src=u+'?'+(Date.now()/60000|0);
                var h=d.getElementsByTagName('script')[0];h.parentNode.insertBefore(s,h);
        })(window,document,'https://cdn-ru.bitrix24.ru/b12239668/crm/site_button/loader_5_6to2pi.js');`
		}, {
			"data-b24-form": "inline/15/88rt9c",
			"data-skip-moving": true,
			innerHTML: `
			(function(w,d,u){
			var s=d.createElement('script');s.async=true;s.src=u+'?'+(Date.now()/180000|0);
			var h=d.getElementsByTagName('script')[0];h.parentNode.insertBefore(s,h);
			})(window,document,'https://cdn-ru.bitrix24.ru/b12239668/crm/form/loader_15.js');
`
		}
	],
	noscript: [
		{
			innerHTML: `<div><img src="https://mc.yandex.ru/watch/95336171" style="position:absolute; left:-9999px;" alt="" /></div>`,
		},
	],
});
</script>
