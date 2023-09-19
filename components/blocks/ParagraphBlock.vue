<script setup lang="ts">
import {IParagraphBlock} from "../../types/common";

defineProps<{
	block: IParagraphBlock
}>();
</script>

<template>
<p v-html="block.data.text">
</p>
</template>

<style scoped>
p {
	@apply lg:mb-[2.635rem] mb-4 lg:text-[1.125rem] lg:font-semibold text-system-gray-900;
}
</style>