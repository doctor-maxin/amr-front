<script setup lang="ts">
import {
	ref,
	shallowRef,
	useDirectusItems,
	watchEffect,
} from "../../../.nuxt/imports";
import { Autoplay, Pagination } from "swiper/modules";
import ProductItem from "./ProductItem.vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import SwiperPagination from "../../common/SwiperPagination.vue";
import { IProductPicked } from "../../../types/product";

const props = defineProps<{
	categoryId?: string | string[] | undefined;
	productId?: string;
}>();

const products = ref<IProductPicked[]>([]);
const { getItems } = useDirectusItems();

watchEffect(async () => {
	if (props?.categoryId) {
		const result = await getItems<IProductPicked>({
			collection: "products",
			params: {
				filter: {
					categoryId: Array.isArray(props.categoryId) ? {
						_in: props.categoryId
					} : {
						_eq: props.categoryId,
					},
				},
				fields: [
					"name",
					"handle",
					"price",
					'canNotBye',
					"images.directus_files_id",
					"id",
					"count",
				],
			},
		});
		console.log('items', result)
		products.value = result.filter((item) => item.id !== props.productId);
	}
});

const breakpoints = shallowRef({
	320: {
		slidesPerView: 1,
		spaceBetween: 14,
	},
	768: {
		slidesPerView: 2,
		spaceBetween: 20,
	},
	1280: {
		slidesPerView: 3,
		spaceBetween: 20,
	},
});
const autoPlayOptions = shallowRef({
	delay: 7000,
	disableOnInteraction: false,
});

const progressCircle = ref(null);

const onAutoplayTimeLeft = (s, time, progress) => {
	if (progressCircle.value)
		progressCircle.value.style.setProperty("--progress", 1 - progress);
};


const paginationOptions = {
	el: ".swiper-pagination",
	clickable: true,
	renderBullet: function (index, className) {
		return `<span class="${className} autoplay-progress">
					<svg xmlns="http://www.w3.org/2000/svg"  class="origami" height="360" viewBox="0 0 24 24" width="360">
						<circle cx="13" cy="11" r="10"></circle>
					</svg>
				</span>`;
	},
};
</script>

<template>
	<section v-if="products.length" class="lg:mx-auto max-w-[111.25rem] px-4 lg:px-[4.37rem] product-project">
		<h4 class="mb-1 text-system-gray-900 font-bold text-xs">ТОВАРЫ</h4>
		<h3 class="text-system-black-900 text-[1.375rem] font-bold mb-7">
			Похожие товары
		</h3>
		<div class="pb-[6.25rem]">
			<Swiper :autoplay="autoPlayOptions" :breakpoints="breakpoints" :modules="[Pagination, Autoplay]"
				:pagination="paginationOptions" @autoplayTimeLeft="onAutoplayTimeLeft">
				<SwiperSlide v-for="item of products" class="relative rounded-[1.25rem] overflow-hidden !h-auto">
					<ProductItem :item="item" />
				</SwiperSlide>
				<template #container-end>
					<div ref="progressCircle">
						<SwiperPagination />
					</div>
				</template>
			</Swiper>
		</div>
	</section>
</template>

<style></style>
