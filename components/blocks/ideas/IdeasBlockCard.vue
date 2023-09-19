<script lang="ts" setup>
import {IIdeaItem} from "~/types/ideas";
import UiLink from "~/components/ui/UiLink.vue";

defineProps<{
	item: IIdeaItem
}>()
</script>

<template>
	<article>
	<div class="rounded-[1.25rem] relative overflow-hidden mb-4 lg:mb-9">
		<nuxt-link :to="`/blog/${item.handle}`">
      <NuxtImg width="600" provider="directus" :src="item.image" class="aspect-[573/333] grayscale-[50%] object-cover" />
		</nuxt-link>
		<div class="absolute bottom-3 lg:bottom-5 w-full px-3 lg:px-5">
			<div
				class="glass bg-[hsla(0,_0%,_32%,_0.4)] rounded-[1.25rem] text-white py-5 w-full px-6 flex items-center justify-between  left-5">
				<span class="font-bold leading-[140%] text-lg">{{
					item.type === 'news' ? 'Новости' : item.type === 'ideas' ? 'Идеи' : 'Проекты'
					}}</span>
				<span class="font-bold leading-[140%] text-lg">
					{{new Date(item.date_created).toLocaleDateString()}}
				</span>
			</div>
		</div>
	</div>
		<div class="flex flex-col gap-2">
			<h3 class="lg:text-[1.375rem] font-bold leading-[140%]">
				{{item.name}}
			</h3>
			<p class="text-xs font-medium leading-[140%] text-system-gray-900 lg:text-base">{{item.description}}</p>
			<UiLink variant="empty" :to="`/blog/${item.handle}`" title="Читать пост" class="hidden mt-6 lg:flex" />
		</div>
	</article>
</template>

<style scoped>

</style>