<script lang="ts" setup>
import { Swiper, SwiperSlide } from "swiper/vue";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/pagination";
import UiLink from "~/components/ui/UiLink.vue";
import {
	markRaw,
	shallowRef,
	useAsyncData,
	useDirectusItems,
} from "~/.nuxt/imports";
import { IHeroBlock } from "~/types/common";
import SwiperPagination from "~/components/common/SwiperPagination.vue";

const AutoPlayDelay = shallowRef(7000);
const { getSingletonItem } = useDirectusItems();
const { data } = useAsyncData<IHeroBlock>("main-hero-block", () =>
	getSingletonItem<IHeroBlock>({
		collection: "heroBlock",
		params: { fields: ["*", "slider.directus_files_id"] },
	})
);
</script>

<template>
	<div class="relative hero-banner flex flex-col-reverse lg:flex-row">
		<div
			class="left-0 h-full z-10 lg:max-w-[65vw] xl:max-w-[55vw] 2xl:max-w-[41vw] bg-system-gray lg:bg-white lg:bg-opacity-[0.67] backdrop-blur-xl"
		>
			<article
				class="hero h-full pb-[4.44rem] lg:pb-[6.5rem] lg:pl-[4.37rem] pt-[2.25rem] lg:pt-[6.19rem] px-4 lg:pr-[1.88rem]"
			>
				<h1
					class="text-2xl lg:text-[2.625rem] mb-[1.13rem] lg:mb-[0.87rem] font-bold text-[#26282D] leading-[140%]"
				>
					{{ data?.title }}
				</h1>
				<p class="text-[0.875rem] lg:text-base font-medium">
					{{ data?.description }}
				</p>
				<UiLink
					v-if="data?.linkHref"
					:title="data.linkTitle"
					:to="data.linkHref"
					class="mt-12 lg:mt-9"
				/>
			</article>
		</div>
		<ClientOnly>
			<Swiper
				:autoplay="{
					delay: AutoPlayDelay,
				}"
				:modules="[Autoplay, Pagination]"
				:pagination="{
					el: '.swiper-pagination',
					clickable: true,
				}"
				:slides-per-view="1"
				class="max-h-screen lg:!absolute w-full h-full"
			>
				<template v-for="slide of data?.slider">
					<SwiperSlide class="relative">
						<div class="static w-full h-full">
							<NuxtImg
								class="w-full object-center h-full object-cover max-h-full"
								:src="slide.directus_files_id"
								provider="directus"
							/>
						</div>
					</SwiperSlide>
				</template>
				<template #container-end>
					<teleport to=".hero-banner">
						<div
							class="absolute swiper-pagination lef-0 lg:left-[4.37rem] bottom-6 lg:bottom-7 top-auto z-20 bg-transparent"
						/>
					</teleport>
				</template>
			</Swiper>
		</ClientOnly>
	</div>
</template>

<style lang="scss">
.hero h1 {
	text-wrap: wrap;
}

.hero p {
	max-inline-size: 35rem;
}

.hero-banner .swiper {
	.swiper-pagination {
		background-color: transparent !important;

		.swiper-pagination-bullet {
			@apply bg-[#33363C] bg-opacity-80 border-2 border-system-gray-800;
			width: 24px !important;
			height: 24px !important;
			display: inline-block;
			aspect-ratio: 1;
			border-radius: 50%;
		}
		.swiper-pagination-bullet-active {
			@apply bg-system-gray-800 bg-opacity-100;
			animation: progress 10s cubic-bezier(0.25, 0.4, 0.75, 0.6) forwards;
		}
	}
}
@keyframes progress {
	0% {
		clip-path: polygon(
			50% 50%,
			50% -21%,
			-21% 50%,
			50% 121%,
			121% 50%,
			50% -21%
		);
	}
	25% {
		clip-path: polygon(
			50% 50%,
			50% -21%,
			-21% 50%,
			50% 121%,
			121% 50%,
			121% 50%
		);
	}
	50% {
		clip-path: polygon(
			50% 50%,
			50% -21%,
			-21% 50%,
			50% 121%,
			50% 121%,
			50% 121%
		);
	}
	75% {
		clip-path: polygon(
			50% 50%,
			50% -21%,
			-21% 50%,
			-21% 50%,
			-21% 50%,
			-21% 50%
		);
	}
	100% {
		clip-path: polygon(
			50% 50%,
			50% -21%,
			50% -21%,
			50% -21%,
			50% -21%,
			50% -21%
		);
	}
}
@keyframes l-background {
	49.999% {
		border-width: 0 0 0 50px;
		border-color: transparent;
	}
	50%,
	100% {
		border-width: 0 50px 0 0;
		border-color: darkturquoise;
	}
}
@keyframes l-rotate {
	49.999% {
		left: -100%;
	}
	50% {
		left: 0;
	}
	100% {
		transform: rotate(360deg);
		left: 0;
	}
}
</style>
