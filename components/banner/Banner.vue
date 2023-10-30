<script lang="ts" setup>
import { Swiper, SwiperSlide } from "swiper/vue";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/pagination";
import UiLink from "~/components/ui/UiLink.vue";
import {
	ref,
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
	}),
);
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
	<div class="relative hero-banner flex flex-col lg:flex-row">
		<ClientOnly>
			<Swiper :autoplay="{
				delay: AutoPlayDelay,
				disableOnInteraction: false,
			}" :modules="[Autoplay, Pagination]" :slides-per-view="1" :pagination="paginationOptions"
				class="max-h-screen w-full h-full" wrapper-class="lg:!absolute top-0 left-0 z-[1]"
				@autoplayTimeLeft="onAutoplayTimeLeft">
				<template v-for="slide of data?.slider">
					<SwiperSlide class="relative !h-auto">
						<div class="static w-full h-full">
							<NuxtImg class="w-full object-center h-full object-cover max-h-full" placeholder
								sizes="640px sm:640px md:768px lg:1024px xl:1280px 2xl:1536px 100vw"
								:src="slide.directus_files_id" format="webp" provider="directus" />
						</div>
					</SwiperSlide>
				</template>
				<template #container-start> </template>
				<template #container-end>
					<div
						class="left-0 lg:block hidden relative z-[2] h-full z-10 lg:max-w-[40vw] bg-system-gray lg:bg-white lg:bg-opacity-[0.67] backdrop-blur-xl">
						<article
							class="hero h-full pb-[4.44rem] lg:pb-[6.5rem] lg:pl-[4.37rem] pt-[2.25rem] lg:pt-[6.19rem] px-4 lg:pr-[1.88rem]">
							<h1
								class="text-2xl lg:text-[2.625rem] mb-[1.13rem] lg:mb-[0.87rem] font-bold text-[#26282D] leading-[140%]">
								{{ data?.title }}
							</h1>
							<p class="text-[0.875rem] lg:text-base font-medium">
								{{ data?.description }}
							</p>
							<UiLink v-if="data?.linkHref" :title="data.linkTitle" :to="data.linkHref"
								class="mt-12 lg:mt-9" />
						</article>
					</div>
					<div ref="progressCircle"
						class="lg:left-[4.37rem] left-0 flex lg:w-fit w-full justify-center lg:block lg:bottom-[2.1875rem] bottom-6 absolute">
						<SwiperPagination />
					</div>
				</template>
			</Swiper>
		</ClientOnly>
		<div
			class="left-0 lg:hidden relative z-[2] h-full z-10 lg:max-w-[60vw] bg-system-gray lg:bg-white lg:bg-opacity-[0.67] backdrop-blur-xl">
			<article
				class="hero h-full pb-[4.44rem] lg:pb-[6.5rem] lg:pl-[4.37rem] pt-[2.25rem] lg:pt-[6.19rem] px-4 lg:pr-[1.88rem]">
				<h1
					class="text-2xl lg:text-[2.625rem] mb-[1.13rem] lg:mb-[0.87rem] font-bold text-[#26282D] leading-[140%]">
					{{ data?.title }}
				</h1>
				<p class="text-[0.875rem] lg:text-base font-medium">
					{{ data?.description }}
				</p>
				<UiLink v-if="data?.linkHref" :title="data.linkTitle" :to="data.linkHref" class="mt-12 lg:mt-9" />
			</article>
		</div>
	</div>
</template>

<style lang="scss">
.hero h1 {
	text-wrap: wrap;
}

.hero p {
	max-inline-size: 35rem;
}

.autoplay-progress {
	color: hsla(220, 8%, 22%, 1);
}

.autoplay-progress svg {
	opacity: 0;
	position: absolute;
	left: -5px;
	top: -5px;
	z-index: 10;
	width: 24px;
	height: 24px;
	stroke-width: 2px;
	stroke: hsla(220, 8%, 22%, 1);
	fill: none;
	stroke-dashoffset: calc(70 * (1 - var(--progress)));
	stroke-dasharray: 70;
	transform: rotate(-90deg);
}

.hero-banner {
	.ui-pagination {
		margin-top: 0;

		.swiper-pagination {
			background-color: transparent;
			padding: 0;
		}
	}

	.swiper-pagination-bullet-active svg {
		opacity: 1;
	}

	.swiper-pagination-bullet-active::after {
		display: none;
	}
}

@keyframes progress {
	0% {
		clip-path: polygon(50% 50%,
				50% -21%,
				-21% 50%,
				50% 121%,
				121% 50%,
				50% -21%);
	}

	25% {
		clip-path: polygon(50% 50%,
				50% -21%,
				-21% 50%,
				50% 121%,
				121% 50%,
				121% 50%);
	}

	50% {
		clip-path: polygon(50% 50%,
				50% -21%,
				-21% 50%,
				50% 121%,
				50% 121%,
				50% 121%);
	}

	75% {
		clip-path: polygon(50% 50%,
				50% -21%,
				-21% 50%,
				-21% 50%,
				-21% 50%,
				-21% 50%);
	}

	100% {
		clip-path: polygon(50% 50%,
				50% -21%,
				50% -21%,
				50% -21%,
				50% -21%,
				50% -21%);
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
