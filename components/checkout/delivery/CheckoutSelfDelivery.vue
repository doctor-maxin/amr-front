<script setup lang="ts">
import {
	ref,
	useAppConfig,
	useAsyncData,
	useDeviceWidth,
	useDirectusItems,
	useField,
	useListen,
	watch,
} from "../../../.nuxt/imports";
import { IStore } from "../../../types/common";
import UiButton from '../../ui/UiButton.vue'
import CheckoutSelfDeliveryBalloon from "./CheckoutSelfDeliveryBalloon.vue";

const { mapCenter } = useAppConfig();
const { getItems } = useDirectusItems();
const points = ref<IStore[]>([]);
const center = ref(mapCenter)
const zoom = ref(12)

const bounds = ref<any[]>([]);
const map = ref<any>(null);

const { data: stores } = useAsyncData(() =>
	getItems<IStore>({
		collection: "stores",
	})
);


const loadItems = async (map) => {
	// const res = await window.ymaps.geoXml.load(
	// 	"http://furnitur.ru/upload/files/zmap.kml"
	// );
	// map.geoObjects.add(res.geoObjects);
	// if (res.mapState) {
	// 	res.mapState.applyToMap(map);
	// }
	// map.geoObjects.events.add("click", clicked);
};
const isOpen = ref(false)

const { value: deliveryPointId, handleChange } = useField("deliveryPointId");
const { value: address, handleChange: handleChangeAddress } =
	useField("deliveryPointId");

useListen("setDeliveryPoint", (store: IStore) => {
	handleChange(store.id);
	isOpen.value = false;
	handleChangeAddress(store.address);
	center.value = [store.lat, store.long]
	zoom.value = 15

});

watch(
	stores,
	() => {
		if (stores.value?.length) {
			bounds.value = stores.value.map((item) => [item.lat, item.long]);
			points.value = stores.value;

			if (!deliveryPointId.value) {
				handleChange(stores.value[0].id)
				handleChangeAddress(stores.value[0].address);
				center.value = [stores.value[0].lat, stores.value[0].long]
				zoom.value = 15
			}
		}
	},
	{
		deep: true,
		immediate: true,
	}
);


onMounted(() => {

})

const { isTablet } = useDeviceWidth()
</script>

<template>
	<div class="w-screen max-w-full lg:aspect-video">
		<vee-field name="deliveryPointId" v-model="deliveryPointId" hidden />
		<vee-field name="address" v-model="address" hidden />

		<UiButton v-if="isTablet" class="w-full" title-class="text-center w-full block" title="Выбрать пункт"
			@click="isOpen = true" />

		<Transition name="fade">

			<div v-if="isTablet ? isOpen : true"
				class="fixed lg:static overscroll-contain lg:w-auto top-0 h-[100dvh] lg:h-auto lg:aspect-video w-screen items-end flex lg:items-center justify-center left-0 z-30 lg:backdrop-brightness-100 backdrop-brightness-50">
				<div
					class="bg-white lg:w-full lg:h-full lg:p-0 lg:bg-transparent w-screen relative h-screen max-h-[90dvh] max-w-[68.75rem] lg:max-h-[34.375rem] rounded-t-[1rem] lg:rounded-[2rem]">
					<client-only>
						<yandex-map class="w-full h-full overflow-hidden rounded-[1.125rem]" v-if="bounds.length"
							:zoom="zoom" :coordinates="center" ref="map" @created="loadItems">
							<yandex-marker v-for="point of points" :key="point.id" :marker-id="point.id" type="Point"
								:properties="{
									hintContent: point.name,
								}" :coordinates="[point.lat, point.long]">
								<template #component>
									<CheckoutSelfDeliveryBalloon :point="point" />
								</template>
							</yandex-marker>
						</yandex-map>
					</client-only>
					<button class="text-white lg:hidden absolute xl:-right-8 -top-10 xl:-top-8 right-3 z-10"
						@click="isOpen = false">
						<svgo-close filled class="text-4xl" />
					</button>
				</div>
			</div>
		</Transition>
		<div v-if="address" class="mt-5 font-semibold">
			Точка самовывоза: <span class="font-medium">{{ address }}</span>
		</div>
	</div>
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

.ymaps-2-1-79-balloon__content>ymaps {
	height: auto !important;
}
</style>
