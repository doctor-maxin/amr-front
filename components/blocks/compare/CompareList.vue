
<script setup lang="ts">
import { useDirectusItems } from '~/.nuxt/imports';
import CompareItem from './CompareItem.vue'
import CompareMobileItem from './CompareMobileItem.vue'
import { type IProduct } from '~/types/product'

const props = defineProps<{
    list: string[];
}>()

const { getItems } = useDirectusItems()
const { data, refresh } = await useAsyncData('compare-products', () => getItems<IProduct>({
    collection: 'products',
    params: {
        filter: {
            id: {
                _in: props.list
            }
        },
        fields: ['handle', 'id', 'count', 'images.directus_files_id', 'name', 'canNotBye', 'price', 'optionsValues.optionValues_id.value',
            "optionsValues.optionValues_id.parentId.name",
            "optionsValues.optionValues_id.parentId.id",]
    }
}))
const uniqueValues = ref({})
const uniqueOptionsValues = ref(null)

watch(() => props.list, () => {
    refresh()
})
const uniquePropIds = ref<string[]>([])

const allPropsList = computed(() => {
    const list = new Map()
    const optionHashes: {
        [key: string]: string[]
    } = {}

    if (props.list.length) {
        for (const product of data.value) {
            for (const option of product.optionsValues) {
                list.set(option.optionValues_id.parentId.id, option.optionValues_id.parentId.name)
                if (!optionHashes[option.optionValues_id.parentId.id]) optionHashes[option.optionValues_id.parentId.id] = []
                optionHashes[option.optionValues_id.parentId.id].push(option.optionValues_id.value)
            }
        }
    }

    for (const [key, values] of Object.entries(optionHashes)) {
        if (values.length === 1) {
            uniquePropIds.value.push(key)
        }
        if (values.length > 1 && values[0].toLowerCase().trim() !== values[1].toLowerCase().trim()) {
            uniquePropIds.value.push(key)
        }
    }

    return Array.from(list)
})

</script>

<template>
    <div class="lg:grid hidden gap-2 justify-items-center lg:gap-6 justify-between grid-cols-2">
        <CompareItem :uniquePropIds="uniquePropIds" :allPropsList="allPropsList" v-for="item of data" :key="item.handle"
            :product="item" />
    </div>
    <div class="lg:hidden grid grid-cols-1">
        <CompareMobileItem :uniquePropIds="uniquePropIds" :allPropsList="allPropsList" :list="data" />
    </div>
</template>