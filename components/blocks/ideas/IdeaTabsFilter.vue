<script setup lang="ts">
import { IIdeaType } from '~/types/ideas';

const props = defineProps<{
    type: IIdeaType;
}>()
const ideaTypes = Object.values(IIdeaType).filter(i => i !== IIdeaType.all)
const emit = defineEmits<{
    (event: 'change', val: string): void;
}>()

const onClick = (v: string) => {
    if (v === props.type) {
        emit('change', '*')
    } else emit('change', v)
}
</script>
<template>
    <div class="flex -mx-4 px-4 gap-3 overflow-x-auto snap-x snap-mandatory snap-end">
        <template v-for="articleType of ideaTypes" :key="articleType">
            <button type="button" @click="onClick(articleType)" :class="{
                'border-accent-300': type === articleType,
                'border-system-gray': type !== articleType,
            }" class="text-sm lg:text-base px-7 py-2 lg:py-3.5 border  bg-system-gray rounded-[5rem] font-semibold">{{
    articleType ===
    IIdeaType.idea ? 'Идеи' :
    articleType ===
        IIdeaType.news ? 'Новости' : 'Проекты'
}}</button>
        </template>
    </div>
</template>