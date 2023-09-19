<script setup lang="ts">
import * as tabs from "@zag-js/tabs";
import { normalizeProps, useMachine } from "@zag-js/vue";
import { computed, markRaw } from "../../.nuxt/imports";
import HeaderMobileMenu from "~/components/header/mobile/HeaderMobileMenu.vue";
import HeaderMobileCatalog from "~/components/header/mobile/HeaderMobileCatalog.vue";
import CheckoutDeliverySystem from "~/components/checkout/delivery/CheckoutDeliverySystem.vue";
import CheckoutSelfDelivery from "~/components/checkout/delivery/CheckoutSelfDelivery.vue";

const [state, send] = useMachine(tabs.machine({ id: "checkoutTabs", value: "delivery" }));
const api = computed(() => tabs.connect(state.value, send, normalizeProps));

const tabList = markRaw([{
	id: 'delivery',
	label: 'Доставка'
}, {
	id: 'self',
	label: 'Самовывоз'
}])

</script>

<template>
<div class="card">
	<h3 class="font-semibold text-system-black-950 mb-[1.125rem]">Способы получения</h3>
	<div class=" grid grid-cols-1 grid-rows-[auto_minmax(0,_1fr)] max-h-full w-full flex-1" v-bind="api.rootProps">
		<div v-bind="api.tablistProps" class="bg-system-gray mb-[1.125rem] rounded-[5rem] p-[5px]  flex items-center">
			<button
				v-for="item in tabList"
				v-bind="api.getTriggerProps({ value: item.id })"
				:key="item.id"
				class="tab"
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
		<div class="overflow-y-auto p-4 -m-4 " v-bind="api.getContentProps({ value: tabList[0].id })">
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