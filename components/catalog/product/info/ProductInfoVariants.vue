<script setup lang="ts">
import { useUrlSearchParams } from "@vueuse/core";
import { IVariant } from "~/types/product";
import { useEvent } from "../../../../composables/useEventBus";
import { useDeviceWidth } from "../../../../composables/useDeviceWidth";
import { onMounted } from "../../../../.nuxt/imports";

const props = defineProps<{
	variants: IVariant[];
}>();

let params = useUrlSearchParams("history", {
	initialValue: {
		variantId: props?.variants[0].id,
	},
});

const selectItem = (item) => {
	useEvent("select:variant", item);
	params.variantId = item.id;
};
const { isTablet } = useDeviceWidth();

onMounted(() => {
	if (params.variantId) {
		const variant = props.variants.find(
			(item) => item.id === params.variantId,
		);
		if (variant) useEvent("select:variant", variant);
	}
});
</script>

<template>
	<div>
		<h2 class="text-lg font-semibold mt-6 mb-4 lg:mb-6">
			Цветовые решения
		</h2>
		<div class="flex gap-3.5 lg:gap-5">
			<div
				v-for="item of variants"
				:key="item.id"
				class="w-[3.375rem] lg:w-[4.5rem] h-[3.375rem] lg:h-[4.5rem] rounded-full"
			>
				<button
					@click="selectItem(item)"
					:class="{
						'border-2 border-solid border-black':
							item.id === params.variantId,
					}"
					v-if="item.type === 'color'"
					class="w-full rounded-full h-full"
					:style="{
						backgroundColor: item.color,
					}"
				/>
				<button
					v-else
					class="rounded-full w-full h-full"
					@click="selectItem(item)"
					:class="{
						'border border-solid border-black':
							item.id === params.variantId,
					}"
				>
					<NuxtImg
						provider="directus"
						:src="item.image"
						:width="isTablet ? 54 : 80"
						:height="isTablet ? 54 : 80"
						fit="cover"
						class="w-full rounded-full h-full"
					/>
				</button>
			</div>
		</div>
	</div>
</template>

<style scoped></style>
