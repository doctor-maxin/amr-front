<script lang="ts" setup>
import PageHeader from '~/components/page/ImageHeader.vue'
import {computed, useHead, useAsyncData, useDirectusItems, useRoute, useRouter, watchEffect} from "../../.nuxt/imports";
import {IIdeaItem} from "../../types/ideas";
import {IBreadCrumb, ILink} from "../../types/common";
import {useBlogStore} from "../../store/blog.store";
import ImageBlock from "~/components/blocks/ImageBlock.vue";
import TableBlock from "~/components/blocks/TableBlock.vue";
import AttachesBlock from "~/components/blocks/AttachesBlock.vue";
import QuoteBlock from "~/components/blocks/QuoteBlock.vue";
import ParagraphBlock from "~/components/blocks/ParagraphBlock.vue";
import ListBlock from "~/components/blocks/ListBlock.vue";
import HeaderBlock from "~/components/blocks/HeaderBlock.vue";
import ArticlesSeems from '~/components/blocks/ideas/IdeiasBlock.vue'

const {getItems} = useDirectusItems()
const route = useRoute()
const router = useRouter()
const blogStore = useBlogStore()

const {data} = await useAsyncData(() => getItems<IIdeaItem>({
  collection: 'projects',
  params: {
    filter: {
      handle: {
        _eq: route.params.handle.toString()
      }
    }
  }
}))
const {data: seems} = await useAsyncData(() => getItems<IIdeaItem>({
  collection: 'projects',
  params: {
    filter: {
      type: data.value?.[0].type,
      id: {
        _neq: data.value?.[0].id
      }
    }
    }
}))
const article = computed<IIdeaItem | null>(() => data.value?.length ? data.value[0] : null)
const breadCrumbs = computed<IBreadCrumb[]>(() => {
  const arr: IBreadCrumb[] = [{
    path: '/blog',
    title: 'Идеи и тренды'
  }]
  if (article.value) {
    arr.push({
      path: `/blog/${article.value.handle}`,
      title: article.value.name
    })
  }
  return arr
})

useHead({
  title: article.value?.name ?? 'Идеи и тренды'
})

const nextArticle = computed<ILink | null>(() => {
  if (!article.value) return null;
  const nextArticle = blogStore.getNextArticle(article.value.id)
  if (!nextArticle) return null;

  return {
    path: `/blog/${nextArticle.handle}`,
    title: 'Следующая новость'
  }
})

const articleType = computed(() => {
  if (!article?.value?.type) return '';
  if (article.value.type === 'project') return 'Проект'
  if (article.value.type === 'idea') return 'Идея'
  if (article.value.type === 'news') return 'Новость'
})

</script>

<template>
  <div class="flex-1">
    <PageHeader :bread-crumbs="breadCrumbs" :image="article.image" :link="{
    title: 'Назад',
    path: 'back'
  }" :page-name="article?.name" :to="nextArticle"/>
    <div class="py-8 px-4 lg:py-[3.25rem] page">
      <div v-if="article"
           class="mb-7 lg:mb-6 flex text-xs lg:text-base font-semibold text-system-black-950 items-center gap-4 lg:gap-6">
        <div class=" bg-system-gray px-8 lg:px-10 py-2 lg:py-4 rounded-full">{{ articleType }}</div>
        <div>{{ new Date(article.date_created).toLocaleDateString() }}</div>
      </div>
      <template v-for="block of article?.bloks?.blocks" :key="block.id">
        <HeaderBlock v-if="block.type === 'header'" :block="block"/>
        <ParagraphBlock v-else-if="block.type === 'paragraph'" :block="block"/>
        <ListBlock v-else-if="block.type === 'nestedlist'" :block="block"/>
        <TableBlock v-else-if="block.type === 'table'" :block="block"/>
        <AttachesBlock v-else-if="block.type === 'attaches'" :block="block"/>
        <QuoteBlock v-else-if="block.type === 'quote'" :block="block"/>
        <ImageBlock v-else-if="block.type === 'image'" :block="block"/>
      </template>
      <div class="flex items-center justify-between pt-7 pb-12">
        <button
            class="font-semibold group gap-2.5 flex items-center"
            type="button"
            @click="router.back() ">
          <svgo-arrow-right class="rotate-180 text-2xl transition-colors group-hover:text-accent-300" filled/>
          <span class="text-sm lg:text-lg group-hover:text-accent-300 transition-colors">Назад</span>
        </button>

        <button v-if="nextArticle"
                class="font-semibold group gap-2.5 flex items-center"
                type="button"
                @click="router.push(nextArticle.path)">
          <span class="text-sm lg:text-lg group-hover:text-accent-300 transition-colors">{{ nextArticle.title }}</span>
          <svgo-arrow-right class="text-2xl  transition-colors group-hover:text-accent-300" filled/>
        </button>
      </div>
    </div>
    <ArticlesSeems :list="seems" hide-blog title="Похожие статьи" class="mb-[9rem]" />
  </div>
</template>

<style scoped>
.page {
  margin-left: auto;
  margin-right: auto;
  max-width: 54.6875rem;
}
</style>