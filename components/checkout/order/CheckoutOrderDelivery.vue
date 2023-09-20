<script setup lang="ts">
import { DeliveryTypes } from "../../../types/cart";

defineProps<{
	deliveryType: DeliveryTypes;
}>();
</script>

<template>
	<div
		class="card flex w-full lg:justify-between text-system-black-900 lg:items-center flex-col lg:flex-row gap-1"
	>
		<span class="font-medium lg:text-xl">Способ доставки</span>
		<span class="font-semibold lg:text-xl">
			{{
				deliveryType === DeliveryTypes.delivery
					? "Доставка"
					: "Самовывоз"
			}}
		</span>
	</div>
</template>

<style scoped></style>
