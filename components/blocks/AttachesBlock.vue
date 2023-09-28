<script lang="ts" setup>
import { IAttachesBlock } from "../../types/common";
import UiButton from "../ui/UiButton.vue";
import { useAppConfig, useRuntimeConfig } from "#imports";
const appConfig = useRuntimeConfig();

defineProps<{
	block: IAttachesBlock;
}>();
</script>

<template>
	<div class="mb-4 lg:mb-[1.56rem]">
		<div
			class="bg-system-gray-500 px-[1.635rem] py-[1.315rem] gap-4 rounded-[1.25rem] flex-row grid grid-cols-[auto_1fr] lg:flex lg:items-center"
		>
			<svgo-file class="text-[1.5rem]" filled />
			<span
				class="text-system-black-900 font-semibold overflow-ellipsis overflow-hidden"
			>
				{{ block.data.title }}
			</span>
			<a
				class="font-semibold col-start-2 ml-auto flex items-center gap-1"
				target="_blank"
				:href="`${appConfig.public.directus.url}${block.data.file.url}?download`"
			>
				<span>Скачать</span>
				<svgo-arrow-bottom filled class="text-2xl" />
			</a>
		</div>
	</div>
</template>

<style scoped></style>
