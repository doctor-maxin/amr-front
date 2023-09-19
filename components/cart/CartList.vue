<script lang="ts" setup>
import {useAppConfig, useCurrency} from "../../.nuxt/imports";
import UiPlusMinusInput from "../ui/UiPlusMinusInput.vue";
import {CartPopulatedItem} from "../../types/cart";
import {useCartStore} from "../../store/cart.store";
import {toast} from "vue3-toastify";

const {toMoney} = useCurrency()
const cartStore = useCartStore()
const appConfig = useAppConfig()
defineProps<{
	lines: Map<string, CartPopulatedItem>
}>()

const getItemImage = (item: any): string => {
	if (item.product.images?.[0].directus_files_id) return item.product.images[0].directus_files_id
	return appConfig.noImageId as string;
}

const removeItem = async (id: string) => {
	await cartStore.removeItem(id)
	toast.success(appConfig.messages.productRemoved)
}
</script>

<template>
	<div class="max-w-[64.125rem] w-full">
		<div
			class="bg-system-gray-500 w-full rounded-[1.25rem] py-5 px-6 hidden lg:grid grid-cols-[2fr_minmax(0,_1fr)_minmax(8rem,_auto)_minmax(8rem,_auto)] text-lg text-system-black-900 font-semibold gap-4">
			<span>Товар</span>
			<span>Количество</span>
			<span>Цена</span>
			<span> </span>
		</div>
		<div class="lg:py-8 lg:px-6 gap-8 flex flex-col">
			<template v-for="item of lines.values()" :key="item.id">
				<div
					class="grid grid-cols-3 gap-[1.135rem] lg:grid-cols-[2fr_minmax(0,_1fr)_minmax(8rem,_auto)_minmax(8rem,_auto)] lg:items-center">
					<nuxt-link :to="`/catalog${item.product.handle}`"
					           class="bg-system-gray-500 lg:items-center lg:bg-transparent flex gap-[1.315rem] lg:gap-[3.19rem] col-span-3 lg:col-span-1 rounded-[1.25rem] p-[1.135rem] lg:p-0">
						<NuxtImg
							:src="getItemImage(item)"
							class="aspect-square w-[4.375rem] lg:w-[6.25rem] rounded-[0.635rem] object-contain"
							provider="directus"
						/>
						<div class="flex flex-col gap-1 font-semibold text-system-black-900">
							<span class="lg:text-2xl">{{ item.product.name }}</span>
							<span class="lg:hidden">{{ toMoney(item.product.price) }}</span>
						</div>
					</nuxt-link>
					<div class="row-start-2 lg:row-start-1 lg:col-start-2 col-start-1">
						<UiPlusMinusInput :line="item"/>
					</div>
					<div class="hidden lg:block font-semibold text-xl">{{ toMoney(item.product.price) }}</div>
					<div class="row-start-2 col-start-3 justify-self-end lg:row-start-1 lg:col-start-4">
						<button
							class="flex group items-center gap-2.5 py-2 pl-4 pr-4 lg:gap-2 lg:p-0 rounded-[6.88rem] bg-system-gray-500 lg:bg-transparent"
							@click="removeItem(item.id)">
							<svgo-close class="text-2xl transition-colors !mb-0 group-hover:lg:text-accent-300" filled/>
							<span
								class="text-system-gray-800 font-medium transition-colors group-hover:lg:text-accent-300 lg:font-semibold">Удалить</span>
						</button>
					</div>
				</div>
			</template>
		</div>
	</div>
</template>

<style scoped>

</style>