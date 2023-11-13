<script setup lang="ts">
import HeaderBlock from "~/components/blocks/HeaderBlock.vue";
import ParagraphBlock from "~/components/blocks/ParagraphBlock.vue";
import ListBlock from "~/components/blocks/ListBlock.vue";
import TableBlock from "~/components/blocks/TableBlock.vue";
import AttachesBlock from "~/components/blocks/AttachesBlock.vue";
import QuoteBlock from "~/components/blocks/QuoteBlock.vue";
import ImageBlock from "~/components/blocks/ImageBlock.vue";
import ArticleSlider from "./ArticleSlider.vue";

const props = defineProps<{
	item: any;
}>();
const data = ref([]);

const { getItems } = useDirectusItems();

watchEffect(async () => {
	data.value = await getItems({
		collection: props.item.collection,
		params: {
			filter: {
				id: props.item.item,
			},
			fields: [
				"*",
				"products.productPoints_id.*",
				"products.productPoints_id.product.name",
				"products.productPoints_id.product.handle",
				"products.productPoints_id.product.price",
				"products.productPoints_id.product.images.directus_files_id",
			],
		},
	});
});
</script>
<template>
	<div v-if="item.collection === 'blogBlocks' && data?.length">
		<template v-for="block of data[0].content?.blocks" :key="block.id">
			<HeaderBlock v-if="block.type === 'header'" :block="block" />
			<ParagraphBlock
				v-else-if="block.type === 'paragraph'"
				:block="block"
			/>
			<ListBlock v-else-if="block.type === 'nestedlist'" :block="block" />
			<TableBlock v-else-if="block.type === 'table'" :block="block" />
			<AttachesBlock
				v-else-if="block.type === 'attaches'"
				:block="block"
			/>
			<QuoteBlock v-else-if="block.type === 'quote'" :block="block" />
			<ImageBlock v-else-if="block.type === 'image'" :block="block" />
		</template>
	</div>
	<div v-else-if="item.collection === 'blogProductPoints' && data?.length">
		<ArticleSlider :data="data[0]" />
	</div>
</template>
