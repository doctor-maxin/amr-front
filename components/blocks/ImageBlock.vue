<script lang="ts" setup>
import {IImageBlock} from "../../types/common";

defineProps<{
	block: IImageBlock;
}>()
</script>

<template>
	<div class="mb-4 lg:mb-[2.5rem]">
		<NuxtImg
			:alt="block.data.file.name"
			:class="{
				'w-full': block.data.stretched,
			}"
			:src="block.data.file.fileId"
			:title="block.data.file.title"
			class="image"
			provider="directus"
		/>
		<span v-if="block.data.caption" class="w-full text-center">{{ block.data.caption }}</span>
	</div>
</template>

<style scoped>
.image {
	border-radius: 1.25rem;
}
</style>