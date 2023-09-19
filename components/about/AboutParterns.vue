<script setup lang="ts">
import {IImageBlock} from "../../types/common";
import {Swiper, SwiperSlide} from 'swiper/vue'
import {computed, useDeviceWidth} from "../../.nuxt/imports";

defineProps<{
	list: IImageBlock[];
}>()

const {isTablet} = useDeviceWidth()

const spaceBetween = computed(() => {
	return isTablet.value ? 16 : 30
})
</script>

<template>
	<div class="-mx-4">
		<h2 class="text-system-black-900 text-[1.375rem] pl-4 pb-[1.375rem] lg:pb-[4rem] lg:text-[2.25rem] font-bold">Наши партнеры</h2>
		<div class="pl-4 lg:pl-0">
		<client-only>
			<Swiper slides-per-view="auto" loop :space-between="spaceBetween" >
				<template v-for="item of list" :key="item.id">
					<SwiperSlide class="!w-fit max-w-[6rem] lg:max-w-[17rem]">
						<NuxtImg
							:src="item.data.file.fileId"
							provider="directus"
							class="aspect-square  rounded-[0.635rem] lg:rounded-[1.25rem]"
						/>
					</SwiperSlide>
				</template>
			</Swiper>
		</client-only>
		</div>
	</div>
</template>

<style scoped>

</style>