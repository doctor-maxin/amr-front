<script lang="ts" setup>
import {Swiper, SwiperSlide} from 'swiper/vue'
import {shallowRef} from '~/.nuxt/imports';
import 'swiper/css';
import IdeasBlockCard from "~/components/blocks/ideas/IdeasBlockCard.vue";
import UiLink from "~/components/ui/UiLink.vue";
import {IIdeaItem} from "~/types/ideas";


defineProps<{
  list: IIdeaItem[];
  subheader?: string;
  title: string;
  hideBlog?: boolean;
}>()

const breakpoints = shallowRef({
  320: {
    slidesPerView: 1.2,
    spaceBetween: 14
  },
  640: {
    slidesPerView: 2,
    spaceBetween: 18
  },
  768: {
    slidesPerView: 2.5,
    spaceBetween: 20
  },
  1024: {
    slidesPerView: 3,
    spaceBetween: 30
  },
})

</script>

<template>
  <section class="px-4 lg:px-[4.37rem]" v-if="list?.length">
    <h4 v-if="subheader" class="subhead text-center lg:text-left">{{ subheader }}</h4>
    <div class="flex items-end mb-7 lg:mb-[2.5rem] lg:justify-between justify-center">
      <h2 class="head xl:flex lg:px-0 max-w-[28rem] lg:text-left">{{ title }}</h2>
      <UiLink v-if="!hideBlog" class="hidden lg:flex" title="Блог" to="/blog" variant="filled"/>
    </div>
    <div>
      <Swiper :breakpoints="breakpoints"
      >
        <SwiperSlide v-for="item of list" :key="item.id">
          <IdeasBlockCard :item="item"/>
        </SwiperSlide>
      </Swiper>
    </div>
  </section>
</template>
<style scoped>
</style>