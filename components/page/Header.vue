<script lang="ts" setup>
import {IBreadCrumb, ILink} from "~/types/common";
import UiBreadCrumbs from "~/components/common/BreadCrumbs.vue";
import {useRouter} from "~/.nuxt/imports";

defineProps<{
  pageName: string;
  breadCrumbs: IBreadCrumb[];
  progress?: boolean;
  link?: ILink;
}>()

const router = useRouter()
</script>

<template>
  <div class="p-7 bg-system-gray-500 relative page-header lg:pt-[5.12rem] lg:pb-[5.06rem]">
    <h1 class="">{{ pageName }}</h1>
    <button v-if="link" class="font-semibold group top-[2.6375rem] left-[4.375rem] absolute text-[1.125rem] gap-1.5 hidden lg:flex items-center" type="button"
            @click="link.path === 'back' ? router.back() : router.push(link.path)">
      <svgo-arrow-right class="rotate-180 text-2xl transition-colors group-hover:text-accent-300" filled/>
      <span class="group-hover:text-accent-300 transition-colors">{{ link.title }}</span>
    </button>
    <div id="filters-slot"
         class="font-semibold top-[2.6375rem] right-[4.375rem] absolute text-[1.125rem] gap-1.5 hidden lg:flex items-center"/>
    <UiBreadCrumbs :list="breadCrumbs" :progress="progress"/>
  </div>
</template>

<style lang="scss" scoped>
.page-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  @media (min-width: 1024px) {
    gap: 0;
  }

  h1 {
    font-size: 1.375rem;
    font-weight: 700;
    line-height: 140%;
    text-align: center;
    @media (min-width: 1024px) {
      font-size: 2.625rem;
    }
  }
}
</style>