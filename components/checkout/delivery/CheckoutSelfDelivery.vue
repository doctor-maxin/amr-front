<script setup lang="ts">
import {
	ref,
	useAppConfig,
	useAsyncData,
	useDirectusItems,
	useField,
	useListen,
	watch,
} from "../../../.nuxt/imports";
import { IStore } from "../../../types/common";
import CheckoutSelfDeliveryBalloon from "./CheckoutSelfDeliveryBalloon.vue";

const { mapCenter } = useAppConfig();
const { getItems } = useDirectusItems();
const points = ref<IStore[]>([]);

const bounds = ref<any[]>([]);
const map = ref<any>(null);

const { data: stores } = useAsyncData(() =>
	getItems<IStore>({
		collection: "stores",
	})
);

watch(
	stores,
	() => {
		if (stores.value?.length) {
			bounds.value = stores.value.map((item) => [item.lat, item.long]);
			points.value = stores.value;
		}
	},
	{
		deep: true,
		immediate: true,
	}
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

const { value: deliveryPointId, handleChange } = useField("deliveryPointId");
const { value: address, handleChange: handleChangeAddress } =
	useField("deliveryPointId");
useListen("setDeliveryPoint", (store: IStore) => {
	handleChange(store.id);
	handleChangeAddress(store.address);
});
</script>

<template>
	<div class="w-screen max-w-full aspect-video">
		<vee-field name="deliveryPointId" v-model="deliveryPointId" hidden />
		<vee-field name="address" v-model="address" hidden />

		<client-only>
			<yandex-map
				class="w-full h-full overflow-hidden rounded-[1.125rem]"
				v-if="bounds.length"
				:zoom="12"
				:coordinates="mapCenter"
				ref="map"
				@created="loadItems"
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
						<CheckoutSelfDeliveryBalloon :point="point" />
					</template>
				</yandex-marker>
			</yandex-map>
		</client-only>
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
.ymaps-2-1-79-balloon__content > ymaps {
	height: auto !important;
}
</style>
