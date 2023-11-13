<script setup lang="ts">
import { IProduct } from "../../../types/product";

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

const { toMoney } = useCurrency();
</script>
<template>
	<div
		v-if="data?.image"
		class="relative mb-12 lg:mb-11 flex justify-center items-center"
	>
		<NuxtImg
			:src="data.image"
			provider="directus"
			class="rounded-[1.25rem] aspect-[4/3]"
		/>
		<template
			v-for="group of data.products"
			:key="group.productPoints_id.id"
		>
			<nuxt-link
				class="dot group"
				:style="{
					transform: `translateX(${
						group.productPoints_id.coords.split(',')[0]
					}%) translateY(${
						group.productPoints_id.coords.split(',')[1]
					}%)`,
				}"
				:to="`/catalog${group.productPoints_id.product.handle}`"
			>
				<div class="relative">
					<div
						class="dot-tooltip hidden transition-opacity opacity-0 group-hover:opacity-100 lg:group-hover:grid"
						role="tooltip"
					>
						<NuxtImg
							v-if="group.productPoints_id.product.images?.length"
							provider="directus"
							width="100"
							class="w-[3.125rem] h-[3.125rem] object-cover rounded-[0.6875rem]"
							:src="
								group.productPoints_id.product.images?.[0]
									.directus_files_id
							"
						/>
						<div class="flex flex-col overflow-auto max-w-full">
							<span
								class="font-semibold text-white text-sm text-ellipsis whitespace-nowrap overflow-hidden"
							>
								{{ group.productPoints_id.product.name }}
							</span>
							<span class="font-bold text-white text-sm">{{
								toMoney(group.productPoints_id.product.price)
							}}</span>
						</div>
						<svgo-arrow-top-right
							filled
							class="text-2xl text-white mb-auto"
						/>
					</div>
				</div>
			</nuxt-link>
		</template>
	</div>
</template>
<style scoped>
.dot {
	position: absolute;
	width: 0.87875rem;
	height: 0.87875rem;
	border-radius: 0.87875rem;
}
.dot::after {
	@apply bg-white transition-colors;
	z-index: 2;
	content: "";
	border-radius: 0.87875rem;
	position: absolute;
	width: 100%;
	height: 100%;
	bottom: 0;
	left: 0;
}
.dot:hover::after {
	@apply bg-accent-300;
}
.dot::before {
	content: "";
	border-radius: 50%;
	z-index: 1;
	position: absolute;
	width: 100%;
	transform: translateX(-0.25rem) translateY(-0.25rem);
	height: 100%;
	box-sizing: content-box;
	padding: 0.25rem;
	background-color: #51515169;
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
