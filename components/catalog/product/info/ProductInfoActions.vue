<script lang="ts" setup>
import {IProduct} from "../../../../types/product";
import {useCurrency} from "~/composables/useCurrency";

defineProps<{
	product: IProduct;
}>()

const {toMoney} = useCurrency()
</script>

<template>
	<div class="fixed z-10 w-full left-0 bottom-4 px-4 lg:static lg:px-0" itemprop="offers" itemscope=""
	     itemtype="http://schema.org/Offer">
		<div
			class="bg-system-gray gap-2 lg:gap-4 rounded-[6.875rem] pl-6 pr-2 py-2 lg:pl-[3rem] lg:pr-[0.81rem] lg:py-[0.81rem] flex items-center">
			<div class="flex flex-col"><span class="text-lg font-bold" itemprop="price">{{
					toMoney(product.price)
				}}</span>
				<span hidden itemprop="priceCurrency">RUB</span>
				<link v-if="product.count" itemprop="availability" href="http://schema.org/InStock" />
				<span class="text-xs font-medium">без учета доставки</span></div>
			<button
				class="rounded-full ml-auto flex items-center justify-center border border-system-black-950 lg:w-[4rem] lg:h-[4rem] w-[3.25rem] h-[3.25rem]"
				type="button">
				<svgo-heart class="text-2xl" filled/>
			</button>
			<button v-if="product.count > 0" :disabled="product.count <=0" class="px-[1.375rem] hidden rounded-full border border-system-black-950 lg:flex items-center justify-center h-[4rem]"
			        type="button">
				<span class="font-semibold">Покупка в 1 клик</span>
			</button>
			<button
				:disabled="product.count <=0"
				class="rounded-full lg:gap-[0.88rem] disabled:bg-system-gray-600 disabled:border-system-gray-600 disabled:cursor-not-allowed border border-system-black-950 bg-system-black-950 flex items-center justify-center lg:w-auto lg:h-[4rem] w-[3.25rem] h-[3.25rem] text-white lg:px-6"
				type="button">
				<svgo-cart class="text-2xl" filled/>
				<span class="hidden lg:block font-semibold text-white">
					{{product.count <=0 ? 'Товар распродан' : 'В корзину'}}</span>
			</button>
		</div>
	</div>
</template>

<style scoped>

</style>