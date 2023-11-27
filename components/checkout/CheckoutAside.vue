<script setup lang="ts">
import { CartPopulatedItem } from "../../types/cart";
import { useCartStore } from "../../store/cart.store";
import { storeToRefs } from "pinia";
import { useCurrency } from "../../composables/useCurrency";
import {
	computed,
	useAppConfig,
	useRouter,
	ref,
	useDirectusItems,
	useEvent,
	useRuntimeConfig,
	watch,
	useDirectusToken,
} from "../../.nuxt/imports";
import UiButton from "../ui/UiButton.vue";
import PromocodeForm from "~/components/forms/PromocodeForm.vue";
import { toast } from "vue3-toastify";
import { ICheckoutPayload } from "~/server/types/checkout.types";

const cartStore = useCartStore();
const { delivery, discount } = storeToRefs(cartStore);
const appConfig = useAppConfig();
const router = useRouter();
const isLoading = ref<boolean>(false);
const { createItems } = useDirectusItems();
const runtimeConfig = useRuntimeConfig();
//@ts-ignore
const baseUrl = runtimeConfig.public?.directus?.url as string;
const { token } = useDirectusToken();

const props = defineProps<{
	lines: Map<string, CartPopulatedItem>;
	isValid?: boolean;
	validate: any;
	values: any;
	setFieldError: (field: string, message: string) => void;
}>();

const { toMoney } = useCurrency();

const sum = ref<number>(0);
watch(
	() => props.lines,
	() => {
		let amount = 0;
		for (const line of props.lines.values()) {
			amount += line.product.price * line.count;
		}
		sum.value = amount;
	},
	{
		immediate: true,
		deep: true,
	}
);

const discountAmount = computed(() => {
	if (!discount.value) return 0;

	if (discount.value.type === "fixed") {
		return discount.value.value;
	} else if (discount.value.type === "percentage") {
		return (sum.value * discount.value.value) / 100;
	}
	return 0;
});

const total = computed(() => {
	let amount = Number(sum.value);
	if (delivery.value.calculated) amount += Number();
	if (discountAmount.value) amount -= discountAmount.value;
	return amount;
});

const createOrder = props.validate(async () => {
	isLoading.value = true;
	const payload: { id: string; count: number }[] = [];
	for (const item of Array.from(props.lines.values())) {
		payload.push({
			id: item.id,
			count: item.count,
		});
	}
	const response = await fetch(baseUrl + "/api/cart/check", {
		method: "post",
	});
	if (!response.ok) {
		const result = await response.json();
		for (const id of result) {
			const item = props.lines.get(id);
			if (!item) continue;

			toast.error(`${item.product.name} доступно ${item.product.count}`);
		}
	} else {
		const data = {
			...props.values,
			items: payload,
			promocodes: discount.value ? discount.value : "",
			deliveryPrice: delivery.value.amount,
			deliveryType: delivery.value.type,
		} satisfies ICheckoutPayload;
		const headers = {
			"Content-Type": "application/json",
		};
		if (token.value) headers["Authorization"] = `Bearer ${token.value}`;

		const response = await fetch("/api/checkout", {
			method: "post",
			body: JSON.stringify(data),
			headers,
		});
		const responseData = await response.json();
		if (response.status === 200) {
			window.location.href = responseData.location;
		} else if (response.status !== 200) {
			console.error(responseData);
			toast.error(responseData.message);
		}
	}
	isLoading.value = false;
});

const getItemImage = (item: any): string => {
	if (item.product?.images?.[0].directus_files_id)
		return item.product.images[0].directus_files_id;
	return appConfig.noImageId as string;
};
</script>

<template>
	<aside
		class="rounded-[1.25rem] lg:sticky lg:top-[5.3125rem] text-system-gray-800 bg-system-gray-500 px-[1.135rem] pt-[1.69rem] pb-[2.375rem] flex flex-col gap-3"
	>
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
		<PromocodeForm />
		<div class="flex justify-between gap-2 lg:text-lg">
			<span class="font-medium">Промежуточный итог</span>
			<span class="text-right font-bold whitespace-nowrap">{{
				toMoney(sum)
			}}</span>
		</div>
		<!-- <div
			v-if="delivery.calculated"
			class="flex justify-between gap-2 lg:text-lg"
		>
			<span class="font-medium">Доставка</span>
			<span class="text-right font-bold whitespace-nowrap">{{
				toMoney(delivery.amount)
			}}</span>
		</div> -->
		<div v-if="discount" class="flex justify-between gap-2 lg:text-lg">
			<span class="font-medium">Скидка</span>
			<span class="text-right font-bold whitespace-nowrap"
				>-{{ toMoney(discountAmount) }}</span
			>
		</div>
		<div class="flex lg:mt-4 justify-between lg:text-xl gap-2">
			<span class="font-bold">Итого</span>
			<span class="text-right font-bold whitespace-nowrap">{{
				toMoney(total)
			}}</span>
		</div>
		<UiButton
			@click="createOrder"
			class="fixed lg:mt-2 lg:static bottom-4 z-20 left-4 w-[calc(100%_-_2rem)] lg:w-full"
			type="button"
			variant="dark"
			title="Оформить заказ"
			title-class="!text-base"
			:disabled="isLoading"
			:class="{
				'pulse cursor-progress': isLoading,
			}"
		/>
	</aside>
</template>

<style scoped></style>
