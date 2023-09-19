<script setup lang="ts">
import {IHeaderBlock} from "../../types/common";

defineProps<{
	block: IHeaderBlock
}>()
</script>

<template>
<div :style="{
	textAlign: block.tunes?.alignment?.alignment
}">
	<h1 v-if="block.data.level === 1">{{block.data.text}}</h1>
	<h2 v-else-if="block.data.level === 2">{{block.data.text}}</h2>
	<h3 v-else-if="block.data.level === 3">{{block.data.text}}</h3>
	<h4 v-else-if="block.data.level === 4">{{block.data.text}}</h4>
	<h5 v-else-if="block.data.level === 5">{{block.data.text}}</h5>
	<h6 v-else-if="block.data.level === 6">{{block.data.text}}</h6>
</div>
</template>

<style scoped>
h6 {
	@apply lg:text-2xl font-medium text-system-black-900 lg:mb-6 mb-4;
}
h5 {
	@apply lg:text-2xl font-medium text-system-black-900 lg:mb-6 mb-4;
}
h4 {
	@apply lg:text-2xl font-medium text-system-black-900 lg:mb-6 mb-4;
}
h3 {
	@apply lg:text-2xl font-medium text-system-black-900 lg:mb-6 mb-4;
}
h2 {
	@apply lg:text-2xl font-semibold text-system-black-900 lg:mb-6 mb-4;
}
h1 {
	@apply lg:text-[2.625rem] font-semibold text-system-black-900 lg:mb-[2.625rem] mb-4;
}

</style>