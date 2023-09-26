<script lang="ts" setup>
import { ICategory } from "~/types/common";
import { computed, ref, useNuxtData, useRouter } from "~/.nuxt/imports";
import { PublicApi } from "@zag-js/popover";
import { PropTypes } from "@zag-js/vue";

const props = defineProps<{
	api: PublicApi<PropTypes>;
}>();

const { data: categories } = useNuxtData<ICategory[]>("categories");
const mainCategories = computed(() =>
	categories.value?.filter((item: any) => !item.parentId)
);
const selectedCategory = ref<ICategory | null>(null);
const subCategories = computed(() =>
	categories.value?.filter((item: any) =>
		selectedCategory.value?.childrens.includes(item.id)
	)
);
const router = useRouter();

const selectCategory = (item: ICategory) => {
	if (item.childrens.length) {
		selectedCategory.value = item;
	} else {
		props.api.close();
		router.push("/catalog" + item.handle);
	}
};
</script>

<template>
	<div class="relative">
		<div
			:class="{
				'-translate-x-full': selectedCategory,
			}"
			class="flex w-full absolute transition-transform flex-col gap-[1.375rem] items-start"
		>
			<template v-for="item of mainCategories" :key="item.id">
				<button
					class="text-xl text-system-gray-800 font-semibold flex justify-between w-full"
					@click="selectCategory(item)"
				>
					<span>{{ item.name }}</span>
					<svgo-arrow-filled class="text-[1.6875rem]" filled />
				</button>
			</template>
		</div>
		<transition
			enter-active-class="transition duration-200 ease-out"
			enter-from-class="translate-x-full opacity-0"
			enter-to-class="translate-x-0 opacity-100"
			leave-active-class="transition duration-150 ease-in"
			leave-from-class="translate-x-0 opacity-100"
			leave-to-class="translate-x-full opacity-0"
		>
			<div
				v-if="selectedCategory"
				:class="{}"
				class="flex w-full absolute left-0 transition-transform flex-col"
			>
				<button
					class="text-xl mb-8 text-system-gray-800 font-semibold gap-4 flex w-full"
					@click="selectedCategory = null"
				>
					<svgo-arrow-filled
						class="text-[1.6875rem] rotate-180"
						filled
					/>
					<span>{{ selectedCategory?.name }}</span>
				</button>
				<div class="flex flex-col gap-[1.135rem]">
					<template v-for="item of subCategories" :key="item.id">
						<nuxt-link
							:to="`/catalog${item.handle}`"
							class="cursor-pointer hover:underline"
							@click.native="api.close()"
							><span class="text-system-black-900 font-medium">{{
								item.name
							}}</span></nuxt-link
						>
					</template>
				</div>
			</div>
		</transition>
	</div>
</template>

<style scoped></style>
