<script lang="ts" setup>
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Autoplay, Pagination } from 'swiper/modules';
import { shallowRef, markRaw, useAsyncData, useDirectusItems } from "~/.nuxt/imports";
import 'swiper/css';
import 'swiper/css/autoplay'
import 'swiper/css/pagination'
import CatalogBlockCard from "~/components/blocks/catalog/CatalogBlockCard.vue";
import UiLink from "~/components/ui/UiLink.vue";
import { computed, useNuxtData } from "#imports";
import { ICategory } from "~/types/common";

const autoPlayOptions = shallowRef({
	delay: 7000
})
const breakpoints = shallowRef({
	320: {
		slidesPerView: 1.2,
		spaceBetween: 14
	},
	640: {
		slidesPerView: 2,
		spaceBetween: 18
	},
	768: {
		slidesPerView: 2.5,
		spaceBetween: 20
	},
	1025: {
		slidesPerView: 3,
		spaceBetween: 28
	},
	1280: {
		slidesPerView: 4,
		spaceBetween: 30
	}
})
const { getItems } = useDirectusItems()

const { data: mainCategories } = await useAsyncData('mainCategories', () => getItems<ICategory>({
	collection: 'category', params: {
		filter: {
			parentId: {
				_null: true
			}
		},
		fields: ['name', 'handle', 'id', 'image']
	}
}))

const progressCircle = ref(null);

const onAutoplayTimeLeft = (s, time, progress) => {
	if (progressCircle.value)
		progressCircle.value.style.setProperty("--progress", 1 - progress);
};
const paginationOptions = shallowRef({
	el: '.swiper-pagination',
	clickable: true,
	renderBullet: function (index, className) {
		return `<span class="${className} autoplay-progress">
					<svg xmlns="http://www.w3.org/2000/svg"  class="origami" height="360" viewBox="0 0 24 24" width="360">
						<circle cx="13" cy="11" r="10"></circle>
					</svg>
				</span>`;
	},
})


</script>

<template>
	<section class="lg:px-[4.37rem] catalog-block">
		<h4 class="subhead text-center lg:text-left">КАТАЛОГ</h4>
		<div class="flex items-end mb-7 lg:mb-[2.5rem] justify-between">
			<h2 class="head xl:flex lg:px-0 w-full text-center lg:max-w-[28rem] lg:text-left">Выберите решение для своей
				комнаты</h2>
			<UiLink title="Весь каталог" to="/catalog" variant="filled" class="hidden lg:flex" />
		</div>
		<div>
			<ClientOnly>
				<Swiper :autoplay="autoPlayOptions" :breakpoints="breakpoints" :modules="[Pagination, Autoplay]"
					centered-slides centeredSlidesBounds :pagination="paginationOptions"
					@autoplayTimeLeft="onAutoplayTimeLeft" class="!px-4 lg:!px-0">
					<SwiperSlide v-for="item of mainCategories" :key="item.id">
						<CatalogBlockCard :item="item" />
					</SwiperSlide>
					<template v-slot:container-end>
						<div ref="progressCircle" class="top-full hidden mt-10 lg:flex justify-center">
							<div
								class="swiper-pagination !w-auto bg-system-gray !static flex gap-3 py-5 px-[4.8125rem] rounded-[4.5rem]">
							</div>
						</div>
					</template>
				</Swiper>
			</ClientOnly>
		</div>
	</section>
</template>

<style>
.catalog-block .swiper-pagination-bullet {
	background-color: hsla(220, 8%, 22%, 0.5);
	position: relative;
}

.catalog-block .swiper-horizontal>.swiper-pagination-bullets .swiper-pagination-bullet,
.swiper-pagination-horizontal.swiper-pagination-bullets .swiper-pagination-bullet {
	margin: 0 !important;
	width: 12px;
	height: 12px;
}

.catalog-block .swiper-wrapper {}

.catalog-block .swiper-pagination-bullet-active {
	background-color: hsla(220, 8%, 22%, 1);
}

.catalog-block .swiper-pagination-bullet-active svg {
	opacity: 1;
}
</style>