<script setup lang="ts">
import { PaymentTypes } from "../../../server/types/checkout.types";

defineProps<{
	paymentType: PaymentTypes;
}>();
</script>

<template>
	<div
		class="card flex w-full lg:justify-between text-system-black-900 lg:items-center flex-col lg:flex-row gap-1"
	>
		<span class="font-medium lg:text-xl">Способ оплаты</span>
		<span class="font-semibold lg:text-xl">
			{{
				paymentType === PaymentTypes.TINKOFF
					? "Оплата по карте"
					: paymentType === PaymentTypes.SELF_CARD
					? "Оплата картой при получение"
					: "Оплата наличными при получение"
			}}
		</span>
	</div>
</template>

<style scoped></style>
