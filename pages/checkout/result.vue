<script setup lang="ts">
import {
	markRaw,
	useAsyncData,
	useDirectusItems,
	useUrlSearchParams,
	useHead
} from "../../.nuxt/imports";
import { IBreadCrumb, ILink, IOrder } from "../../types/common";
import PageHeader from "../../components/page/Header.vue";
import CheckoutOrderDate from "~/components/checkout/order/CheckoutOrderDate.vue";
import CheckoutOrderPayment from "~/components/checkout/order/CheckoutOrderPayment.vue";
import CheckoutOrderDelivery from "~/components/checkout/order/CheckoutOrderDelivery.vue";
import CheckoutOrderTotals from "~/components/checkout/order/CheckoutOrderTotals.vue";
import CheckoutOrderInfo from "~/components/checkout/order/CheckoutOrderInfo.vue";
import { useCartStore } from "../../store/cart.store";
import fetchSeo from "~/composables/fetchSeo";

useHead({
	title: 'Результат оформления заказа'
})
await fetchSeo()


const cartStore = useCartStore()
const breadCrumbs = markRaw<IBreadCrumb[]>([
	{
		title: "Корзина",
		path: "/cart",
	},
	{
		title: "Оформление",
		path: "/checkout",
	},
	{
		title: "Оплата",
		path: "/",
	},
]);

const backLink = {
	path: "back",
	title: "Продолжить покупки",
} satisfies ILink;
const params = useUrlSearchParams("history", {
	initialValue: {
		orderId: "",
		status: "fail",
	},
});
const { getItemById } = useDirectusItems();
const { data: order } = await useAsyncData(() =>
	getItemById<IOrder>({
		collection: "orders",
		id: params.orderId?.toString(),
	})
);

if (params.status === 'success') cartStore.clearCart()
</script>

<template>
	<PageHeader :bread-crumbs="breadCrumbs" :link="backLink" page-name="Корзина" progress />
	<div class="max-w-[92.375rem] lg:mx-auto pt-[2.375rem] pb-[1.56rem] lg:pb-[8.75rem] lg:pt-[4.62rem] flex-1">
		<main v-if="order"
			class="lg:items-start max-w-[54rem] gap-7 w-screen gap-[2.75rem] lg:gap-[1.875rem] flex-col justify-center flex px-4 bg-white">
			<CheckoutOrderInfo :status="params.status" :order="order" />
			<CheckoutOrderDate v-if="order.date_created" :date="order.date_created" />
			<CheckoutOrderPayment v-if="order.paymentType" :payment-type="order.paymentType" />
			<CheckoutOrderDelivery v-if="order.deliveryType" :delivery-type="order.deliveryType" />
			<CheckoutOrderTotals v-if="order?.id" :order="order" />
		</main>
	</div>
</template>

<style scoped></style>
