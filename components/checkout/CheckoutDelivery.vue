<script lang="ts" setup>
import * as tabs from "@zag-js/tabs";
import { normalizeProps, useMachine } from "@zag-js/vue";
import { computed, markRaw, useField, watch } from "../../.nuxt/imports";
import CheckoutDeliverySystem from "~/components/checkout/delivery/CheckoutDeliverySystem.vue";
import CheckoutSelfDelivery from "~/components/checkout/delivery/CheckoutSelfDelivery.vue";
import { DeliveryTypes } from "../../types/cart";

const [state, send] = useMachine(
	tabs.machine({
		id: "checkoutTabs",
		value: DeliveryTypes.delivery,
	})
);
const api = computed(() => tabs.connect(state.value, send, normalizeProps));
const { handleChange } = useField("deliveryType");

watch(
	() => api.value.value,
	(val) => {
		handleChange(val);
	},
	{
		deep: true,
		immediate: true,
	}
);
const tabList = markRaw([
	{
		id: DeliveryTypes.delivery,
		label: "Доставка",
	},
	{
		id: DeliveryTypes.points,
		label: "Самовывоз",
	},
]);
</script>

<template>
	<div class="card">
		<h3
			class="font-semibold text-system-black-950 mb-[1.125rem] lg:mb-6 lg:text-2xl"
		>
			Способы получения
		</h3>
		<div
			class="grid grid-cols-1 grid-rows-[auto_minmax(0,_1fr)] max-h-full w-full flex-1"
			v-bind="api.rootProps"
		>
			<div
				class="bg-system-gray mb-[1.125rem] lg:mb-6 rounded-[5rem] p-[5px] flex items-center"
				v-bind="api.tablistProps"
			>
				<button
					v-for="item in tabList"
					:key="item.id"
					class="tab lg:font-semibold"
					v-bind="api.getTriggerProps({ value: item.id })"
				>
					{{ item.label }}
				</button>
			</div>
			<div
				class="overflow-y-auto p-4 -m-4"
				v-bind="api.getContentProps({ value: tabList[1].id })"
			>
				<CheckoutSelfDelivery />
			</div>
			<div
				class="overflow-y-auto p-4 -m-4"
				v-bind="api.getContentProps({ value: tabList[0].id })"
			>
				<CheckoutDeliverySystem />
			</div>
		</div>
	</div>
</template>

<style scoped>
[data-scope="tabs"][role="tab"] {
	width: 100%;
	padding-left: 1.38rem;
	padding-right: 1.38rem;
	padding-top: 0.62rem;
	padding-bottom: 0.62rem;
	border-radius: 5rem;
}

[data-scope="tabs"][role="tab"][data-selected] {
	@apply bg-system-gray-600;
}
</style>
