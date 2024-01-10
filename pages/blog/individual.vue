<script setup lang="ts">

import { computed, useHead } from "#imports";
import { IBlock, IBreadCrumb } from "~/types/common";
import PageHeader from "~/components/page/ImageHeader.vue";
import ParagraphBlock from "~/components/blocks/ParagraphBlock.vue";
import TableBlock from "~/components/blocks/TableBlock.vue";
import HeaderBlock from "~/components/blocks/HeaderBlock.vue";
import ListBlock from "~/components/blocks/ListBlock.vue";
import AttachesBlock from "~/components/blocks/AttachesBlock.vue";
import QuoteBlock from "~/components/blocks/QuoteBlock.vue";
import ImageBlock from "~/components/blocks/ImageBlock.vue";
import fetchSeo from "~/composables/fetchSeo";

const { getSingletonItem } = useDirectusItems()
const data = await getSingletonItem<{
  name: string;
  image: string;
  blocks: {
    time: string;
    blocks: IBlock[];
    version: string;
  }
}>({
  collection: 'individual'
})
console.log(data)
useHead({
  title: data?.name ?? 'Заказать кухню'
})
await fetchSeo()

const breadCrumbs = computed<IBreadCrumb[]>(() => {
  const arr: IBreadCrumb[] = [{
    path: '/',
    title: 'Главная'
  }]
  if (data) {
    arr.push({
      path: `/blog/individual`,
      title: data.name
    })
  }
  return arr
})
</script>

<template>
  <div class="flex-1">
    <PageHeader :bread-crumbs="breadCrumbs" :image="data.image" :page-name="data?.name" />
    <div class="py-8 px-4 lg:py-[3.25rem] page">
      <div v-if="data"
        class="mb-7 lg:mb-6 flex text-xs lg:text-base font-semibold text-system-black-950 items-center gap-4 lg:gap-6">
      </div>
      <template v-for="block of data?.blocks?.blocks" :key="block.id">
        <HeaderBlock v-if="block.type === 'header'" :block="block" />
        <ParagraphBlock v-else-if="block.type === 'paragraph'" :block="block" />
        <ListBlock v-else-if="block.type === 'nestedlist'" :block="block" />
        <TableBlock v-else-if="block.type === 'table'" :block="block" />
        <AttachesBlock v-else-if="block.type === 'attaches'" :block="block" />
        <QuoteBlock v-else-if="block.type === 'quote'" :block="block" />
        <ImageBlock v-else-if="block.type === 'image'" :block="block" />
      </template>
    </div>
  </div>
</template>

<style scoped></style>