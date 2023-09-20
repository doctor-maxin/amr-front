<script setup lang="ts">
import { IOrder } from "../../../types/common";

defineProps<{
	order: IOrder;
}>();
</script>

<template>
	<div class="card flex flex-col w-full items-center justify-center gap-2">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="64"
			height="64"
			viewBox="0 0 64 64"
			fill="none"
		>
			<path
				d="M31.9987 58.6663C46.7263 58.6663 58.6654 46.7273 58.6654 31.9997C58.6654 17.2721 46.7263 5.33301 31.9987 5.33301C17.2711 5.33301 5.33203 17.2721 5.33203 31.9997C5.33203 46.7273 17.2711 58.6663 31.9987 58.6663Z"
				stroke="#33363C"
				stroke-width="2"
				stroke-miterlimit="10"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path
				d="M43.5336 25.3021L30.2493 38.5864L20.8359 29.1998"
				stroke="#33363C"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		</svg>
		<h2
			class="text-2xl lg:text-2xl lg:mt-1 font-semibold text-center text-system-black-900"
		>
			Спасибо за оформление заказа #{{ order.number }}
		</h2>
		<p class="text-system-gray-700 text-center text-opacity-70">
			Информация о заказе была отправлена по адресу {{ order.email }}
		</p>
	</div>
</template>

<style scoped></style>
