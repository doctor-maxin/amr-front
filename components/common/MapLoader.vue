<script setup lang="ts">
import { useAppConfig, useDirectusItems, useNuxtData } from "../../.nuxt/imports";
import { ref, computed } from "../../.nuxt/imports";
import { useListen } from "../../composables/useEventBus";
import { ISettings, IStore } from "~/types/common";
import * as dialog from "@zag-js/dialog";
import { normalizeProps, useMachine } from "@zag-js/vue";
import UiSpinner from "../ui/UiSpinner.vue";
import TelLink from "~/components/helpers/TelLink.vue";
import EmailLink from "~/components/helpers/EmailLink.vue";

const { getItems } = useDirectusItems();
const points = ref<IStore[]>([]);
const { mapCenter } = useAppConfig();
const [state, send] = useMachine(dialog.machine({ id: "map" }));
const api = computed(() => dialog.connect(state.value, send, normalizeProps));
const map = ref<any>(null);
const { data: settings } = useNuxtData<ISettings>("settings");

useListen("open-map", async () => {
	api.value.open();
	const stores = await getItems<IStore>({
		collection: "stores",
	});
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
					class="bg-white w-screen relative h-screen max-h-[90dvh] max-w-[68.75rem] lg:max-h-[34.375rem] rounded-t-[1rem] lg:rounded-[2rem] lg:p-9"
				>
					<Transition name="fade">
						<yandex-map
							class="w-full h-full overflow-hidden"
							v-if="points.length"
							:coordinates="mapCenter"
							ref="map"
						>
							<yandex-marker
								v-for="point of points"
								:key="point.id"
								:marker-id="point.id"
								type="Point"
								:properties="{
									hintContent: point.name,
								}"
								:coordinates="[point.lat, point.long]"
							>
							<template #component>
								<div class="flex flex-col gap-2">
									<h4 class="text-2xl">{{ point.name }}</h4>
									<span class="mb-2 text-base">{{ point.address }}</span>
									<div class="flex flex-col gap-1">
									<span class="address-header">Поддержка</span>
									<EmailLink :email="settings?.Email" />
									<TelLink :tel="settings?.phone" />
								</div>
								</div>
							</template>
							</yandex-marker>
						</yandex-map>
					</Transition>
					<div
						v-if="!points || !points.length"
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

<style>
.yandex-balloon {
	min-height: 150px;
	height: auto;
	width: 200px;
}
.ymaps-2-1-79-balloon__content {
	height: auto !important;
}
.ymaps-2-1-79-balloon__content > ymaps {
	height: auto !important;
}
</style>
