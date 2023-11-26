<script setup lang="ts">

const props = defineProps<{
    selected: string;
    list: {
        title: string;
        value: string;
    }[]
}>()

const emit = defineEmits<{
    (event: 'change', val: string): void;
}>()

const onClick = (v: string) => {
    if (v === props.selected) {
        emit('change', '*')
    } else emit('change', v)
}
</script>

<template>
    <div class="flex -mx-4 px-4 gap-3 overflow-x-auto snap-x snap-mandatory">
        <template v-for="(item, index) of list" :key="item.value">
            <button type="button" @click="onClick(item.value)" :class="{
                'border-accent-300': selected === item.value,
                'border-system-gray': selected !== item.value,
                'snap-start': index === 0,
                'snap-center': index !== 0,
                'snap-end': index === list.length,
            }" class="text-sm lg:text-base  px-7 py-2 lg:py-3.5 border  bg-system-gray rounded-[5rem] font-semibold">{{
    item.title
}}</button>
        </template>
    </div>
</template>