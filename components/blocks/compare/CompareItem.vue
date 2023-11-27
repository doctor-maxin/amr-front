<script setup lang="ts">
import { type IProduct } from "~/types/product";
import { useCompareStore } from "../../../store/compare.store";
import { useCartStore } from "../../../store/cart.store";
import { useEvent } from "~/composables/useEventBus";
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/pagination";

defineProps<{
	product: IProduct;
	uniquePropIds: string[];
	allPropsList: any;
}>();

const { toMoney } = useCurrency();
const compareStore = useCompareStore();
const cartStore = useCartStore();
</script>
<template>
	<div class="flex gap-4 max-w-[35rem] lg:gap-[3.8rem] flex-col">
		<nuxt-link class="" :to="`/catalog${product.handle}`">
			<NuxtImg
				:src="product.images?.[0].directus_files_id"
				provider="directus"
				class="aspect-[10/6] rounded-[1.25rem] lg:aspect-[7/5]"
				placeholder
			/>
		</nuxt-link>
		<div>
			<nuxt-link class="mb-3 block" :to="`/catalog${product.handle}`">
				<div class="text-system-black-950 font-semibold lg:text-2xl">
					{{ product.name }}
				</div>
			</nuxt-link>
			<div class="flex flex-col gap-5">
				<div
					v-for="option of product.optionsValues"
					class="flex text-sm lg:flex-row lg:text-base gap-1 flex-col w-full justify-between"
				>
					<div
						class="lg:opacity-100 font-medium"
						:class="{
							'font-semibold text-accent-300':
								uniquePropIds.includes(
									option.optionValues_id.parentId.id
								),
						}"
					>
						{{ option.optionValues_id.parentId.name }}
					</div>
					<div class="font-semibold">
						{{ option.optionValues_id.value }}
					</div>
				</div>
			</div>
		</div>
		<div class="w-full gap-3 flex">
			<div
				class="p-5 flex-1 font-semibold text-white gap-1 line-clamp-2 rounded-[1rem] backdrop-blur-[10px] bg-system-black-600 flex justify-between"
			>
				<nuxt-link
					class="text-xl hover:text-white"
					:to="`/catalog${product.handle}`"
				>
					<span>{{ product.name }}</span></nuxt-link
				>
				<span class="whitespace-nowrap"
					>{{ product.canNotBye ? "от" : "" }}
					{{ toMoney(product.price) }}</span
				>
			</div>
			<button
				@click="compareStore.removeFromCompare(product.id)"
				class="rounded-[1rem] items-center justify-center backdrop-blur-[10px] bg-system-black-600 flex text-white h-full p-5"
			>
				<svgo-close filled class="text-2xl" />
			</button>
			<button
				v-if="!product.canNotBye && product.count > 0"
				@click="cartStore.addProduct(product.id)"
				class="rounded-[1rem] items-center justify-center backdrop-blur-[10px] bg-system-black-600 flex gap-1 text-white p-5 h-full"
			>
				<svgo-cart filled class="text-2xl" /> <span>В корзину</span>
			</button>
			<button
				v-else-if="product.canNotBye"
				@click="useEvent('open:product-form', product)"
				class="rounded-[1rem] items-center justify-center backdrop-blur-[10px] bg-system-black-600 flex gap-1 text-white p-5 h-full"
			>
				<svgo-cart filled class="text-2xl" />
				<span>Заказать расчет</span>
			</button>
		</div>
	</div>
</template>
