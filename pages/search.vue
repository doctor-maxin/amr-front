<script lang="ts" setup>
import UiButton from "~/components/ui/UiButton.vue";
import { useUrlSearchParams } from "@vueuse/core";
import { IProduct } from "~/types/product";
import { onMounted, ref, useDirectusItems, watch } from "../.nuxt/imports";

const params = useUrlSearchParams("history");
const search = ref(params?.search?.toString() ?? "");
const { getItems } = useDirectusItems();
const isLoading = ref(false);
const list = ref<IProduct[]>([]);

watch(search, (val) => {
	params.search = val;
});

const searchProducts = async () => {
	try {
		isLoading.value = true;
		const items = await getItems<IProduct>({
			collection: "products",
			params: {
				search: search.value,
				fields: [
					"images.directus_files_id",
					"price",
					"handle",
					"name",
					"meta",
				],
				limit: 8,
				page: 1,
			},
		});
		list.value = items;
		console.log(items);
	} catch (e: any) {
		console.error(e);
	}
	isLoading.value = false;
};
onMounted(() => {
	if (search.value) searchProducts();
});
</script>

<template>
	<main
		class="px-4 flex-1 pt-[2.375rem] lg:pt-[4.5rem] lg:px-0 lg:max-w-[73.5rem] mx-auto w-full pb-[6.8rem]"
	>
		<form
			action=""
			class="relative flex items-center mb-[2.37rem] lg:mb-[5rem]"
			@submit.prevent="searchProducts"
		>
			<input
				v-model="search"
				class="border transition-colors focus:outline-none hover:border-accent-300 focus:border-accent-300 appearance-none seaerch w-full border-black rounded-[2.38rem] pl-7 pr-[7rem] py-3.5 text-base font-semibold"
				placeholder="Поиск по запросу"
				type="search"
			/>
			<UiButton
				class="!py-3 !px-[1.7rem] max-h-11 absolute right-[0.31rem]"
				title="Поиск"
				title-class="text-[1rem] font-medium"
				variant="dark"
			/>
		</form>
		<h2
			v-if="list.length"
			class="hidden text-2xl lg:mb-[1.38rem] font-semibold lg:block"
		>
			Товары:
		</h2>
		<template v-if="isLoading">
			<span class="text-2xl font-semibold">Загрузка...</span>
		</template>
		<template v-else>
			<div
				class="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-y-[1.38rem] lg:gap-x-[1.88rem]"
				v-if="list?.length"
			>
				<template v-for="product of list" :key="product.id">
					<nuxt-link
						:to="`/catalog${product.handle ?? ''}`"
						class="w-full p-[1.125rem] lg:p-[0.875rem] bg-system-gray-500 rounded-[1.25rem] grid grid-cols-[4.375rem_auto] items-center lg:grid-cols-[6.25rem_auto] gap-[1.31rem] lg:gap-[1.44rem]"
					>
						<NuxtImg
							:src="
								product.images?.length
									? product.images[0].directus_files_id
									: '668abdf6-1ee7-42fe-a5a6-b5ce1f846586'
							"
							provider="directus"
							width="150"
							class="rounded-[0.635rem] lg:rounded-[1.25rem] aspect-square object-cover"
						/>
						<div class="flex flex-col gap-[0.135rem]">
							<span
								class="font-semibold text-system-black-900 lg:text-2xl"
								>{{ product.name }}</span
							>
							<span
								class="font-semibold text-system-black-900 lg:text-2xl"
								>{{ product.price }}</span
							>
						</div>
					</nuxt-link>
				</template>
			</div>
			<div v-else>
				<span class="text-2xl font-semibold">Ничего не найдено...</span>
			</div>
		</template>
	</main>
</template>

<style scoped></style>
