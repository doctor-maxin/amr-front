<script lang="ts" setup>
import { useDeviceWidth } from "../../composables/useDeviceWidth";
import * as popover from "@zag-js/popover";
import { normalizeProps, useMachine } from "@zag-js/vue";
import {
	computed,
	ref,
	useEvent,
	useListen,
	useUrlSearchParams,
} from "~/.nuxt/imports";
import CatalogFiltersSort from "./filters/CatalogFiltersSort.vue";
import CatalogFiltersAll from "./filters/CatalogFiltersAll.vue";
import { IFilter } from "../../types/common";

const { isMobile } = useDeviceWidth();

const [state, send] = useMachine(popover.machine({ id: "catalogSort" }));
const sortApi = computed(() =>
	popover.connect(state.value, send, normalizeProps)
);
const { filters } = useUrlSearchParams();
const hasFilters = ref(!!filters);

const [stateFilter, sendFilter] = useMachine(
	popover.machine({ id: "catalogFilter" })
);
const filterApi = computed(() =>
	popover.connect(stateFilter.value, sendFilter, normalizeProps)
);

defineProps<{
	items: IFilter[];
	hideSort?: boolean
}>();

const resetFilters = () => {
	useEvent("reset-filters");
	hasFilters.value = false;
};

useListen("on-filter", (values) => {
	if (values?.length) hasFilters.value = true;
});
</script>

<template>
	<div>
		<teleport :disabled="isMobile" to="#filters-slot">
			<div
				class="flex justify-between pb-8 lg:pb-0 lg:justify-start w-full items-center gap-7 relative"
			>
				<button
					v-if="hasFilters"
					class="hidden lg:flex gap-2 items-center"
					@click="resetFilters"
				>
					<svgo-close filled class="text-2xl" />
					<span
						class="font-semibold lg:text-xl group-hover:lg:text-accent-300 transition-colors"
						>Сбросить фильтры</span
					>
				</button>
				<button
					v-bind="filterApi.triggerProps"
					class="flex px-3 py-2.5 lg:px-0 lg:py-0 lg:bg-transparent gap-2 bg-system-gray rounded-[5rem] lg:gap-1.5 group transition-colors items-center"
					type="button"
				>
					<svgo-filter
						filled
						class="text-base lg:text-2xl transition-colors group-hover:lg:text-accent-300"
					/>
					<span
						class="text-sm lg:text-xl font-semibold group-hover:lg:text-accent-300 transition-colors"
						>Фильтр</span
					>
				</button>
				<button
					v-if="!hideSort"
					v-bind="sortApi.triggerProps"
					:class="{
						'bg-accent-300 text-white lg:text-inherit':
							sortApi.isOpen,
						'bg-system-gray': !sortApi.isOpen,
					}"
					class="flex px-3 py-2.5 lg:px-0 lg:py-0 lg:bg-transparent group rounded-[5rem] gap-2 lg:gap-1.5 items-center"
					type="button"
				>
					<svgo-sort
						filled
						class="text-base lg:text-2xl transition-colors group-hover:lg:text-accent-300"
					/>
					<span
						class="text-sm lg:text-xl font-semibold group-hover:lg:text-accent-300 transition-colors"
						>Сортировка</span
					>
				</button>
				<CatalogFiltersSort
					v-if="!hideSort"
					:api="sortApi" />
				<CatalogFiltersAll :items="items" :api="filterApi" />
			</div>
		</teleport>
	</div>
</template>

<style scoped></style>
