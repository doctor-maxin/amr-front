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


const route = useRoute()
const allowedPages = computed(() => {
	if (route.path.startsWith('/catalog/product-')) return false;
	if (route.path.startsWith('/cart')) return false;
	if (route.path.startsWith('/checkout')) return false;
	return true;
})
</script>

<template>
	<!-- <button v-if="allowedPages" title="Заказать расчет" @click="useEvent('toFeedBack')"
		class="fixed lg:left-auto lg:right-[5rem] hover:bg-accent-300 bg-system-black-950 whitespace-nowrap py-3.5 lg:py-6 px-8 transition-colors lg:translate-x-0 -translate-x-1/2 left-1/2 call-icon-btn z-[19] flex flex-col items-center justify-center rounded-[4rem]  bottom-[1rem] lg:bottom-[2rem]">
		<span class="text-white font-semibold">Заказать расчёт</span>
	</button> -->
	<transition name="fade">
		<button type="button" title="Наверх"
			class="fixed z-[19] shadow shadow-white flex flex-col items-center justify-center rounded-full shadow-normal bottom-[9rem] right-[50px] lg:bottom-[134px]"
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