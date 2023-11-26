<script setup lang="ts">
import { ICareerShort } from "../../../types/common"


defineProps<{
    item: ICareerShort
}>()
</script>
<template>
    <article
        class="flex group lg:flex-row text-system-black-950 flex-col pb-[1.62rem] border-b border-black border-opacity-20">
        <div class="mb-[0.88rem]  lg:mb-0 lg:pb-[4.37rem] lg:flex-1">
            <h1 class="mb-1 lg:text-[2rem] text-[1.25rem] font-bold">{{ item.name }}</h1>
            <p class="text-sm lg:text-[1.125rem]">{{ item.description }}</p>
        </div>
        <nuxt-link
            class="bg-system-gray-500 lg:opacity-0 transition-opacity group-hover:opacity-100 hover:bg-accent-300 transition-colors hover:text-white lg:h-[4.125rem] lg:px-[1.81rem] lg:ml-0 lg:ml-auto w-auto mr-auto flex items-center justify-center rounded-[0.75rem] h-12 px-6"
            :to="`/career/${item.handle}`" :title="`Перейти на страницу`">
            <span class="text-sm lg:text-base font-semibold">Подробнее</span>
        </nuxt-link>
    </article>
</template>