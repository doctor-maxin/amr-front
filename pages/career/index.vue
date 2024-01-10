<script setup lang="ts">
import PageHeader from '../../components/page/Header.vue';
import { IBreadCrumb, ICareer, ICareerShort } from '../../types/common';
import { markRaw, useHead, useAsyncData, ref, watchEffect, useAppConfig, useDirectusItems } from '../../.nuxt/imports'
import UiPagination from "~/components/ui/UiPagination.vue";
import UiSpinner from "~/components/ui/UiSpinner.vue";
import { useUrlSearchParams } from "@vueuse/core/index";
import CareerBlockCard from '~/components/blocks/career/CareerBlockCard.vue';
import CareerFilter from '~/components/blocks/career/CareerFilter.vue';
import fetchSeo from '~/composables/fetchSeo';

const breadCrumbs = markRaw<IBreadCrumb[]>([{
    path: '/',
    title: 'Главная'
}, {
    path: '/career',
    title: 'Карьера'
}])

useHead({
    title: 'Карьера'
})
await fetchSeo()

const isLoading = ref<boolean>(false)
const totalCount = ref<number>(0)
const appConfig = useAppConfig()
const careers = ref<ICareerShort[]>([])
const { getItems } = useDirectusItems()

const { data: types } = await useAsyncData('careerTypes', () => getItems<{
    title: string;
    value: string;
}>({
    collection: 'careerTypes'
}))

const params = useUrlSearchParams<{
    page: string;
    type: string;
}>('history', {
    initialValue: {
        page: '1',
        type: '*'
    }
})

watchEffect(async () => {
    isLoading.value = true;
    const response = await getItems<ICareerShort>({
        collection: 'career',
        params: {
            meta: 'filter_count',
            page: Number(params.page),
            limit: 12,
            fields: ['id', 'name', 'description', 'handle', 'status'],
            filter: params.type !== '*' ? {
                type: {
                    value: params.type
                },
                status: 'published'
            } : {
                status: 'published'
            }
        }
    })
    if (response?.meta?.filter_count) totalCount.value = response.meta.filter_count
    if (response?.data) careers.value = response.data
    isLoading.value = false
})
</script>
<template>
    <div class="flex-1">
        <PageHeader title="Карьера" page-name="Карьера" :bread-crumbs="breadCrumbs" />
        <main class="pt-[2.375rem] mx-auto max-w-[120rem] px-4 pb-[6.88rem] lg:pb-[8.75rem] lg:pt-[4.63rem]">
            <template v-if="isLoading">
                <UiSpinner />
            </template>
            <template v-else>
                <template v-if="totalCount !== 0">
                    <CareerFilter v-if="types" :list="types" :selected="params.type" class="mb-7 lg:mb-[3.19rem]"
                        @change="params.type = $event" />
                    <div v-if="careers.length === 0"
                        class="mt-[1rem] text-center mx-auto lg:text-2xl font-semibold lg:mt-[2.5rem] text-system-black-900 text-opacity-40">
                        {{ appConfig.career.emptyList }}
                    </div>
                    <div v-else class="grid mb-10 lg:pb-[7.5rem] gap-[1.62rem] lg:gap-7 grid-cols-1">
                        <template v-for="item of careers">
                            <CareerBlockCard :item="item" />
                        </template>
                    </div>

                    <UiPagination :limit="12" :page="+params.page" :total="totalCount" class="mt-6"
                        @onPage="params.page = $event" />
                </template>
                <div v-else
                    class="mt-[1rem] text-center mx-auto lg:text-2xl font-semibold lg:mt-[2.5rem] text-system-black-900 text-opacity-40">
                    {{ appConfig.career.emptyList }}
                </div>
            </template>
        </main>
    </div>
</template>