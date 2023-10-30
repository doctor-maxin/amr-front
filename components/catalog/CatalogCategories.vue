<script lang="ts" setup>
import { ICategory } from "../../types/common";
import { useAppConfig } from "~/.nuxt/imports";

const appConfig = useAppConfig();

defineProps<{
	items: ICategory[];
}>();

const getItemImage = (item: ICategory): string => {
	if (item.image?.id) return item.image.id;
	return appConfig.noImageId as string;
};
</script>

<template>
	<div v-if="items.length" class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-7">
		<template v-for="item of items" :key="item.id">
			<nuxt-link :to="`/catalog${item.handle ?? ''}`"
				class="rounded-[1.25rem] overflow-hidden group border relative cursor-pointer">
				<client-only>
					<NuxtImg :class="{
						'object-cover': item?.image?.id,
					}" :src="getItemImage(item)" class="w-full object-contain h-full aspect-[21/14] lg:aspect-[574/398]"
						provider="directus" />
				</client-only>
				<div :to="`/catalog${item.handle ?? ''}`"
					class="font-semibold group-hover:opacity-100 lg:block hidden lg:opacity-0 transition-opacity absolute text-white left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 bg-system-black-600 backdrop-blur-[10px] py-3 px-[1.135rem] rounded-[0.63rem]">
					Посмотреть
				</div>
				<div
					class="bg-system-black-600 w-[calc(100%_-_1.5rem)] lg:w-[calc(100%_-_2.5rem)] absolute font-semibold text-white text-sm lg:text-base backdrop-blur-[10px] bottom-3 lg:bottom-5 left-3 lg:left-5 rounded-2xl lg:rounded-[1.25rem] p-4 lg:p-5">
					{{ item.name }}
				</div>
			</nuxt-link>
		</template>
	</div>
</template>

<style scoped></style>
