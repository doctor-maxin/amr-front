<script setup lang="ts">
import { useSwiperSlide } from "swiper/vue";

const props = defineProps<{
	slide: {
		id: string;
		title: string;
	};
}>();
const app = useRuntimeConfig();
const slide = useSwiperSlide();
const videoRef = ref<HTMLVideoElement | null>(null);

watch(
	() => slide.value.isActive,
	() => {
		if (slide.value.isActive) {
			videoRef.value?.play();
		} else {
			videoRef.value?.pause();
		}
	}
);

const src = computed(
	() => `${app.public.directus.url}/assets/${props.slide.id}`
);
</script>

<template>
	<video ref="videoRef" v-if="src" playsinline :title="title" :src="src" />
</template>

<style scoped></style>
