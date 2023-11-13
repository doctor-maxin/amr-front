<script setup lang="ts">
import {IImageBlock} from "../../types/common";

defineProps<{
	text: string;
	image: string;
}>()
</script>

<template>
	<div class="">
		<h2 class="text-system-black-900 text-[1.375rem] pb-[1.375rem] lg:pb-[4rem] lg:text-[2.25rem] font-bold">Гарантии от производителя</h2>
		<div class="relative">
			<NuxtImg :src="image" provider="directus" class="rounded-[1.25rem] w-full aspect-[21/13] lg:aspect-[111/52]" />
			<div class="py-[1.135rem] max-w-[42rem] left-[8vw] bottom-[2vw] lg:absolute px-[1.315rem] lg:text-xl lg:px-[3.44rem] lg:py-[1.81rem] text-white glass text-sm rounded-[1.25rem] font-medium bg-system-gray-400 bg-opacity-50 -translate-y-12">{{text}}</div>
		</div>
	</div>
</template>

<style scoped>

</style>