<script setup lang="ts">
import { IProduct } from '../../../types/product'
import { useCompareStore } from '../../../store/compare.store'
import { useCartStore } from '../../../store/cart.store'

const props = defineProps<{
    list: IProduct[];
    uniquePropIds: string[];
    allPropsList: any;
}>()

const cartStore = useCartStore()

const { toMoney } = useCurrency()

const getValue = (values: any[], id: string) => {
    for (const val of values) {
        if (val.optionValues_id.parentId.id === id) return val.optionValues_id.value
    }
    return ''
}

const compareStore = useCompareStore()
</script>
<template>
    <div class="grid grid-cols-2 gap-2 mb-4">
        <template v-for="product of list" :key="product.handle">
            <nuxt-link class="mb-3" :to="`/catalog${product.handle}`">
                <NuxtImg :src="product.images?.[0].directus_files_id" provider="directus"
                    class="aspect-[10/6] rounded-[1.25rem] lg:aspect-[7/5]" placeholder />
            </nuxt-link>
        </template>
    </div>
    <div class="grid grid-cols-2 gap-2 mb-7">
        <template v-for="product of list" :key="product.handle">
            <nuxt-link :to="`/catalog${product.handle}`">
                <div class="text-system-black-950 font-semibold lg:text-2xl">{{ product.name }}</div>
            </nuxt-link>
        </template>
    </div>
    <div>
        <template v-for="item in allPropsList" :key="propId">
            <div class="mb-1 font-medium text-sm" :class="{
                'text-accent-300': uniquePropIds.includes(item[0])
            }">
                {{ item[1] }}
            </div>
            <div class="grid grid-cols-2 text-sm font-semibold gap-2 mb-5">
                <template v-for="product of list" :key="product.handle">
                    <div>{{ getValue(product.optionsValues, item[0]) }}</div>
                </template>
            </div>
        </template>
        <div class="mb-1 font-medium text-sm text-accent-300">
            Цена
        </div>
        <div class="grid grid-cols-2 text-sm font-semibold gap-2 mb-5">
            <template v-for="product of list" :key="product.handle">
                <div>{{ product.canNotBye ? 'от' : '' }} {{ toMoney(product.price) }}</div>
            </template>
        </div>
    </div>
    <div>
        <div class="grid grid-cols-2 text-sm font-semibold gap-2">
            <template v-for="product of list" :key="product.handle">
                <div class="flex gap-2">
                    <button @click="compareStore.removeFromCompare(product.id)"
                        class="rounded-[1rem] backdrop-blur-[10px] bg-system-black-600 flex items-center justify-center text-white w-[3.25rem] h-[3.25rem]"><svgo-close
                            filled class="text-2xl" /> </button>
                    <button v-if="!product.canNotBye && product.count > 0" @click="cartStore.addProduct(product.id)"
                        class="rounded-[1rem] backdrop-blur-[10px] bg-system-black-600 flex items-center justify-center text-white w-[3.25rem] h-[3.25rem]"><svgo-cart
                            filled class="text-2xl" /> </button>
                </div>
            </template>
        </div>
    </div>
</template>