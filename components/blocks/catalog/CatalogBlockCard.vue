<script lang="ts" setup>
import { ICategory } from "~/types/common";
import { useAppConfig } from "#imports";

defineProps<{
	item: ICategory;
}>();
const appConfig = useAppConfig();

const getItemImage = (item: any): string => {
	if (item?.image) return item?.image;
	return appConfig.noImageId as string;
};
</script>

<template>
	<div class="rounded-[1.25rem] overflow-hidden">
		<nuxt-link :to="`/catalog${item.handle ?? ''}`">
			<NuxtImg
				placeholder
				loading="lazy"
				format="webp"
				sizes="100vw sm:350px lg:670px"
				provider="directus"
				:src="getItemImage(item)"
				class="aspect-[422/648] w-full object-cover"
			/>
		</nuxt-link>
		<div class="absolute bottom-3 lg:bottom-5 w-full px-3 lg:px-5">
			<div
				class="glass bg-[hsla(0,_0%,_32%,_0.4)] flex-wrap rounded-[1.25rem] text-white py-5 w-full px-6 flex items-center justify-between gap-1 left-5"
			>
				<span class="font-bold leading-[140%] text-lg">{{
					item.name
				}}</span>
				<nuxt-link
					:to="`/catalog${item.handle ?? ''}`"
					class="flex gap-1 items-center text-white font-semibold group"
				>
					<span class="text-white transition-colors">
						Посмореть
					</span>
					<svgo-arrow-top-right
						class="text-2xl icon transition-colors"
						filled
					/>
				</nuxt-link>
			</div>
		</div>
	</div>
</template>

<style scoped></style>
