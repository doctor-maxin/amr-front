<script setup lang="ts">
import { onMounted, ref } from "~/.nuxt/imports";

onMounted(() => {
	window.addEventListener('scroll', onScroll);
});

const scY = ref(0);
const scTimer = ref<number>(0);
const onScroll = () => {
	if (scTimer.value) return;

	scTimer.value = window.setTimeout(() => {
		scY.value = window.scrollY;
		clearTimeout(scTimer.value);
		scTimer.value = 0;
	}, 100);
};

const toTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
</script>

<template>
	<transition name="fade">
		<button type="button"
			class="fixed z-[19] shadow shadow-white hidden lg:flex flex-col items-center justify-center rounded-full shadow-normal right-3 bottom-20 lg:right-[5rem] lg:bottom-[5rem]"
			v-show="scY > 300" @click="toTop">
			<svg xmlns="http://www.w3.org/2000/svg" width="65" height="65" viewBox="0 0 65 65" fill="none">
				<rect width="65" height="65" rx="32.5" fill="#E6E6E6" />
				<path d="M39.0699 29.57L32.9999 23.5L26.9299 29.57" stroke="black" stroke-width="1.5" stroke-miterlimit="10"
					stroke-linecap="round" stroke-linejoin="round" />
				<path d="M33 40.4999V23.6699" stroke="black" stroke-width="1.5" stroke-miterlimit="10"
					stroke-linecap="round" stroke-linejoin="round" />
			</svg>
		</button>
	</transition>
</template>

<style scoped></style>