<script setup lang="ts">
import { IProduct } from "../../../types/product";
import { useSwiper } from "swiper/vue";

defineProps<{
	list: IProduct["images"];
}>();

const swiper = useSwiper();
</script>

<template>
	<div
		v-if="list.length > 1"
		class="bg-white rounded-[6.125rem] bg-opacity-40 flex backdrop-blur-[50px] p-[0.4rem] lg:p-[0.635rem] gap-[0.41rem] lg:gap-[0.6rem] absolute left-1/2 z-10 bottom-[1.375rem] -translate-x-1/2"
	>
		<button
			v-for="(image, index) of list"
			:key="image.directus_files_id"
			class="w-[1.831rem] rounded-full overflow-hidden h-[1.831rem] lg:w-[2.8125rem] lg:h-[2.8125rem]"
			type="button"
		>
			<NuxtImg
				:src="image.directus_files_id"
				class="w-full h-full"
				fit="cover"
				height="45"
				provider="directus"
				width="45"
				@click="swiper.slideTo(index, 300)"
			/>
		</button>
	</div>
</template>

<style scoped></style>
