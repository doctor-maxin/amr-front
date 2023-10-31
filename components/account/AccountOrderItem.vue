<template>
	<div
		class="bg-system-gray-500 py-7 px-6 rounded-[1.25rem]"
		v-bind="api.getItemProps({ value: order.id })"
	>
		<div
			class="flex justify-between lg:grid grid-cols-5 lg:-mx-6 items-center text-system-black-950 text-lg font-semibold"
		>
			<div class="flex gap-2 lg:gap-[2.125rem] items-center lg:pl-6">
				<button v-bind="api.getItemTriggerProps({ value: order.id })">
					<svgo-sqard-arrow
						@click="openItem"
						class="text-2xl"
						filled
					/>
				</button>
				<span>#{{ order?.number }}</span>
			</div>
			<div>{{ new Date(order.date_created).toLocaleDateString() }}</div>
			<div class="hidden lg:block font-semibold text-lg">
				{{ order.items.reduce((acc, item) => (acc += item.count), 0) }}
			</div>
			<div class="hidden lg:block font-semibold text-lg">
				{{ toMoney(order.total) }}
			</div>
			<div class="hidden lg:block font-semibold text-lg">
				{{ status }}
			</div>
		</div>
		<div
			v-if="!api.getItemContentProps({ value: order.id })?.hidden"
			v-bind="api.getItemContentProps({ value: order.id })"
			class="flex flex-col gap-7"
		>
			<div
				class="rounded-[1.25rem] mt-7 lg:mt-12 bg-system-gray p-6 lg:px-14 flex flex-col gap-4 lg:grid lg:grid-cols-5"
			>
				<div
					class="text-sm lg:text-base font-semibold flex flex-col gap-2 lg:gap-8 lg:col-span-2 lg:pr-4"
				>
					<span class="text-system-black-950 text-opacity-50"
						>Адрес доставки</span
					>
					<span class="lg:text-lg">
						{{ getOrderAddress }}
					</span>
				</div>
				<div
					class="text-sm font-semibold flex flex-col gap-2 lg:-ml-6 lg:gap-8 lg:text-base"
				>
					<span class="text-system-black-950 text-opacity-50"
						>Способ доставки</span
					>
					<span class="lg:text-lg">
						{{
							order.deliveryType === DeliveryTypes.delivery
								? "Доставка"
								: "Самовывоз"
						}}
					</span>
				</div>
				<div
					class="text-sm font-semibold flex flex-col gap-2 lg:gap-8 lg:pl-2"
				>
					<span
						class="text-system-black-950 text-opacity-50 lg:text-base"
						>Способ оплаты</span
					>
					<span class="lg:text-lg">
						{{ getPaymentType(order.paymentType) }}
					</span>
				</div>
			</div>
			<div
				class="rounded-[1.25rem] bg-system-gray p-6 lg:pb-14 lg:px-14 flex flex-col gap-4 lg:gap-8"
			>
				<div
					class="text-sm font-semibold flex flex-col gap-4 lg:text-base lg:grid lg:grid-cols-5"
				>
					<span
						class="text-system-black-950 text-opacity-50 lg:col-span-3"
						>Товар</span
					>
					<span
						class="text-system-black-950 hidden lg:pl-2 lg:block text-opacity-50"
						>Количество</span
					>
					<span
						class="text-system-black-950 hidden lg:pl-9 lg:block text-opacity-50"
						>Сумма</span
					>
				</div>
				<AccountOrderItemProducts :list="order.items" />
			</div>
			<div
				class="bg-system-gray lg:text-lg lg:grid grid-cols-2 rounded-[1.25rem] -mx-6 px-4 py-8 mt-7 -mb-7 lg:bg-transparent lg:mt-3.5 lg:mx-0 lg:pb-12 lg:px-14 lg:pt-0"
			>
				<div class="gap-3 flex flex-col lg:max-w-[29rem]">
					<div class="flex justify-between">
						<span class="font-medium">Промежуточный итог</span>
						<span class="font-semibold">{{
							toMoney(
								order.total -
									Number(order.deliveryPrice ?? 0) -
									Number(order.discountedPrice ?? 0),
							)
						}}</span>
					</div>
					<div class="flex justify-between">
						<span class="font-medium">Доставка</span>
						<span class="font-semibold">{{
							toMoney(order.deliveryPrice ?? 0)
						}}</span>
					</div>
					<div class="flex justify-between">
						<span class="font-medium">Скидка</span>
						<span class="font-semibold">{{
							toMoney(order.discountedPrice ?? 0)
						}}</span>
					</div>
					<div class="flex justify-between lg:hidden">
						<span class="font-bold">Итого</span>
						<span class="font-semibold">{{
							toMoney(order.total)
						}}</span>
					</div>
				</div>
				<div class="lg:grid grid-cols-2 hidden justify-between">
					<span class="font-bold text-right">Итого</span>
					<span class="font-semibold text-center">{{
						toMoney(order.total)
					}}</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { IOrder, IPaymentType } from "../../types/common";
import { Api } from "@zag-js/accordion";
import {
	computed,
	useAsyncData,
	useCurrency,
	useDirectusItems,
	useNuxtData,
} from "../../.nuxt/imports";
import { DeliveryTypes } from "../../types/cart";
import { PaymentTypes } from "../../server/types/checkout.types";
import AccountOrderItemProducts from "./AccountOrderItemProducts.vue";

const props = defineProps<{
	order: IOrder;
	api: Api;
}>();

const openItem = () => {
	console.log(props.api);
};

const status = computed(() => {
	if (props.order.status.toLowerCase() === "new") return "Новый";
	if (props.order.status.toLowerCase() === "preparation")
		return "Подготовка бумаг";
	if (props.order.status.toLowerCase() === "prepayment_invoic")
		return "Отправка счета";
	if (props.order.status.toLowerCase() === "executing")
		return "В процессе выполнения";
	if (props.order.status.toLowerCase() === "final_invoice")
		return "Финальный счет";
	if (props.order.status.toLowerCase() === "won") return "Завершено";
	return "Отменено";
});

const { data: paymentTypes } = useNuxtData("paymenttypes");
const { toMoney } = useCurrency();
const getPaymentType = (paymentType: PaymentTypes) => {
	const item = paymentTypes.value?.find((item) => item.type === paymentType);
	return item ? item.title : "Неизвестно";
};
const getOrderAddress = computed(() => {
	let str = "";

	if (props.order.city)
		str += props.order.city.startsWith("г.")
			? props.order.city
			: `г. ${props.order.city}`;
	if (props.order.street)
		str += props.order.street.startsWith("ул.")
			? ", " + props.order.street
			: `, ул. ${props.order.street}`;

	if (props.order.house)
		str += props.order.house.startsWith("д.")
			? ", " + props.order.house
			: `, д. ${props.order.house}`;

	if (props.order.flat)
		str += props.order.flat.startsWith("кв.")
			? ", " + props.order.flat
			: `, кв. ${props.order.flat}`;

	if (props.order.floor) str += `, этаж ${props.order.floor}`;

	if (props.order.entrance) str += `, подъезд ${props.order.entrance}`;
	return str;
});
</script>

<style scoped lang="scss">
[data-part="item-trigger"][data-state="open"] {
	@apply rotate-180;
	svg {
		margin-bottom: 0;
	}
	/* styles for the item is open or closed state */
}

[data-part="item-trigger"] {
	@apply transition-transform;
	svg {
		margin-bottom: 0;
	}
}
</style>
