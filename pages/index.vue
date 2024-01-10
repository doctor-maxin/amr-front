<script lang="ts" setup>
import CatalogBlock from "~/components/blocks/catalog/CatalogBlock.vue";
import FeedbackBlock from "~/components/main/FeedbackBlock.vue";
import Banner from "~/components/banner/Banner.vue";
import Advantages from "~/components/advantages/Advantages.vue";
import LazyBlocksIdeasIdeiasBlock from "~/components/blocks/ideas/IdeiasBlock.vue";
import CallBackForm from "../components/common/CallBackForm.vue";
import { computed, useDirectusItems, useHead } from "../.nuxt/imports";
import { IIdeaItem } from "../types/ideas";
import fetchSeo from "~/composables/fetchSeo";

const { getItems } = useDirectusItems();

useHead({
	title: "Автор мебельных решений",
});
await fetchSeo()


const IdeaList = await getItems<IIdeaItem>({
	collection: "projects",
	params: {
		limit: 6,
		sort: '-date_created',
		fields: ["*", "tags.blogTags_id.*"],
	},
});
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
			<LazyBlocksIdeasIdeiasBlock :list="IdeaList" subheader="ИДЕИ И ТРЕНДЫ"
				title="Современные решения и не только" />
		</div>
		<CallBackForm />
	</div>
</template>

<style scoped></style>
