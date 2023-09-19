<script setup lang="ts">
import { useDirectusItems } from "../../.nuxt/imports";
import { ref, computed } from "../../.nuxt/imports";
import { useListen } from "../../composables/useEventBus";
import { IStore } from "~/types/common";
import * as dialog from "@zag-js/dialog";
import { normalizeProps, useMachine } from "@zag-js/vue";
import UiSpinner from "../ui/UiSpinner.vue";

const { getItems } = useDirectusItems();
const bounds = ref<any[]>([]);
const points = ref<IStore[]>([]);
const { mapCenter } = useAppConfig();
const [state, send] = useMachine(dialog.machine({ id: "map" }));
const api = computed(() => dialog.connect(state.value, send, normalizeProps));
const map = ref<any>(null);

useListen("open-map", async () => {
	api.value.open();
	const stores = await getItems<IStore>({
		collection: "stores",
	});
	if (stores.length >= 2)
		bounds.value = stores.map((item) => [item.lat, item.long]);
	points.value = stores;
});
</script>
<template>
	<ClientOnly>
		<Transition name="fade">
			<div
				v-if="api.isOpen"
				v-bind="api.backdropProps"
				class="fixed overscroll-contain top-0 h-[100dvh] w-screen items-end flex lg:items-center justify-center left-0 z-30 backdrop-brightness-50"
			>
				<div
					v-bind="api.containerProps"
					class="bg-white w-screen relative h-screen max-h-[90vh] max-w-[68.75rem] lg:max-h-[34.375rem] rounded-t-[1rem] lg:rounded-[2rem] lg:p-9"
				>
					<Transition name="fade">
						<yandex-map
							class="w-full h-full overflow-hidden"
							v-if="bounds.length"
							:coordinates="mapCenter"
							ref="map"
						>
							<yandex-marker
								v-for="point of points"
								:key="point.id"
								:marker-id="point.id"
								type="Point"
								:coordinates="[point.lat, point.long]"
							>
							</yandex-marker>
						</yandex-map>
					</Transition>
					<div
						v-if="!bounds || !bounds.length"
						class="absolute top-0 left-0 rounded-[2rem] h-full flex items-center justify-center bg-white w-full"
					>
						<UiSpinner />
					</div>
					<button
						class="text-white absolute xl:-right-8 -top-10 xl:-top-8 right-3 z-10"
						v-bind="api.closeTriggerProps"
					>
						<svgo-close filled class="text-4xl" />
					</button>
				</div>
			</div>
		</Transition>
	</ClientOnly>
</template>
