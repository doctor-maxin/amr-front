<script lang="ts" setup>
import PageHeader from '~/components/page/Header.vue'
import {markRaw, ref, useAppConfig, useDirectusItems, watchEffect, useHead} from "../../.nuxt/imports";
import {IBreadCrumb} from "../types/common";
import UiSpinner from "~/components/ui/UiSpinner.vue";
import {IIdeaItem} from "../types/ideas";
import {useUrlSearchParams} from "@vueuse/core/index";
import UiPagination from "~/components/ui/UiPagination.vue";
import IdeasBlockCard from "~/components/blocks/ideas/IdeasBlockCard.vue";
import {useBlogStore} from "../../store/blog.store";

useHead({
  title: 'Идеи и тренды'
})
const breadCrumbs = markRaw<IBreadCrumb[]>([{
  title: 'Главная',
  path: '/'
}, {
  title: 'Идеи и тренды',
  path: '/blog'
}])
const isLoading = ref<boolean>(false)
const totalCount = ref<number>(0)
const appConfig = useAppConfig()
const articles = ref<IIdeaItem[]>([])
const {getItems} = useDirectusItems()
const blogStore = useBlogStore()
const params = useUrlSearchParams('history', {
  initialValue: {
    page: 1
  }
})

watchEffect(async () => {
  isLoading.value = true;
  const response = await getItems<IIdeaItem>({
    collection: 'projects',
    params: {
      meta: 'filter_count',
      page: params.page,
      limit: 12
    }
  })
  if (response?.meta?.filter_count) totalCount.value = response.meta.filter_count
  if (response.data) articles.value = response.data
  if (response.data.length) blogStore.setToList(response.data)
  isLoading.value = false;
})
</script>

<template>
  <div class="flex-1">
    <PageHeader :bread-crumbs="breadCrumbs" page-name="Идеи и тренды"/>
    <main class="pt-[2.375rem] px-4 pb-[6.88rem] lg:pb-[8.75rem] lg:pt-[4.63rem]">
      <template v-if="isLoading">
        <UiSpinner/>
      </template>
      <template v-else>
        <template v-if="articles.length">
          <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-[1.875rem]">
            <template v-for="item of articles">
              <IdeasBlockCard :item="item"/>
            </template>
          </div>
          <UiPagination :limit="12" :page="+params.page" :total="totalCount" class="mt-6"
                        @onPage="params.page = $event"/>
        </template>
        <div v-else
             class="mt-[1rem] text-center mx-auto lg:text-2xl font-semibold lg:mt-[2.5rem] text-system-black-900 text-opacity-40">
          {{ appConfig.articles.emptyList }}
        </div>
      </template>
    </main>
  </div>
</template>

<style scoped>

</style>