<script lang="ts" setup>
import PageHeader from "~/components/page/Header.vue";
import { IBreadCrumb, ICareer } from "~/types/common";
import ImageBlock from "~/components/blocks/ImageBlock.vue";
import TableBlock from "~/components/blocks/TableBlock.vue";
import AttachesBlock from "~/components/blocks/AttachesBlock.vue";
import QuoteBlock from "~/components/blocks/QuoteBlock.vue";
import ParagraphBlock from "~/components/blocks/ParagraphBlock.vue";
import ListBlock from "~/components/blocks/ListBlock.vue";
import HeaderBlock from "~/components/blocks/HeaderBlock.vue";
import ArticlesSeems from "~/components/blocks/ideas/IdeiasBlock.vue";
import { IIdeaItem } from "~/types/ideas";
import fetchSeo from "~/composables/fetchSeo";

const { getItems } = useDirectusItems();
const route = useRoute();
const router = useRouter();

await fetchSeo()

const { data } = await useAsyncData(() =>
    getItems<ICareer>({
        collection: "career",
        params: {
            filter: {
                handle: {
                    _eq: route.params.handle.toString(),
                },
            },
            fields: ["*", "type.*"],
        },
    }),
);
const article = computed<ICareer | null>(() =>
    data.value?.length ? data.value[0] : null,
);
const breadCrumbs = computed<IBreadCrumb[]>(() => {
    const arr: IBreadCrumb[] = [
        {
            path: '/',
            title: 'Главная'
        },
        {
            path: "/career",
            title: "Карьера",
        },
    ];
    if (article.value) {
        arr.push({
            path: `/career/${article.value.handle}`,
            title: article.value.name,
        });
    }
    return arr;
});

useHead({
    title: article.value?.name ?? "Карьера",
});

const { data: news } = await useAsyncData(() => getItems<IIdeaItem>({
    collection: 'projects',
    params: {
        filter: {
            type: 'news'
        },
        limit: 3
    }
}))
</script>
<template>
    <div class="flex-1">
        <PageHeader :bread-crumbs="breadCrumbs" :link="{
            title: 'Назад',
            path: 'back',
        }" :page-name="article?.name ?? ''" />
        <div class="py-8 px-4 lg:py-[3.25rem] page">
            <div v-if="article"
                class="mb-7 lg:mb-6 flex text-xs lg:text-base font-semibold text-system-black-950 items-center gap-4 lg:gap-6">
                <div class="bg-system-gray px-8 lg:px-10 py-2 lg:py-4 rounded-full">
                    {{ article.type.title }}
                </div>
                <div>
                    {{ new Date(article.date_created).toLocaleDateString() }}
                </div>
            </div>
            <template v-for="block of article?.blocks?.blocks" :key="block.id">
                <HeaderBlock v-if="block.type === 'header'" :block="block" />
                <ParagraphBlock v-else-if="block.type === 'paragraph'" :block="block" />
                <ListBlock v-else-if="block.type === 'nestedlist'" :block="block" />
                <TableBlock v-else-if="block.type === 'table'" :block="block" />
                <AttachesBlock v-else-if="block.type === 'attaches'" :block="block" />
                <QuoteBlock v-else-if="block.type === 'quote'" :block="block" />
                <ImageBlock v-else-if="block.type === 'image'" :block="block" />
            </template>
        </div>
        <ArticlesSeems :list="news" hide-blog title="Новости компании" class="mb-[9rem]" />
    </div>
</template>