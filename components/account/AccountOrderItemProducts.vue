<template>
	<div v-for="item of lines" :key="item.id">
		<div class="lg:grid grid-cols-5">
		<nuxt-link :to="`/catalog${item.product?.handle ?? ''}`" class="flex gap-5 lg:gap-7	lg:col-span-3">
			<NuxtImg
				:src="getItemImage(item)"
				provider="directus"
				width="70"
				fit="contain"
				class="w-[70px] min-w-[70px] h-[70px] object-contain rounded-[10px] bg-white"
			/>
			<div
				class="flex font-semibold flex-col text-base text-system-black-950 gap-[2px]"
			>
				<span class="lg:text-lg">{{ item.product?.name }}</span>
				<span class="lg:hidden">{{ toMoney(item.product?.price ? item.product.price * item.count : 0) }}</span>
				<span class="lg:hidden">{{ item.count }} шт.</span>
			</div>
		</nuxt-link>
		<div class="hidden font-semibold text-lg lg:block pl-5">{{ item.count }} шт.</div>
		<div class="hidden font-semibold text-lg lg:block pl-14">{{ toMoney(item.product?.price ? item.product.price * item.count : 0) }}</div>
	</div>
	</div>
</template>

<script setup lang="ts">
import { IProduct, IProductPicked } from "~/types/product";
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

const products = await getItems<IProductPicked>({
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
