<script lang="ts" setup>
import {ref, shallowRef, useAppConfig, useDirectusItems, watchEffect} from "../../../.nuxt/imports";
import {IIdeaItem} from "../../../types/ideas";
import {Swiper, SwiperSlide} from 'swiper/vue'
import {Autoplay, Pagination} from "swiper/modules";
import SwiperPagination from "../../common/SwiperPagination.vue";

const props = defineProps<{
	productId: string;
}>()

const {getItems} = useDirectusItems()
const appConfig = useAppConfig()


const projects = ref<Pick<IIdeaItem, 'image' | 'name' | 'handle' | 'id'>[]>([])

watchEffect(async () => {
	if (props.productId) {
		projects.value = await getItems<Pick<IIdeaItem, 'image' | 'name' | 'handle' | 'id'>>({
			collection: 'projects',
			params: {
				fields: ['handle', 'name', 'image', 'id'],
				limit: 3,
				filter: {
					products: {
						products_id: {
							_in: [props.productId]
						}
					}
				}
			}
		})
	}
})

const getItemImage = (image: string): string => {
	if (image) return image
	return appConfig.noImageId as string;
}

const paginationOptions = shallowRef({
	el: '.swiper-pagination',
	clickable: true,
})
const autoPlayOptions = shallowRef({
	delay: 7000
})
const breakpoints = shallowRef({
	320: {
		slidesPerView: 1,
		spaceBetween: 14
	},
	768: {
		slidesPerView: 2,
		spaceBetween: 20
	},
	1280: {
		slidesPerView: 3,
		spaceBetween: 20
	}
})
</script>

<template>
	<section v-if="productId && projects.length" class="lg:mx-auto max-w-[111.25rem]  px-4 lg:px-[4.37rem] product-project">
		<h4 class="mb-1 text-system-gray-900 font-bold text-xs">ПРОЕКТЫ</h4>
		<h3 class="text-system-black-900 text-[1.375rem] font-bold mb-7">Даный товар в проектах</h3>
		<div class="pb-[6.8rem]">
			<Swiper :autoplay="autoPlayOptions" :breakpoints="breakpoints" :modules="[Pagination, Autoplay]" :pagination="paginationOptions">
				<SwiperSlide v-for="item of projects" class="relative rounded-[1.25rem] overflow-hidden !h-auto">
					<NuxtImg :src="getItemImage(item.image)" class="w-full h-full" provider="directus"/>
					<div class="absolute bottom-3 lg:bottom-5 px-3 lg:px-5 w-full">
						<nuxt-link
							:to="`/blog/${item.handle}`"
							class="backdrop-blur-[50px] bg-system-black-600 py-5 rounded-[1.25rem] w-full flex items-center px-[1.12rem] lg:px-[1.62rem] justify-between">
							<span class="text-white">{{ item.name }}</span>
							<div class="flex gap-1 items-center">
								<span class="lg:block hidden text-white font-semibold">Посмотреть проект</span>
							<svgo-arrow-top-right class="text-2xl text-white" filled/>
							</div>
						</nuxt-link>
					</div>
				</SwiperSlide>
				<template #container-end>
                  <SwiperPagination />
				</template>
			</Swiper>

		</div>
	</section>
</template>

<style lang="scss">
</style>