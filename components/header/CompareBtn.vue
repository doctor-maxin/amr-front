<script setup lang="ts">
import { useCompareStore } from '../../store/compare.store';


const closeModals = () => {
    useEvent("close-modals");
};
const compareStore = useCompareStore()

</script>
<template>
    <nuxt-link v-if="compareStore.ids.length" to="/compare" type="button" class="relative" @click.native="closeModals">
        <div
            class="absolute -top-[0.69rem] -right-[0.81rem] aspect-square w-[1.1875rem] h-[1.1875rem] bg-system-gray-800 rounded-full flex items-center justify-center">
            <span class="text-[0.75rem] leading-[1.1875rem] text-white">{{
                compareStore.ids.length
            }}</span>
        </div>
        <svgo-compare filled class="text-2xl" />
    </nuxt-link>
</template>