<script lang="ts" setup>
import {Swiper, SwiperSlide} from 'swiper/vue'
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/autoplay'
import 'swiper/css/pagination'
import UiLink from "~/components/ui/UiLink.vue";
import {markRaw, shallowRef} from "~/.nuxt/imports";

const AutoPlayDelay = shallowRef(7000)

const slides = markRaw([
	{
		id: 1,
		title: 'Авторская мебель, обладающая уникальным дизайном и неповторимым стилем',
		description: 'Каждая деталь нашей мебели - это произведение искусства, которое привносит индивидуальность и неповторимость в Ваш дом',
		link: {
			title: 'Посмотреть решения',
			href: '/catalog'
		},
		backgroundImage: 'images/main-banner.jpg'
	},
	{
		id: 2,
		title: 'Авторская мебель, обладающая уникальным дизайном и неповторимым стилем',
		description: 'Каждая деталь нашей мебели - это произведение искусства, которое привносит индивидуальность и неповторимость в Ваш дом',
		link: {
			title: 'Посмотреть решения',
			href: '/catalog'
		},
		backgroundImage: 'images/main-banner.jpg'
	},
	{
		id: 3,
		title: 'Авторская мебель, обладающая уникальным дизайном и неповторимым стилем',
		description: 'Каждая деталь нашей мебели - это произведение искусства, которое привносит индивидуальность и неповторимость в Ваш дом',
		link: {
			title: 'Посмотреть решения',
			href: '/catalog'
		},
		backgroundImage: 'images/main-banner.jpg'
	},
	{
		id: 4,
		title: 'Авторская мебель, обладающая уникальным дизайном и неповторимым стилем',
		description: 'Каждая деталь нашей мебели - это произведение искусства, которое привносит индивидуальность и неповторимость в Ваш дом',
		link: {
			title: 'Посмотреть решения',
			href: '/catalog'
		},
		backgroundImage: 'images/main-banner.jpg'
	},
	{
		id: 5,
		title: 'Авторская мебель, обладающая уникальным дизайном и неповторимым стилем',
		description: 'Каждая деталь нашей мебели - это произведение искусства, которое привносит индивидуальность и неповторимость в Ваш дом',
		link: {
			title: 'Посмотреть решения',
			href: '/catalog'
		},
		backgroundImage: 'images/main-banner.jpg'
	},
])
</script>

<template>
	<div class="relative flex flex-col-reverse lg:flex-row">
		<article
			class="hero left-0 h-full lg:max-w-[65vw] xl:max-w-[55vw] 2xl:max-w-[41vw] pb-[4.44rem] lg:pb-[6.5rem] z-10 lg:pl-[4.37rem] pt-[2.25rem] lg:pt-[6.19rem] px-4 lg:pr-[1.88rem] bg-system-gray lg:bg-white lg:bg-opacity-[0.67] backdrop-blur-xl">
			<h1 class="text-2xl lg:text-[2.625rem] mb-[1.13rem] lg:mb-[0.87rem] font-bold text-[#26282D] leading-[140%]">
				Авторская мебель, обладающая уникальным дизайном и неповторимым стилем</h1>
			<p class="text-[0.875rem] lg:text-base font-medium">Каждая деталь нашей мебели - это произведение искусства, которое привносит индивидуальность и неповторимость в Ваш дом</p>
			<UiLink title="Посмотреть решения" to="/catalog" class="mt-12 lg:mt-9"/>
		</article>
		<ClientOnly>
			<Swiper
				:autoplay="{
					delay: AutoPlayDelay
				}"
				:modules="[Autoplay, Pagination]"
				:pagination="true"
				:slides-per-view="1"
				class="max-h-screen lg:!absolute w-full h-full">
				<template v-for="slide of slides">
					<SwiperSlide class="relative">
							<div class="static w-full h-full ">
								<img class="w-full object-center h-full object-cover max-h-full" :src="slide.backgroundImage" format="avif,webp" />
							</div>
					</SwiperSlide>
				</template>
			</Swiper>
		</ClientOnly>
	</div>
</template>

<style scoped>
.hero h1 {
	text-wrap: wrap;
}

.hero p {
	max-inline-size: 35rem;
}

</style>