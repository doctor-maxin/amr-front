<script setup lang="ts">
import { IOrder } from "../../../types/common";

defineProps<{
	order: IOrder;
	status: string;
}>();
</script>

<template>
	<div class="card flex flex-col w-full items-center justify-center gap-2">
		<template v-if="status === 'success'">
			<svgo-check class="text-[4rem]" filled />
			<h2
				class="text-2xl lg:text-2xl lg:mt-1 font-semibold text-center text-system-black-900"
			>
				Спасибо за оформление заказа #{{ order.number }}
			</h2>
			<p class="text-system-gray-700 text-center text-opacity-70">
				Информация о заказе была отправлена по адресу {{ order.email }}
			</p>
		</template>
		<template v-else>
			<svgo-close class="text-[4rem]" filled />
			<h2
				class="text-2xl lg:text-2xl lg:mt-1 font-semibold text-center text-system-black-900"
			>
				Во время оформления заказа возникли ошибки
			</h2>
			<p class="text-system-gray-700 text-center text-opacity-70">
				Пожалуйста, попорбуйте попозже
			</p>
		</template>
	</div>
</template>

<style scoped></style>
