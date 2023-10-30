<script setup lang="ts">
import PageHeader from "~/components/page/Header.vue";
import {
	computed,
	useAsyncData,
	useDirectusItems,
	useHead,
} from "../.nuxt/imports";
import { IBreadCrumb, ICustomerPageFull } from "../types/common";
import AboutHeroBlock from "../components/about/AboutHeroBlock.vue";
import AboutPageImages from "../components/about/AboutPageImages.vue";
import AboutParterns from "../components/about/AboutParterns.vue";
import AboutVarranty from "../components/about/AboutVarranty.vue";
import AboutWay from "../components/about/AboutWay.vue";
import CallBackForm from "../components/common/CallBackForm.vue";

const { getSingletonItem } = useDirectusItems();
const { data } = await useAsyncData(() =>
	getSingletonItem<{
		header: string;
		pageImages: ICustomerPageFull["blocks"];
		partnersLogos: ICustomerPageFull["blocks"];
		ideasAndRealization: ICustomerPageFull["blocks"];
		warrantyImage: string;
		warrantyText: string;
		title: string;
		textCloseTitle: string;
	}>({
		collection: "aboutPage",
	}),
);

useHead({
	title: data.value?.header ?? "",
});

const breadCrumbs = computed<IBreadCrumb[]>(() => [
	{
		path: "/",
		title: "Главная",
	},
	{
		path: "/about",
		title: data.value?.header ?? "",
	},
]);
</script>

<template>
	<main class="flex-1">
		<PageHeader :page-name="data?.header ?? 'О нас'" :bread-crumbs="breadCrumbs" />
		<div class="pt-[2.375rem] max-w-[111.25rem] mx-auto px-4 lg:px-[4.315rem]" v-if="data">
			<AboutHeroBlock :title="data.title" :description="data.textCloseTitle" />
			<AboutPageImages v-if="data.pageImages?.blocks?.length" :list="data.pageImages.blocks.length < 8
					? [...data.pageImages.blocks, ...data.pageImages.blocks]
					: data.pageImages.blocks
				" class="pb-[3rem] lg:pb-[13.375rem] lg:-mx-[calc(calc(100%_-_100vw)_/_2)]" />
			<AboutParterns v-if="data.partnersLogos?.blocks?.length" :list="[
				...data.partnersLogos.blocks,
				...data.partnersLogos.blocks,
				...data.partnersLogos.blocks,
			]" class="pb-[3rem] lg:pb-[6.44rem]" />
			<AboutVarranty :image="data.warrantyImage" :text="data.warrantyText" class="pb-[3rem] lg:pb-[6.44rem]" />
			<AboutWay v-if="data.ideasAndRealization?.blocks?.length" :list="data.ideasAndRealization.blocks"
				class="-mt-12 lg:mb-0" />
		</div>
		<CallBackForm />
	</main>
</template>

<style scoped></style>
