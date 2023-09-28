<script lang="ts" setup>
import { PublicApi } from "@zag-js/popover";
import { PropTypes } from "@zag-js/vue";
import { ICategory } from "~/types/common";
import {
	computed,
	onMounted,
	ref,
	useNuxtData,
	useRouter,
} from "~/.nuxt/imports";

const props = defineProps<{
	api: PublicApi<PropTypes>;
	catalogBtn?: HTMLButtonElement | null;
}>();

const leftOffset = ref(0);
const topOffset = ref(0);
const { data: categories } = useNuxtData<ICategory[]>("categories");
const router = useRouter();
const mainCategories = computed(() =>
	categories.value?.filter((item: any) => !item.parentId)
);
const selectedCategory = ref(
	mainCategories.value?.find((item: any) => item.childrens.length)
);
const subCategories = computed(() =>
	categories.value?.filter((item: any) =>
		selectedCategory.value?.childrens.includes(item.id)
	)
);
const setOffsets = () => {
	const bound = props.catalogBtn?.getBoundingClientRect();
	if (!bound) {
		topOffset.value = 0;
		leftOffset.value = 0;
	} else {
		topOffset.value = bound.bottom;
		leftOffset.value = bound.left + bound.width;
	}
};
onMounted(() => {
	setOffsets();
	window.addEventListener("resize", setOffsets);
});
const openLink = (item: ICategory) => {
	if (item.childrens.length === 0) {
		props.api.close();
		router.push("/catalog" + item.handle);
	} else selectedCategory.value = item;
};
</script>

<template>
	<transition
		enter-active-class="transition duration-200 ease-out"
		enter-from-class="-translate-y-2 opacity-0"
		enter-to-class="translate-y-0 opacity-100"
		leave-active-class="transition duration-150 ease-in"
		leave-from-class="translate-y-0 opacity-100"
		leave-to-class="-translate-y-2 opacity-0"
	>
		<div
			v-show="api.isOpen"
			ref="marker"
			:style="{
				top: topOffset + 'px',
				height: `calc(100vh - ${topOffset}px)`,
				gridTemplateColumns: `${leftOffset}px 1fr`,
			}"
			class="absolute w-full left-0 bg-system-gray grid"
		>
			<div
				class="pl-[4.375rem] z-[31] pr-[3.7rem] pt-[5.2rem] flex flex-col gap-1 overflow-y-auto"
			>
				<template v-for="item of mainCategories" :key="item.id">
					<nuxt-link
						:class="{
							'bg-system-gray-500':
								selectedCategory?.id === item.id,
						}"
						:to="`/catalog${item.handle ?? ''}`"
						active-class="bg-system-gray-500"
						class="rounded-[1.25rem] px-[2.25rem] py-[1.2rem] w-full cursor-pointer transition-colors hover:bg-system-gray-500"
						@click.prevent="openLink(item)"
					>
						<span
							class="font-bold text-[1.5rem] text-system-black-900"
							>{{ item.name }}</span
						>
					</nuxt-link>
				</template>
			</div>
			<div
				class="w-full max-h-full overflow-y-auto bg-system-gray-500 py-[6.3125rem] px-[11.25rem] grid items-start auto-rows-min grid-flow-row gap-4"
			>
				<template v-for="item of subCategories">
					<nuxt-link
						@click.native="api.close()"
						:to="`/catalog${item.handle ?? ''}`"
						class="main-catalog-link cursor-pointer hover:underline"
						><span
							class="text-xl text-system-black-900 font-medium"
							>{{ item.name }}</span
						></nuxt-link
					>
				</template>
			</div>
		</div>
	</transition>
</template>

<style lang="scss" scoped>
.main-menu {
	&-content {
		height: calc(100dvh - 3.875rem);

		@media (min-width: 1024px) {
			height: calc(100dvh - 5.3125rem);
		}
	}
}
.router-link-active.router-link-exact-active.main-catalog-link {
	text-decoration-line: underline;
}
</style>
