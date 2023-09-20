<script setup lang="ts">
import { useAsyncData, useDirectusItems, useField } from "#imports";
import { IPaymentType } from "~/types/common";

const { getItems } = useDirectusItems();

const { data: list } = useAsyncData("paymenttypes", () =>
	getItems<IPaymentType>({
		collection: "paymenttypes",
	})
);
</script>

<template>
	<div class="card flex flex-col gap-[1.125rem] lg:gap-6" v-if="list?.length">
		<h3 class="font-semibold text-system-black-950 lg:text-2xl">Способ оплаты</h3>
		<VeeField v-slot="{ field }" v-for="item of list" :key="item.id" name="paymentType" type="radio" :value="item.type">
		<label  class="flex justify-between cursor-pointer items-center border rounded-[2.375rem] border-black  pr-[0.875rem]">
			<span class="py-2 pl-7 text-sm lg:text-base font-semibold">{{ item.title }}</span>
			<input v-bind="field" class="w-[1.625rem] h-[1.625rem] py-[0.875rem]" type="radio" :value="item.type" name="paymentType" />
		</label>
		</VeeField>
	</div>
</template>

<style scoped>
input[type=radio] {
	accent-color: black;
}
</style>
