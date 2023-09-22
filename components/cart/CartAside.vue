<script setup lang="ts">
import { CartPopulatedItem } from "../../types/cart";
import { useCartStore } from "../../store/cart.store";
import { storeToRefs } from "pinia";
import { useCurrency } from "../../composables/useCurrency";
import {
	computed,
	useAppConfig,
	useRouter,
	ref, useCartFetch
} from "../../.nuxt/imports";
import UiButton from "../ui/UiButton.vue";
import PromocodeForm from "~/components/forms/PromocodeForm.vue";
import { useRuntimeConfig } from "#imports";

const cartStore = useCartStore();
const { delivery, discount } = storeToRefs(cartStore);
const appConfig = useAppConfig();
const router = useRouter();
const isLoading = ref<boolean>(false);
const {client} = useCartFetch()
const runtimeConfig = useRuntimeConfig()
//@ts-ignore
const baseUrl = runtimeConfig.public?.directus?.url as string

const props = defineProps<{
	lines: Map<string, CartPopulatedItem>;
	setFieldError: (field: string, message: string) => void;
}>();

const { toMoney } = useCurrency();

const sum = computed<number>(() => {
	let sum = 0;
	for (const line of props.lines.values()) {
		sum += line.product.price;
	}
	return sum;
});

const discountAmount = computed(() => {
	if (!discount.value) return 0;

	if (discount.value.type === 'fixed') {
		return discount.value.value
	} else if (discount.value.type === 'percentage') {
		return sum * discount.value.value / 100
	}
	return 0;
})

const total = computed(() => {
	let amount = sum.value;
	if (delivery.value.calculated) amount += delivery.value.amount;
	if (discountAmount.value) amount -= discountAmount.value;
	return amount;
});

const toCheckout = async () => {
	isLoading.value = true;
	const payload: { id: string; count: number }[] = [];
	for (const item of Array.from(props.lines.values())) {
		payload.push({
			id: item.id,
			count: item.count + 1,
		});
	}
	const response = await fetch(baseUrl + "/api/cart/check", {
		method: "post",
	});
	if (!response.ok) {
		const result = await response.json();
		for (const id of result) {
			props.setFieldError(
				`product-${id}`,
				appConfig.messages.productSoldOut
			);
		}
	} else {
		router.push("/checkout");
	}
	isLoading.value = false;
};
</script>

<template>
	<aside
		class="rounded-[1.25rem] lg:sticky lg:top-[5.3125rem] flex-1 text-system-gray-800 bg-system-gray-500 px-[1.135rem] pt-[1.69rem] pb-[2.375rem] flex flex-col gap-3"
	>
		<div class="flex justify-between gap-2 lg:text-lg">
			<span class="font-medium">Промежуточный итог</span>
			<span class="text-right font-bold whitespace-nowrap">{{
				toMoney(sum)
			}}</span>
		</div>
		<div
			v-if="delivery.calculated"
			class="flex justify-between gap-2 lg:text-lg"
		>
			<span class="font-medium">Доставка</span>
			<span class="text-right font-bold whitespace-nowrap">{{
				toMoney(delivery.amount)
			}}</span>
		</div>
		<div
			v-if="discount"
			class="flex justify-between gap-2 lg:text-lg"
		>
			<span class="font-medium">Скидка</span>
			<span class="text-right font-bold whitespace-nowrap">{{
				toMoney(discountAmount)
			}}</span>
		</div>
		<div class="flex lg:mt-4 justify-between lg:text-xl gap-2">
			<span class="font-bold">Итого</span>
			<span class="text-right font-bold whitespace-nowrap">{{
				toMoney(total)
			}}</span>
		</div>
		<UiButton
			@click="toCheckout"
			class="fixed lg:mt-2 lg:static bottom-4 z-20 left-4 w-[calc(100%_-_2rem)] lg:w-full"
			type="button"
			variant="dark"
			title="Перейти к оформлению"
			title-class="!text-base"
			:disabled="isLoading"
			:class="{
				'pulse cursor-progress': isLoading,
			}"
		/>
	</aside>
</template>

<style scoped></style>
