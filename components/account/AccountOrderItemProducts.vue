<template>
	<div v-for="item of lines" :key="item.id">
		<div class="flex gap-5">
			<NuxtImg
				:src="getItemImage(item)"
				provider="directus"
				width="70"
				fit="contain"
				class="w-[70px] min-w-[70px] h-[70px] object-contain rounded-[10px] bg-white"
			/>
			<div
				class="flex font-semibold flex-col text-system-black-950 gap-[2px]"
			>
				<span>{{ item.product.name }}</span>
				<span>{{ toMoney(item.product.price) }}</span>
				<span>{{ item.count }} шт.</span>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import {
	computed,
	useAppConfig,
	useCurrency,
	useDirectusItems,
} from "../../.nuxt/imports";

const props = defineProps<{
	list: {
		id: string;
		count: number;
	}[];
}>();

const { getItems } = useDirectusItems();
const appConfig = useAppConfig();
const { toMoney } = useCurrency();
const getItemImage = (item: any): string => {
	if (item.product.images?.[0].directus_files_id)
		return item.product.images[0].directus_files_id;
	return appConfig.noImageId as string;
};

const products = await getItems({
	collection: "products",
	params: {
		filter: {
			id: {
				_in: props.list.map((item) => item.id),
			},
		},
		fields: [
			"id",
			"handle",
			"image",
			"price",
			"images.directus_files_id",
			"name",
		],
	},
});

const lines = computed(() =>
	props.list.map((item) => {
		const product = products.find((item) => item.id === item.id);
		return {
			...item,
			product,
		};
	})
);
</script>

<style scoped></style>
