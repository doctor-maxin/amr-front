<script setup lang="ts">
import {IImageBlock} from "../../types/common";
import {useDeviceWidth} from "../../composables/useDeviceWidth";
import {computed, onBeforeUnmount, onMounted, ref} from "../../.nuxt/imports";


defineProps<{
	list: IImageBlock[];
}>()
const container = ref<HTMLElement | null>(null)
const firstVisible = ref(false)
const secondVisible = ref(false)
const thirdVisible = ref(false)

const onScroll = (ev) => {
  console.log(document.scrollingElement.scrollTop, container.value.offsetTop)
	if (document.scrollingElement.scrollTop >= container.value.offsetTop - 400) {
		if (!firstVisible.value)
          return firstVisible.value = true;
		else if (!secondVisible.value)
          return secondVisible.value = true;
		else if (!thirdVisible.value)
      return thirdVisible.value = true;
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
		<div ref="container" class="grid grid-cols-1 aspect-[105/25] about-way-container lg:grid-cols-3 gap-[3rem] lg:gap-x-[1.88rem] lg:gap-y-[2.5rem]" >

            <transition
                enter-active-class="transition duration-1000 ease-out"
                enter-from-class="-translate-y-4 opacity-0"
                enter-to-class="translate-y-0 opacity-100"
                leave-active-class="transition duration-150 ease-in"
                leave-from-class="translate-y-0 opacity-100"
                leave-to-class="-translate-y-4 opacity-0"
            >
				<figure v-if="firstVisible" class="flex about-way-item flex-col gap-[1.135rem] lg:gap-[1.7rem]">
					<NuxtImg :src="list[0]?.data.file.fileId" provider="directus" class="aspect-[35/24] rounded-[0.635rem]" />
					<figcaption class="font-bold text-center">{{list[0]?.data.caption}}</figcaption>
				</figure>
				</transition>
      <transition
          enter-active-class="transition duration-1000 delay-500 ease-out"
          enter-from-class="-translate-y-4 opacity-0"
          enter-to-class="translate-y-0 opacity-100"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="translate-y-0 opacity-100"
          leave-to-class="-translate-y-4 opacity-0"
      >
        <figure v-if="firstVisible && secondVisible" class="flex about-way-item flex-col gap-[1.135rem] lg:gap-[1.7rem]">
          <NuxtImg :src="list[1]?.data.file.fileId" provider="directus" class="aspect-[35/24] rounded-[0.635rem]" />
          <figcaption class="font-bold text-center">{{list[1]?.data.caption}}</figcaption>
        </figure>
      </transition>
      <transition
          enter-active-class="transition duration-1000 delay-1000 ease-out"
          enter-from-class="-translate-y-4 opacity-0"
          enter-to-class="translate-y-0 opacity-100"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="translate-y-0 opacity-100"
          leave-to-class="-translate-y-4 opacity-0"
      >
        <figure v-if="firstVisible && secondVisible && thirdVisible" class="flex about-way-item flex-col gap-[1.135rem] lg:gap-[1.7rem]">
          <NuxtImg :src="list[2]?.data.file.fileId" provider="directus" class="aspect-[35/24] rounded-[0.635rem]" />
          <figcaption class="font-bold text-center">{{list[2]?.data.caption}}</figcaption>
        </figure>
      </transition>
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