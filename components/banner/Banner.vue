<script lang="ts" setup>
import {Swiper, SwiperSlide} from 'swiper/vue'
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/autoplay'
import 'swiper/css/pagination'
import UiLink from "~/components/ui/UiLink.vue";
import { markRaw, shallowRef, useAsyncData, useDirectusItems } from "~/.nuxt/imports";
import { IHeroBlock } from "~/types/common";

const AutoPlayDelay = shallowRef(7000)
const {getSingletonItem} = useDirectusItems()
const {data} = useAsyncData<IHeroBlock>('main-hero-block', () => getSingletonItem<IHeroBlock>({
	collection: 'heroBlock',
	params: {fields: ['*', 'slider.directus_files_id']}
}))
</script>

<template>
	<div class="relative flex flex-col-reverse lg:flex-row">
		<div class="left-0 h-full z-10 lg:max-w-[65vw] xl:max-w-[55vw] 2xl:max-w-[41vw] bg-system-gray lg:bg-white lg:bg-opacity-[0.67] backdrop-blur-xl">
		<article
			class="hero h-full pb-[4.44rem] lg:pb-[6.5rem]  lg:pl-[4.37rem] pt-[2.25rem] lg:pt-[6.19rem] px-4 lg:pr-[1.88rem] ">
			<h1 class="text-2xl lg:text-[2.625rem] mb-[1.13rem] lg:mb-[0.87rem] font-bold text-[#26282D] leading-[140%]">
				{{data?.title }}</h1>
			<p class="text-[0.875rem] lg:text-base font-medium">{{ data?.description }}</p>
			<UiLink v-if="data?.linkHref" :title="data.linkTitle" :to="data.linkHref" class="mt-12 lg:mt-9"/>
		</article>
		</div>
		<ClientOnly>
			<Swiper
				:autoplay="{
					delay: AutoPlayDelay
				}"
				:modules="[Autoplay, Pagination]"
				:pagination="true"
				:slides-per-view="1"
				class="max-h-screen lg:!absolute w-full h-full">
				<template v-for="slide of data?.slider">
					<SwiperSlide class="relative">
							<div class="static w-full h-full ">
								<NuxtImg class="w-full object-center h-full object-cover max-h-full" :src="slide.directus_files_id" provider="directus" />
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