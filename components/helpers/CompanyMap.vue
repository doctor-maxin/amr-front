<script lang="ts" setup>
import {GoogleMap} from 'vue3-google-map';
import UiButton from "~/components/ui/UiButton.vue";
import {ref, useRuntimeConfig, watch} from "../../.nuxt/imports";

const runtimeConfig = useRuntimeConfig()

const zoom = ref(12);
const center = ref({lat: 55.9990, lng: 92.8972})
const mapRef = ref(null)

watch(() => mapRef.value?.ready, (ready) => {
	if (!ready) return

	// do something with the api using `mapRef.value.api`
	// or with the map instance using `mapRef.value.map`
})

const openMap = () => {
	console.log(mapRef.value?.map)
}
</script>

<template>
	<div class="w-full h-full relative">
		<ClientOnly>
			<GoogleMap ref="mapRef" :api-key="runtimeConfig.public.apiSecret" :center="center" :fullscreen-control="false" :map-type-control="false"
			           :zoom="zoom" class="map grayscale-[50%]" :zoom-control="false" :draggable="false" :street-view-control="false">
				<template #default="{ ready, api, map, mapTilesLoaded }">
					<UiButton v-if="ready" @click="openMap()" variant="dark" class="absolute map-btn top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 map-btn" title="Мы на карте" />
				</template>
			</GoogleMap>
		</ClientOnly>
	</div>
</template>

<style lang="scss">
.map {
	position: relative;
	width: 100%;
	height: 100%;
}
.map-btn {
	padding-top: 0.75rem;
	padding-bottom: 0.75rem;

	span {
	font-size: 1rem;
		line-height: 1.25rem;
		font-weight: 500;
	}
}
</style>