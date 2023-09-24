<script setup lang="ts">
import {
	computed,
	ref,
	useAppConfig,
	useCurrency,
	useDirectusItems,
	useRouter,
	watch,
} from "../../../.nuxt/imports";
import { CartPopulatedItem } from "../../../types/cart";
import { IOrder } from "../../../types/common";
import { IProduct } from "../../../types/product";
import UiButton from "../../ui/UiButton.vue";

const props = defineProps<{
	order: IOrder;
}>();
const { getItems } = useDirectusItems();
const lines = ref<Map<string, CartPopulatedItem>>(new Map());

let filters: any = {};
if (props.order.items?.length) {
	filters.id = {
		_in: props.order.items.map((item) => item.id),
	};
}

const products = await getItems<IProduct>({
	collection: "products",
	params: {
		filter: filters,
		fields: ["images.directus_files_id", "name", "handle", "price", "id"],
	},
});

const { toMoney } = useCurrency();
const appConfig = useAppConfig();
const router = useRouter();

watch(
	products,
	() => {
		for (const item of props.order.items) {
			const product = products.find((p) => p.id === item.id);
			if (product)
				lines.value.set(item.id, {
					product,
					...item,
				});
		}
	},
	{
		deep: true,
		immediate: true,
	},
);

const getItemImage = (item: any): string => {
	if (item.product.images?.[0].directus_files_id)
		return item.product.images[0].directus_files_id;
	return appConfig.noImageId as string;
};

const sum = computed<number>(() => {
	let sum = 0;
	for (const line of lines.value.values()) {
		sum += line.product.price;
	}
	return sum;
});
</script>

<template>
	<div
		class="rounded-[1.25rem] w-full lg:sticky lg:top-[5.3125rem] text-system-gray-800 card flex flex-col gap-6"
	>
		<h3 class="lg:text-xl font-semibold">Ваш заказ</h3>
		<div
			v-for="item of lines"
			:key="item[0]"
			class="flex gap-5 mb-1 items-center"
		>
			<NuxtImg
				:src="getItemImage(item[1])"
				class="aspect-square w-[4.375rem] lg:w-[6.25rem] rounded-[0.635rem] object-contain"
				provider="directus"
			/>
			<div
				class="flex font-semibold text-system-black-950 flex-col gap-[2px]"
			>
				<span>{{ item[1].product.name }}</span>
				<span>{{ toMoney(item[1].product.price) }}</span>
				<span>{{ item[1].count }} шт.</span>
			</div>
		</div>
		<div class="flex justify-between gap-2 lg:text-lg">
			<span class="font-medium">Промежуточный итог</span>
			<span class="text-right font-bold whitespace-nowrap">{{
				toMoney(sum)
			}}</span>
		</div>
		<div class="flex justify-between gap-2 lg:text-lg">
			<span class="font-medium">Доставка</span>
			<span class="text-right font-bold whitespace-nowrap">{{
				toMoney(order.deliveryPrice)
			}}</span>
		</div>
		<div
			v-if="order.discountedPrice"
			class="flex justify-between gap-2 lg:text-lg"
		>
			<span class="font-medium">Скидка</span>
			<span class="text-right font-bold whitespace-nowrap"
				>-{{ toMoney(order.discountedPrice) }}</span
			>
		</div>
		<div class="flex lg:mt-4 justify-between lg:text-xl gap-2">
			<span class="font-bold">Итого</span>
			<span class="text-right font-bold whitespace-nowrap">{{
				toMoney(order.total)
			}}</span>
		</div>

		<UiButton
			@click="router.push('/catalog')"
			class="lg:mt-2 z-20 w-full"
			type="button"
			variant="dark"
			title="Продолжить покупки"
			title-class="!text-base"
		/>
	</div>
</template>

<style scoped></style>
