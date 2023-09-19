<script setup lang="ts">
import UiLink from "../ui/UiLink.vue";

defineProps<{
	title: string;
	description: string;
}>()
</script>

<template>
<section class="grid grid-cols-1 lg:grid-cols-[minmax(0,_64%)_minmax(0,_46%)] gap-4 lg:gap-4 lg:flex-row pb-10 lg:pb-[6.875rem]">
	<h3 v-html="title" class="font-bold text-[1.375rem] text-system-black-900 lg:text-[2.25rem]"></h3>
	<div>
		<p class="font-medium text-sm lg:text-xl lg:mb-[2.56rem]" v-html="description"></p>
		<ui-link to="/catalog" title="В каталог" class="hidden lg:flex" />
	</div>
</section>
</template>

<style scoped>

</style>