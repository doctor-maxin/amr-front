<script setup lang="ts">
import { IProduct } from '../../../types/product';

const { toMoney } = useCurrency();

const props = defineProps<{
    product: Pick<IProduct, 'name' | 'handle' | 'price'> & {
        images: {
            directus_files_id: string;
        }[]
    }
    coords: string;
    img: HTMLElement | null;
}>()
const imgWidth = ref(0)

watchEffect(() => {
    if (props.img) imgWidth.value = props.img.getBoundingClientRect().width
})

const onResize = () => {
    if (props.img) imgWidth.value = props.img.getBoundingClientRect().width
}

onMounted(() => {
    if (process.client) {
        setTimeout(() => {
            onResize()
        }, 300)
        window.addEventListener('resize', onResize)
    }
})



onBeforeUnmount(() => {
    if (process.client) window.removeEventListener('resize', onResize)
})

const getCoords = computed(() => {
    if (!props.img) return "none";

    const widthPercent = Number(props.coords.split(",")[0]);
    const widthFlat = Math.floor((imgWidth.value / 100) * widthPercent);

    const heightPercent = Number(props.coords.split(",")[1]);
    const heightFlat = Math.floor((imgWidth.value / 4 * 3 / 100) * heightPercent);
    console.log(widthFlat, heightFlat)
    return `translateX(${widthFlat}px) translateY(${heightFlat}px)`;
});
</script>
<template>
    <nuxt-link class="dot group" :style="{
        transform: getCoords,
    }" :to="`/catalog${product.handle}`">

        <div class="relative">
            <div class="dot-tooltip hidden transition-opacity opacity-0 group-hover:opacity-100 lg:group-hover:grid"
                role="tooltip">
                <NuxtImg v-if="product.images?.length" provider="directus" width="100"
                    class="w-[3.125rem] h-[3.125rem] object-cover rounded-[0.6875rem]" :src="product.images?.[0]
                        .directus_files_id
                        " />
                <div class="flex flex-col overflow-auto max-w-full">
                    <span class="font-semibold text-white text-sm text-ellipsis whitespace-nowrap overflow-hidden">
                        {{ product.name }}
                    </span>
                    <span class="font-bold text-white text-sm">{{
                        toMoney(product.price)
                    }}</span>
                </div>
                <svgo-arrow-top-right filled class="text-2xl text-white mb-auto" />
            </div>
        </div>
    </nuxt-link>
</template>
<style scoped>
.dot {
    position: absolute;
    width: 1rem;
    height: 1rem;
    border-radius: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
}

.dot::after {
    @apply bg-accent-300 transition-colors;
    z-index: 2;
    content: "";
    border-radius: 1rem;
    position: absolute;
    width: 100%;
    height: 100%;
    bottom: 0;
    left: 0;
}

.dot:hover::after {
    @apply bg-white;
}

.dot::before {
    @apply animate-ping;
    content: "";
    border-radius: 50%;
    z-index: 1;
    position: absolute;
    width: 100%;
    height: 100%;
    box-sizing: content-box;
    padding: 0.25rem;
    background-color: #51515125;
    backdrop-filter: blur(50px);
}

.dot-tooltip {
    position: absolute;
    left: 0.5rem;
    bottom: 0.5rem;
    width: 16.875rem;
    height: 4.625rem;
    border-radius: 0.9375rem;
    background: rgba(81, 81, 81, 0.4);
    padding: 0.75rem;
    gap: 1rem;
    grid-template-columns: 3.125rem auto 1.5rem;
    align-items: center;
    backdrop-filter: blur(10.5px);
}

.dot-tooltip::before {
    position: absolute;
    width: 100%;
    height: 100%;
    content: "";
    transform: translateX(-1rem) translateY(1rem);
}
</style>