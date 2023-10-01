<script lang="ts" setup>
import {IBreadCrumb, ICustomerPage, ICustomerPages} from "../types/common";
import HeaderPage from '../components/page/Header.vue'
import {Swiper, SwiperSlide} from "swiper/vue";
import 'swiper/css';
import {computed, ref, useAsyncData, useDirectusItems, useRoute, useRouter, useHead} from "../.nuxt/imports";

const {getSingletonItem} = useDirectusItems()

const {data: pages} = await useAsyncData<ICustomerPages>('customerPages', () => getSingletonItem({
	collection: 'customerPage',
	params: {
		fields: ['navBars.title', 'navBars.id', 'navBars.handle', 'title']
	}
}))
const router = useRouter();
const route = useRoute();
console.log(pages.value)
const activePage = computed<ICustomerPage | null>(() => {
	if (pages.value?.navBars) {
		return pages.value.navBars?.find((item: any) => item.handle === route.path) ?? pages.value.navBars[0]
	}
	return null
})
const breadCrumbs = computed<IBreadCrumb[]>( () => [{
	path: '/pages',
	title: pages.value?.title ?? ''
}, {
	path: activePage.value?.handle,
	title: activePage.value?.title
}])

useHead({
  title: activePage.value?.title ?? ''
})

const swiper = ref<any>(null);

const setSwiper = (sw: any) => {
	swiper.value = sw
}
const slideTo = (item: ICustomerPage, index: number) => {
	if (swiper.value) swiper.value.slideTo(index)
	router.push(item.handle)
}
</script>

<template>
	<div class="flex-1">
		<HeaderPage :bread-crumbs="breadCrumbs" :page-name="pages?.title ?? ''"/>
		<main class="py-10 mx-auto lg:py-[6.25rem] px-4 lg:px-0 lg:max-w-[73.5rem]">
			<ClientOnly>
				<Swiper class="tabs" slides-per-view="auto" @swiper="setSwiper">
					<SwiperSlide v-for="(item, index) in pages?.navBars" :key="item.id"
					             class="!w-fit"
					>
						<button
							class="tab"
							:class="{
							'active': activePage?.id === item.id
							}"
							@click="slideTo(item, pages)"
						>
							{{ item.title }}
						</button>
					</SwiperSlide>
				</Swiper>
			</ClientOnly>
			<nuxt-page v-if="activePage" :id="activePage?.id" />
		</main>
	</div>
</template>

<style lang="scss" scoped>
@import "swiper/css/free-mode";

.tabs {
	@apply sticky bg-white top-[3.875rem] lg:top-[6.3125rem] lg:bg-system-gray lg:p-[0.315rem] w-screen lg:w-fit -mx-4 lg:mx-auto lg:rounded-[5rem] lg:max-w-full overflow-hidden;

	.tab {
		@apply px-3 lg:px-[1.38rem] py-[0.62rem] lg:text-opacity-100 text-opacity-50 rounded-[5rem] text-system-black-900 font-semibold;
		&.active {
			@apply lg:bg-system-gray-600 text-opacity-100;
		}
	}
}
</style>