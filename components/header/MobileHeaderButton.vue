<script lang="ts" setup>
import { normalizeProps, useMachine } from "@zag-js/vue";
import * as popover from "@zag-js/popover";
import { Teleport } from "vue";
import MainMenuMobile from "~/components/header/MainMenuMobile.vue";
import { computed, useEvent, useListen } from "../../.nuxt/imports";
import { watch } from "#imports";

const [state, send] = useMachine(
	popover.machine({
		id: "mainMenuMobile",
		modal: true,
	})
);
const api = computed(() => popover.connect(state.value, send, normalizeProps));

useListen("close-modals", () => api.value.close());
useListen("open:menu", (id: string) => {
	if (id !== state.value.context.id) api.value.close();
});
watch(
	() => api.value.isOpen,
	() => {
		if (api.value.isOpen) useEvent("open:menu", state.value.context.id);
	}
);
</script>

<template>
	<div class="lg:hidden">
		<button type="button" v-bind="api.triggerProps">
			<div
				class="bg-system-gray-600 flex items-center justify-center w-[3.875rem] relative lg:w-[5.3125rem] h-[3.875rem] lg:h-[5.3125rem]"
			>
				<div
					:class="{
						'items-center': api.isOpen,
					}"
					class="flex flex-col gap-2"
				>
					<div
						:class="{
							' rotate-45 absolute w-[2.125rem]': api.isOpen,
							' w-7': !api.isOpen,
						}"
						class="h-0.5 transition bg-system-gray-800"
					></div>
					<div
						:class="{
							' -rotate-45 absolute': api.isOpen,
							' w-7': !api.isOpen,
						}"
						class="h-0.5 transition bg-system-gray-800 w-[2.125rem]"
					></div>
				</div>
			</div>
		</button>
		<ClientOnly>
			<Teleport to="header">
				<MainMenuMobile :api="api" />
			</Teleport>
		</ClientOnly>
	</div>
</template>

<style scoped></style>
