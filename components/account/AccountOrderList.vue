<template>
	<div class="grid grid-cols-1 gap-7" v-bind="api.rootProps">
		<div class="hidden lg:grid grid-cols-5 pt-[0.875rem] pb-2 text-system-black-950 text-opacity-50 font-semibold">
			<div class="pl-[5.125rem]">Номер заказа</div>
			<div class="">Дата заказа</div>
			<div class="">Позиций</div>
			<div class="">Сумма</div>
			<div>Статус</div>
		</div>
		<AccountOrderItem
			v-for="item of list"
			:key="item.id"
			:order="item"
			:api="api"
		/>
	</div>
</template>

<script setup lang="ts">
import { IOrder, IPaymentType } from "../../types/common";
import AccountOrderItem from "./AccountOrderItem.vue";
import * as accordion from "@zag-js/accordion";
import { normalizeProps, useMachine } from "@zag-js/vue";
import { computed, useAsyncData, useDirectusItems } from "../../.nuxt/imports";

const { getItems } = useDirectusItems();

await useAsyncData("paymenttypes", () =>
	getItems<IPaymentType>({
		collection: "paymenttypes",
	})
);

const props = defineProps<{
	list: IOrder[];
}>();

const [state, send] = useMachine(
	accordion.machine({
		id: "accountList",
		collapsible: true,
		multiple: false,
		value: [""],
	})
);
const api = computed(() =>
	accordion.connect(state.value, send, normalizeProps)
);
</script>

<style scoped></style>
