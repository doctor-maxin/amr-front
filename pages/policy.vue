<template>
	<div class="flex-1">
		<PageHeader
			page-name="Политика конфиденциальности"
			:bread-crumbs="breadCrumbs"
		/>
		<main>
			<div class="py-8 lg:py-[3.25rem] page">
				<template
					v-for="block of data?.content?.blocks"
					:key="block.id"
				>
					<HeaderBlock
						v-if="block.type === 'header'"
						:block="block"
					/>
					<ParagraphBlock
						v-else-if="block.type === 'paragraph'"
						:block="block"
					/>
					<ListBlock
						v-else-if="block.type === 'nestedlist'"
						:block="block"
					/>
					<TableBlock
						v-else-if="block.type === 'table'"
						:block="block"
					/>
					<AttachesBlock
						v-else-if="block.type === 'attaches'"
						:block="block"
					/>
					<QuoteBlock
						v-else-if="block.type === 'quote'"
						:block="block"
					/>
					<ImageBlock
						v-else-if="block.type === 'image'"
						:block="block"
					/>
				</template>
			</div>
			{{}}
		</main>
	</div>
</template>

<script setup lang="ts">
import PageHeader from "~/components/page/Header.vue";
import { markRaw, useAsyncData, useDirectusItems, useHead } from "#imports";
import { IBreadCrumb } from "~/types/common";
import ParagraphBlock from "~/components/blocks/ParagraphBlock.vue";
import AttachesBlock from "~/components/blocks/AttachesBlock.vue";
import ImageBlock from "~/components/blocks/ImageBlock.vue";
import QuoteBlock from "~/components/blocks/QuoteBlock.vue";
import TableBlock from "~/components/blocks/TableBlock.vue";
import HeaderBlock from "~/components/blocks/HeaderBlock.vue";
import ListBlock from "~/components/blocks/ListBlock.vue";

useHead({
  title: 'Политика конфиденциальности'
})

const breadCrumbs = markRaw<IBreadCrumb[]>([
	{
		path: "/",
		title: "Главная",
	},
	{
		path: "/policy",
		title: "Политика конфиденциальности",
	},
]);

const { getSingletonItem } = useDirectusItems();

const { data } = useAsyncData(() =>
	getSingletonItem({
		collection: "policy",
	})
);
</script>

<style scoped>
.page {
	margin-left: auto;
	margin-right: auto;
	max-width: 54.6875rem;
}
</style>
