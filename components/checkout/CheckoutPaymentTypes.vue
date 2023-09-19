<script setup lang="ts">
import { useAsyncData, useDirectusItems } from "#imports";

const {getItems} = useDirectusItems()

const {data: list} = useAsyncData('payment-types', () => getItems({
	collection: 'payment-types'
}))
</script>

<template>
<div class="card">
	<h3 class="font-semibold text-system-black-950">Способ оплаты</h3>
	<label v-for="item of list" for="">
		<span>Оплата банковской картой онлайн</span>
		<input type="radio" name="paymentType">
	</label>
</div>
</template>

<style scoped>

</style>