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
	categoryId?: string;
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
					categoryId: {
						_eq: props.categoryId,
					},
				},
				fields: [
					"name",
					"handle",
					"price",
					"images.directus_files_id",
					"id",
					"count",
				],
			},
		});
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
});
const paginationOptions = shallowRef({
	el: ".swiper-pagination",
	clickable: true,
});
</script>

<template>
	<section
		v-if="products.length"
		class="lg:mx-auto max-w-[111.25rem] px-4 lg:px-[4.37rem] product-project"
	>
		<h4 class="mb-1 text-system-gray-900 font-bold text-xs">ТОВАРЫ</h4>
		<h3 class="text-system-black-900 text-[1.375rem] font-bold mb-7">
			Похожие товары
		</h3>
		<div class="pb-[6.8rem]">
			<Swiper
				:autoplay="autoPlayOptions"
				:breakpoints="breakpoints"
				:modules="[Pagination, Autoplay]"
				:pagination="paginationOptions"
			>
				<SwiperSlide
					v-for="item of products"
					class="relative rounded-[1.25rem] overflow-hidden !h-auto"
				>
					<ProductItem :item="item" />
				</SwiperSlide>
				<template #container-end>
					<SwiperPagination />
				</template>
			</Swiper>
		</div>
	</section>
</template>

<style scoped></style>
