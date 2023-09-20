<script setup lang="ts">
import { computed } from "../../../.nuxt/imports";

const props = defineProps<{
	date: string;
}>();

const dateFormat = computed(() => new Date(props.date ? props.date : ""));
</script>

<template>
	<div
		class="card flex w-full lg:justify-between text-system-black-900 lg:items-center flex-col lg:flex-row gap-1"
	>
		<span class="font-medium lg:text-xl">Дата оформления заказа</span>
		<span class="font-semibold lg:text-xl" v-if="date"
			>{{
				new Intl.DateTimeFormat("ru-RU", {
					month: "long",
					year: "numeric",
					day: "numeric",
				}).format(dateFormat)
			}}
			{{
				new Intl.DateTimeFormat("ru-RU", {
					hour: "numeric",
					minute: "numeric",
				}).format(dateFormat)
			}}
		</span>
	</div>
</template>

<style scoped></style>
