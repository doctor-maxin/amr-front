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
    <button title="Заказать расчет" v-show="scY > 300" @click="useEvent('toFeedBack')" class="fixed bg-accent-300 text-white call-icon-btn z-[19] shadow shadow-white flex flex-col items-center justify-center rounded-full shadow-normal right-4 bottom-[6rem] lg:right-[5rem] lg:bottom-[11rem]">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 25"><path stroke="currentColor" d="M23 17.11a5.92 5.92 0 0 0-4.63-3.95 1.5 1.5 0 0 0-1.51.66l-1.26 1.81a.53.53 0 0 1-.61.2 13.25 13.25 0 0 1-3.6-2.14 13 13 0 0 1-2.94-3.52.5.5 0 0 1 .17-.69l1.63-1.09a1.52 1.52 0 0 0 .61-1.71 10.13 10.13 0 0 0-1.38-2.89 10.36 10.36 0 0 0-2.2-2.33A1.53 1.53 0 0 0 6 1.19a7.31 7.31 0 0 0-1.13.43A7.64 7.64 0 0 0 1.2 6.1a1.48 1.48 0 0 0 0 .93 24.63 24.63 0 0 0 6.53 10.41A24.76 24.76 0 0 0 17.12 23a1.41 1.41 0 0 0 .45.07 1.59 1.59 0 0 0 .48-.07 7.64 7.64 0 0 0 4.47-3.66A6.21 6.21 0 0 0 23 18a1.46 1.46 0 0 0 0-.89zm-1.33 1.74A6.61 6.61 0 0 1 17.73 22a.54.54 0 0 1-.31 0 23.61 23.61 0 0 1-9-5.29 23.74 23.74 0 0 1-6.27-10 .47.47 0 0 1 0-.31 6.59 6.59 0 0 1 3.14-3.88 5 5 0 0 1 1-.36h.1a.5.5 0 0 1 .32.11 9.4 9.4 0 0 1 2 2.09A9.07 9.07 0 0 1 9.9 7a.52.52 0 0 1-.21.6L8.06 8.64a1.54 1.54 0 0 0-.47 2 14.09 14.09 0 0 0 7 6.09 1.51 1.51 0 0 0 1.81-.58l1.21-1.81a.51.51 0 0 1 .51-.23A4.94 4.94 0 0 1 22 17.44a.58.58 0 0 1 0 .29 5.35 5.35 0 0 1-.38 1.12z"/></svg>
    </button>
  </transition>
	<transition name="fade">
		<button type="button"
            title="Наверх"
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