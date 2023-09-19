<script setup lang="ts">
import {IListBlock} from "../../types/common";

defineProps<{
	block: IListBlock;
}>()
</script>

<template>
	<ul v-if="block.data.style === 'unordered'">
		<li v-for="item of block.data.items">
			<span>{{item.content}}</span>
		</li>
	</ul>
	<ol v-if="block.data.style === 'ordered'">
		<li v-for="item of block.data.items">
			<span>{{item.content}}</span>
		</li>
	</ol>
</template>

<style scoped>
ul {
	@apply list-disc list-inside mb-4 lg:mb-[2.635rem];
}
ol {
	@apply list-decimal list-inside mb-4 lg:mb-[2.635rem];
}
li {
	@apply lg:text-[1.125rem] lg:font-medium text-system-gray-900;
}
</style>