<script lang="ts" setup>
defineProps<{
	item: {
		id: number;
		title: string;
		image: string;
		link: string;
	};
}>()
</script>

<template>
	<div class="rounded-[1.25rem] overflow-hidden">
		<nuxt-link :to="item.link">
			<img :src="item.image" class="aspect-[422/648] w-full grayscale-[50%] object-cover"/>
		</nuxt-link>
		<div class="absolute bottom-3 lg:bottom-5 w-full px-3 lg:px-5">
			<div
				class="glass bg-[hsla(0,_0%,_32%,_0.4)] flex-wrap rounded-[1.25rem] text-white py-5 w-full px-6 flex items-center justify-between gap-1 left-5">
				<span class="font-bold leading-[140%] text-lg">{{ item.title }}</span>
				<nuxt-link :to="item.link"
				           class="flex gap-1 items-center text-white font-semibold group"
				>
			<span class="text-white  transition-colors"
			>
				Посмореть
			</span>
					<svgo-arrow-top-right
						class="text-2xl icon  transition-colors" filled/>
				</nuxt-link>
			</div>
		</div>
	</div>
</template>

<style scoped>

</style>