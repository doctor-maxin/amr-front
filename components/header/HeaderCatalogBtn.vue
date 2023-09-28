<script lang="ts" setup>
import CatalogIcon from "~/assets/icons/catalog.svg";
import { normalizeProps, useMachine } from "@zag-js/vue";
import * as popover from "@zag-js/popover";
import MainCatalog from "~/components/header/MainCatalog.vue";
import { computed, ref, useEvent, useListen, watch } from "~/.nuxt/imports";

const [state, send] = useMachine(
	popover.machine({
		id: "mainCatalog",
		modal: true,
		portalled: true,
	})
);
const api = computed(() => popover.connect(state.value, send, normalizeProps));
const catalogBtn = ref(null);

useListen("close-modals", () => {
	api.value.close();
});
useListen("open:menu", (id: string) => {
	if (id !== state.value.context.id) api.value.close();
});
watch(
	() => api.value.isOpen,
	() => {
		if (api.value.isOpen) useEvent("open:menu", state.value.context.id);
	}
);

defineExpose({ catalogBtn });
</script>

<template>
	<div class="h-full">
		<button
			ref="catalogBtn"
			v-bind="api.triggerProps"
			class="hidden lg:flex gap-[0.88rem] h-full items-center px-9 bg-system-gray-600"
		>
			<CatalogIcon />
			<span class="font-semibold">Каталог</span>
		</button>
		<ClientOnly>
			<MainCatalog :api="api" :catalog-btn="catalogBtn" />
		</ClientOnly>
	</div>
</template>

<style scoped></style>
