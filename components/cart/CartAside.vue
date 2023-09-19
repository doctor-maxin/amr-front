<script setup lang="ts">
import { CartPopulatedItem } from "../../types/cart";
import { useCartStore } from "../../store/cart.store";
import { storeToRefs } from "pinia";
import { useCurrency } from "../../composables/useCurrency";
import { computed, useAppConfig, useEvent, useField, useFieldError, useFieldValue, useRouter } from "../../.nuxt/imports";
import UiButton from "../ui/UiButton.vue";
import { useFetch } from "@vueuse/core";
import { toast } from "vue3-toastify";
import { number } from "yup";

const cartStore = useCartStore();
const { delivery, discount } = storeToRefs(cartStore);
const appConfig = useAppConfig();
const router = useRouter();

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

const total = computed(() => {
	let amount = sum.value;
	if (delivery.value.calculated) amount += delivery.value.amount;
	if (discount.value.promoCode) amount -= discount.value.amount;
	return amount;
});

const toCheckout = async () => {
	const payload: { id: string; count: number }[] = [];
	for (const item of Array.from(props.lines.values())) {
		payload.push({
			id: item.id,
			count: item.count + 1,
		});
	}
	const response = await fetch("/api/cart/check", {
		method: "post",
	})
	if (!response.ok) {
		const result = await response.json();
		for (const id of result) {
			props.setFieldError(`product-${id}`, appConfig.messages.productSoldOut)
		}
	} else {
		router.push("/checkout");
	}
};
</script>

<template>
	<aside
		class="rounded-[1.25rem] flex-1 text-system-gray-800 bg-system-gray-500 px-[1.135rem] pt-[1.69rem] pb-[2.375rem] flex flex-col gap-3"
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
			v-if="discount.promoCode"
			class="flex justify-between gap-2 lg:text-lg"
		>
			<span class="font-medium">Скидка</span>
			<span class="text-right font-bold whitespace-nowrap">{{
				toMoney(discount.amount)
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
		/>
	</aside>
</template>

<style scoped></style>
