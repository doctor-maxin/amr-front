<script setup lang="ts">
import { Autoplay, Pagination } from "swiper/modules";
import ArticleSlider from './ArticleSlider.vue'
import { Swiper, SwiperSlide } from "swiper/vue";
import SwiperPagination from '../../common/SwiperPagination.vue'

const props = defineProps<{
    data: {
        id: number;
        slides: {
            id: number;
            blogProductPoints_id: number;
        }[]
    }
}>()
const slides = ref<{
    id: number;
    image: string;
    products: any[];
}[]>([]);
const { getItems } = useDirectusItems();
console.log('props.data', props.data)
watchEffect(async () => {
    slides.value = await getItems({
        collection: 'blogProductPoints',
        params: {
            filter: {
                id: {
                    _in: props.data?.slides.map(item => item.blogProductPoints_id) ?? []
                }
            },
            fields: [
                'id',
                'sort',
                "image",
                "products.productPoints_id.*",
                "products.productPoints_id.product.name",
                "products.productPoints_id.product.handle",
                "products.productPoints_id.product.price",
                "products.productPoints_id.product.images.directus_files_id",
            ],
        },
    });
});

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

const progressCircle = ref<HTMLElement | null>(null);
const autoPlayOptions = shallowRef({
    delay: 7000,
    disableOnInteraction: false,
});
const onAutoplayTimeLeft = (s, time, progress) => {
    if (progressCircle.value)
        progressCircle.value.style.setProperty("--progress", String(1 - progress));
};
</script>
<template>
    <div class="article-slides">
        <Swiper :autoplay="autoPlayOptions" :modules="[Pagination, Autoplay]" :pagination="paginationOptions"
            @autoplayTimeLeft="onAutoplayTimeLeft">
            <SwiperSlide v-for="slide of slides" :key="slide.id">
                <ArticleSlider :data="slide" />
            </SwiperSlide>
            <template #container-end>
                <div class="lg:absolute lg:bottom-[2.19rem] z-10 lg:left-1/2 lg:-translate-x-1/2" ref="progressCircle">
                    <SwiperPagination />
                </div>
            </template>
        </Swiper>
    </div>
</template>
<style>
.article-slides .swiper-pagination {
    @apply lg:mt-0 lg:px-[3.13rem] lg:py-[0.88rem] lg:bg-system-black-600;
}

.article-slides .ui-pagination .swiper-pagination-bullet-active {
    @apply lg:bg-white;
}

.article-slides .ui-pagination .swiper-pagination-bullet-active svg {
    @apply lg:stroke-white;
}

.article-slides .ui-pagination .autoplay-progress {
    @apply lg:bg-white lg:bg-opacity-50;
}

.article-slides .swiper-slide>div {
    margin-bottom: 0;
}
</style>