<script lang="ts" setup>
import {IBreadCrumb} from "~/types/common";
import Arrow from '~/assets/icons/chevron-right.svg';

defineProps<{
	list: IBreadCrumb[];
	progress?: boolean;
  light?: boolean;
}>()
</script>

<template>
	<ul v-if="list?.length" class="breadcrumbs " itemscope itemtype="https://schema.org/BreadcrumbList">
		<template v-for="(item, index) of list" :key="index">
			<li :class="{
					'text-opacity-50': index + 1 === list.length || item.disabled,
					'text-white': light,
					'text-system-black-900': !light,
				}" class=" leading-5"
			    itemprop="itemListElement"
			    itemscope
			    itemtype="https://schema.org/ListItem"
			>
				<nuxt-link :class="{
					'cursor-not-allowed': item.disabled
				}" :title="item.title" :to="!item.disabled ? item.path : null" itemprop="item"
				>
					<span itemprop="name">{{ item.title }}</span>
					<meta :content="index.toString()" itemprop="position">
				</nuxt-link>
			</li>
			<template v-if="index + 1 !== list.length">
				<div v-if="progress" :class="{
					'bg-opacity-50': index + 1 === list.length || item.disabled,

				}" class="h-px mt-2.5 mx-3 w-6 bg-system-black-900"/>
				<Arrow v-else class="text-xs mx-1 !h-5" :class="{
          'text-white': light
				}" filled/>
			</template>
		</template>
	</ul>
</template>

<style lang="scss" scoped>
.breadcrumbs {
	display: flex;
	font-size: 0.875rem;
	align-items: flex-start;
}
</style>