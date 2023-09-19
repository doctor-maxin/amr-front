<script lang="ts" setup>

</script>

<template>
  <div class="top-full ui-pagination mt-10 flex justify-center">
    <div
        class="swiper-pagination !w-auto bg-system-gray !static flex gap-2.5 lg:gap-3 py-3.5 lg:py-[1.625rem] px-3 lg:px-[5.125rem] rounded-[4.5rem]"></div>
  </div>
</template>

<style lang="scss">
.ui-pagination {
  .swiper-pagination-bullet {
    background-color: hsla(220, 8%, 22%, 0.5);
  }

  .swiper-horizontal > .swiper-pagination-bullets .swiper-pagination-bullet, .swiper-pagination-horizontal.swiper-pagination-bullets .swiper-pagination-bullet {
    @apply w-[10px] lg:w-[13px] lg:h-[13px] h-[13px];
    margin: 0 !important;
  }

  .swiper-pagination-bullet-active {
    background-color: hsla(220, 8%, 22%, 1);
    position: relative;

    &:after {
      position: absolute;
      width: 180%;
      height: 180%;
      z-index: 1;
      left: -40%;
      top: -40%;
      border-radius: 50%;
      background-image: url(/images/icons/bullet-bg.svg);
      background-position: center;
      background-repeat: no-repeat;
      background-size: cover;
      content: "";
    }
  }
}
</style>