<script lang="ts" setup>
import PageHeader from "~/components/page/Header.vue";
import {
	markRaw,
	ref,
	useAppConfig,
	useDirectusItems,
	watchEffect,
	useHead,
} from "../../.nuxt/imports";
import { IBreadCrumb, ITag } from "../../types/common";
import UiSpinner from "~/components/ui/UiSpinner.vue";
import { type IIdeaItem, IIdeaType } from "../../types/ideas";
import { useUrlSearchParams } from "@vueuse/core/index";
import UiPagination from "~/components/ui/UiPagination.vue";
import IdeasBlockCard from "~/components/blocks/ideas/IdeasBlockCard.vue";
import { useBlogStore } from "../../store/blog.store";
import IdeaTabsFilter from "~/components/blocks/ideas/IdeaTabsFilter.vue";
import fetchSeo from "~/composables/fetchSeo";

useHead({
	title: "Идеи и тренды",
});
await fetchSeo()

const breadCrumbs = markRaw<IBreadCrumb[]>([
	{
		title: "Главная",
		path: "/",
	},
	{
		title: "Идеи и тренды",
		path: "/blog",
	},
]);
const isLoading = ref<boolean>(false);
const totalCount = ref<number>(0);
const appConfig = useAppConfig();
const articles = ref<IIdeaItem[]>([]);
const { getItems } = useDirectusItems();
const blogStore = useBlogStore();
const params = useUrlSearchParams<{
	page: string;
	tags: string[];
}>("history", {
	initialValue: {
		page: "1",
		tags: [],
	},
});

watchEffect(async () => {
	isLoading.value = true;
	let filter = {};
	if (typeof params.tags === "string") {
		filter["tags"] = {
			blogTags_id: {
				id: {
					_eq: Number(params.tags),
				},
			},
		};
	} else if (Array.isArray(params.tags) && params.tags.length) {
		filter["tags"] = {
			blogTags_id: {
				id: {
					_in: params.tags.map((t) => Number(t)),
				},
			},
		};
	}
	const response = await getItems<IIdeaItem>({
		collection: "projects",
		params: {
			meta: "filter_count",
			page: Number(params.page),
			limit: 12,
			sort: '-date_created',
			fields: ["*", "tags.blogTags_id.title"],
			filter,
		},
	});
	if (response?.meta?.filter_count)
		totalCount.value = response.meta.filter_count;
	if (response.data) articles.value = response.data;
	if (response.data.length) blogStore.setToList(response.data);
	isLoading.value = false;
});

const onChangeTag = (id: number) => {
	console.log(typeof params.tags, id);
	if (Array.isArray(params.tags)) {
		if (params.tags.includes(id.toString())) {
			params.tags = params.tags.filter((t) => t !== id.toString());
		} else params.tags.push(id.toString());
	} else if (typeof params.tags === "string") {
		if (params.tags === id.toString()) {
			params.tags = [];
		} else params.tags = [params.tags, id.toString()];
	} else {
		params.tags = [id.toString()];
	}
};
</script>

<template>
	<div class="flex-1">
		<PageHeader :bread-crumbs="breadCrumbs" page-name="Идеи и тренды" />
		<main class="pt-[2.375rem] mx-auto max-w-[120rem] px-4 pb-[6.88rem] lg:pb-[8.75rem] lg:pt-[4.63rem]">
			<template v-if="isLoading">
				<UiSpinner />
			</template>
			<template v-else>
				<template v-if="articles.length">
					<IdeaTabsFilter :active-tags="params.tags" class="mb-5 lg:mb-11" @change="onChangeTag" />
					<div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-[1.875rem]">
						<template v-for="item of articles">
							<IdeasBlockCard :item="item" />
						</template>
					</div>
					<UiPagination :limit="12" :page="+params.page" :total="totalCount" class="mt-6"
						@onPage="params.page = $event" />
				</template>
				<div v-else
					class="mt-[1rem] text-center mx-auto lg:text-2xl font-semibold lg:mt-[2.5rem] text-system-black-900 text-opacity-40">
					{{ appConfig.articles.emptyList }}
				</div>
			</template>
		</main>
	</div>
</template>

<style scoped></style>
