<script setup lang="ts">
import {IImageBlock} from "../../types/common";
import {useDeviceWidth} from "../../composables/useDeviceWidth";
import {computed, onBeforeUnmount, onMounted, ref} from "../../.nuxt/imports";

defineProps<{
	list: IImageBlock[];
}>()
const {isTablet} = useDeviceWidth()
const container = ref<HTMLElement | null>(null)
const isFullVisible = ref(false)

const onScroll = (ev) => {
	if (document.scrollingElement.scrollTop >= container.value.offsetTop && !isFullVisible.value) {
		ev.preventDefault()
		console.log('scroll')
	}
}

onMounted(() => {
	document.addEventListener('scroll', onScroll)
})
onBeforeUnmount(() => {
	document.removeEventListener('scroll', onScroll)
})

</script>

<template>
	<div class="pb-[3rem] lg:pb-[8.75rem]">
		<h2 class="text-system-black-900 text-[1.375rem] pb-[1.375rem] lg:pb-[4rem] lg:text-[2.25rem] font-bold">От идеи до реализации</h2>
		<div ref="container" class="grid grid-cols-1 about-way-container lg:grid-cols-3 gap-[3rem] lg:gap-x-[1.88rem] lg:gap-y-[2.5rem]" >
			<template v-for="(item, index) of list" :key="item.id">
				<figure class="flex about-way-item flex-col gap-[1.135rem] lg:gap-[1.7rem]">
					<NuxtImg :src="item.data.file.fileId" provider="directus" class="aspect-[35/24] rounded-[0.635rem]" />
					<figcaption class="font-bold text-center">{{item.data.caption}}</figcaption>
				</figure>
			</template>
		</div>
	</div>
</template>

<style scoped>
.about-way-container {
	scroll-snap-type: y mandatory;
}
.about-way-item {
	scroll-snap-align: start;
}
</style>