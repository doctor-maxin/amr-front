<script lang="ts" setup>
import CatalogBlock from "~/components/blocks/catalog/CatalogBlock.vue";
import FeedbackBlock from "~/components/main/FeedbackBlock.vue";
import Banner from "~/components/banner/Banner.vue";
import Advantages from "~/components/advantages/Advantages.vue";
import LazyBlocksIdeasIdeiasBlock from '~/components/blocks/ideas/IdeiasBlock.vue'
import CallBackForm from "../components/common/CallBackForm.vue";
import { computed, useDirectusItems, useHead } from "../.nuxt/imports";
import { IIdeaItem } from "../types/ideas";

const { getItems } = useDirectusItems()

useHead({
  title: 'Автор мебельных решений'
})

const IdeaList = await Promise.all([getItems<IIdeaItem>({
  collection: 'projects',
  params: {
    filter: {
      type: 'news'
    },
    limit: 3
  }
}), getItems<IIdeaItem>({
  collection: 'projects',
  params: {
    filter: {
      type: 'project'
    },
    limit: 3
  }
}), getItems<IIdeaItem>({
  collection: 'projects',
  params: {
    filter: {
      type: 'idea'
    },
    limit: 3
  }
})])

const ideaList = computed(() => {
  const list: any = []
  if (IdeaList[0].length > 1 && IdeaList[1].length > 1 && IdeaList[2].length > 1) {
    list.push(IdeaList[0][0])
    list.push(IdeaList[1][0])
    list.push(IdeaList[2][0])

  } else {
    for (const ideaL of IdeaList) {
      for (const idea of ideaL) {
        if (list.length < 3) {
          list.push(idea)
        }
      }
    }
  }
  console.log(list, IdeaList)
  return list
})
</script>

<template>
  <div class="w-full">
    <div class="mb-[2.4rem] lg:mb-[7.7rem]">
      <Banner />
    </div>
    <div class="mb-[4.25rem] lg:mb-[10rem] container">
      <Advantages />
    </div>
    <div class="mb-[4.25rem] lg:mb-[8rem]">
      <FeedbackBlock />
    </div>
    <div class="mb-[4.25rem] lg:mb-[7.125rem] container">
      <CatalogBlock />
    </div>
    <div class="mb-[4.25rem] lg:mb-[7.125rem] container">
      <LazyBlocksIdeasIdeiasBlock :list="ideaList" subheader="ИДЕИ И ТРЕНДЫ" title="Современные решения и не только" />
    </div>
    <CallBackForm />
  </div>
</template>

<style scoped></style>