<script setup lang="ts">
import { IProduct } from "../../../types/product";
import ArticleDot from './ArticleDot.vue'

defineProps<{
	data?: {
		image: string;
		products: {
			productPoints_id: {
				id: number;
				coords: string;
				product: Pick<IProduct, "handle" | "price" | "name"> & {
					images: {
						directus_files_id: string;
					}[];
				};
			};
		}[];
	};
}>();

const img = ref<HTMLElement | null>(null);

</script>
<template>
	<div v-if="data?.image" ref="img" class="relative mb-12 lg:mb-11 flex justify-center items-center">
		<NuxtImg :src="data.image" provider="directus" class="rounded-[1.25rem] aspect-[4/3]" />
		<template v-for="group of data.products" :key="group.productPoints_id.id">
			<ArticleDot :coords="group.productPoints_id.coords" :img="img" :product="group.productPoints_id.product" />
		</template>
	</div>
</template>

