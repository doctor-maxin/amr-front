<script setup lang="ts">
import Header from '~/components/page/Header.vue'
import { IBreadCrumb } from '../types/common';
import { useCompareStore } from '../store/compare.store';
import UiLink from '../components/ui/UiLink.vue';
import CompareList from '~/components/blocks/compare/CompareList.vue'

const breadCrumbs = markRaw<IBreadCrumb[]>([{
    path: '/',
    title: 'Главная'
}, {
    path: '/catalog',
    title: 'Каталог'
}, {
    path: '/compare',
    title: 'Сравнение товаров'
}])

const compareStore = useCompareStore()
</script>
<template>
    <Header page-name="Сравнение товара" title="Сравнение товара" :bread-crumbs="breadCrumbs" />
    <div class="flex-1">
        <div class="max-w-[120rem] lg:pt-[3.62rem] lg:pb-[8.75rem] mx-auto pt-[3.12rem] pb-[4.37rem] px-4 lg:px-[4.38rem]">
            <div v-if="compareStore.ids.length === 0" class="flex flex-col mx-auto items-center gap-8 lg:gap-10">
                <h2 class="text-2xl text-system-black-950 text-opacity-40">Вы еще ничего не сравнивали</h2>
                <UiLink class="lg:min-w-[22rem]" variant="dark" title="Перейти в каталог" to="/catalog" />
            </div>
            <div v-else>
                <CompareList :list="compareStore.ids" />
            </div>
        </div>

    </div>
</template>