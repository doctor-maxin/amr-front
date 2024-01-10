<script setup lang="ts">
import { IImageBlock } from "../../types/common";
import { Swiper, SwiperSlide } from 'swiper/vue'
import { computed, useDeviceWidth } from "../../.nuxt/imports";

defineProps<{
	list: IImageBlock[];
}>()

const { isTablet } = useDeviceWidth()

const spaceBetween = computed(() => {
	return isTablet.value ? 16 : 30
})
</script>

<template>
	<div class="-mx-4">
		<client-only>
			<Swiper slides-per-view="auto" loop :space-between="spaceBetween">
				<template v-for="item of list" :key="item.id">
					<SwiperSlide class="!w-fit max-w-[17.5rem] lg:max-w-[35.875rem]">
						<NuxtImg :src="item.data.file.fileId" provider="directus"
							class="aspect-[280/194] object-cover rounded-[0.635rem]" />
					</SwiperSlide>
				</template>
			</Swiper>
		</client-only>
	</div>
</template>

<style scoped></style>