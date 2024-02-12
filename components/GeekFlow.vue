<script setup lang="ts">
defineProps<{
	dark?: boolean
	light?: boolean
}>()
</script>

<template>
<div class="p-[14px] flex items-center justify-center" :class="{
	'bg-[hsl(0,_0%,_9%)]': dark,
	'bg-[hsla(0,_0%,_95%,_0.5)]': light,
}">
	<img :src="dark ? '/gf-dark.svg' : '/gf-light.svg'" alt="Сделали и согласовали в GeekFlow" />
</div>
</template>

<style scoped>

</style>