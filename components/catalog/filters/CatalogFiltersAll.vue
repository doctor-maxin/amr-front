<script setup lang="ts">
import { PublicApi } from "@zag-js/popover";
import { PropTypes } from "@zag-js/vue";
import { IFilter } from "../../../types/common";
import { normalizeProps, useMachine } from "@zag-js/vue";
import * as accordion from "@zag-js/accordion";
import {
	computed,
	onMounted,
	useEvent,
	useForm,
	useListen,
	useRoute,
	useRouter,
	useUrlSearchParams,
} from "../../../.nuxt/imports";
import UiButton from "../../ui/UiButton.vue";
import * as yup from "yup";
import { useFiltersHelpers } from "../../../composables/useFiltersHelpers";

const props = defineProps<{
	api: PublicApi<PropTypes>;
	items: IFilter[];
}>();
console.log("otem", props.items);
const [state, send] = useMachine(
	accordion.machine({ id: "filtersList", multiple: true })
);
const params = useUrlSearchParams("history");
const accardionApi = computed(() =>
	accordion.connect(state.value, send, normalizeProps)
);
const schema = computed(() => {
	let sch = {};

	for (const filter of props.items) {
		sch[filter?.options_id?.id] = yup.array().of(yup.string());
	}
	return yup.object().shape(sch);
});
const { handleSubmit, setFieldValue, resetForm, resetField } = useForm({
	validationSchema: schema.value,
	keepValuesOnUnmount: true,
});
const applyFilters = handleSubmit(async (values) => {
	const activeFilters = [];
	for (const id in values) {
		if (values[id]) {
			activeFilters.push({
				id,
				values: values[id],
			});
		}
	}
	props.api.close();
	useEvent("on-filter", activeFilters);
});
const router = useRouter();
const route = useRoute();

useListen("reset-filters", () => {
	resetForm();
	for (const item of props.items) {
		resetField(item.options_id?.id, []);
	}
});
const { getFiltersFromQuery } = useFiltersHelpers();
const filteredItems = computed(() =>
	props.items.filter((item) => !!item.options_id)
);

onMounted(() => {
	const filters = getFiltersFromQuery();
	if (filters?.length) {
		for (const filterItem of filters) {
			setFieldValue(filterItem.id, filterItem.values);
		}
	}
});
</script>

<template>
	<transition
		enter-active-class="transition duration-150 ease-out"
		enter-from-class="-translate-y-4 opacity-0"
		enter-to-class="translate-y-0 opacity-100"
		leave-active-class="transition duration-150 ease-in"
		leave-from-class="translate-y-0 opacity-100"
		leave-to-class="-translate-y-4 opacity-0"
	>
		<div
			v-if="api.isOpen"
			class="z-20 pt-8 absolute right-0 top-[calc(100%_+_1rem)] lg:pt-8 lg:pl-[2.63rem] lg:pr-[1.0625rem] pb-5 lg:pb-[2.875rem] w-screen lg:max-w-[26rem] rounded-[1.25rem] bg-white lg:bg-system-gray pl-4 pr-[1.0625rem]"
		>
			<div v-bind="api.contentProps" class="max-w-full">
				<span
					class="hidden lg:block font-semibold text-[1.375rem] text-system-black-900 mb-[1.37rem]"
					>Фильтры</span
				>
				<div
					class="max-h-[46rem] overflow-y-auto scrollbar flex flex-col pr-4 gap-5"
					v-bind="accardionApi.rootProps"
				>
					<div
						v-for="item of filteredItems"
						:key="item.options_id?.id"
						class="bg-system-gray-600 rounded-xl"
						v-bind="
							accardionApi.getItemProps({
								value: item.options_id?.id,
							})
						"
					>
						<button
							v-bind="
								accardionApi.getItemTriggerProps({
									value: item.options_id?.id,
								})
							"
							class="flex justify-between w-full px-6 py-6 items-center"
						>
							<span>{{ item.options_id?.name }}</span>
							<svg
								:class="{
									'rotate-180':
										!accardionApi.getItemContentProps({
											value: item.options_id?.id,
										})?.hidden,
								}"
								xmlns="http://www.w3.org/2000/svg"
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="none"
							>
								<path
									d="M4.07992 8.91016L10.5999 15.4302C11.3699 16.2002 12.6299 16.2002 13.3999 15.4302L19.9199 8.91016"
									stroke="currentColor"
									stroke-width="1.5"
									stroke-miterlimit="10"
									stroke-linejoin="round"
									stroke-linecap="round"
								/>
							</svg>
						</button>
						<transition>
							<div
								v-if="
									!accardionApi.getItemContentProps({
										value: item.options_id?.id,
									})?.hidden
								"
								v-bind="
									accardionApi.getItemContentProps({
										value: item.options_id?.id,
									})
								"
								class="flex flex-col gap-2 pb-[1.375rem]"
							>
								<label
									v-for="val of item.options_id?.values"
									:key="val.id"
									class="flex gap-3 items-center px-5 cursor-pointer"
								>
									<vee-field
										type="checkbox"
										class="filter-input"
										:name="item.options_id?.id"
										:value="val.id"
									/>
									<span class="">{{ val.value }}</span>
								</label>
							</div>
						</transition>
					</div>
				</div>
				<div class="pt-5 pr-5">
					<UiButton
						variant="dark"
						type="submit"
						title="Применить"
						class="w-full"
						@click="applyFilters"
					/>
				</div>
			</div>
		</div>
	</transition>
</template>

<style scoped lang="scss">
.filter-input {
	accent-color: hsla(220, 8%, 22%, 1);
	width: 1.1875rem;
	appearance: none;
	height: 1.1875rem;
	border-radius: 0.3125rem;
	background-color: transparent;
	color: white;
	border: 1px solid #33363c;

	&:checked {
		background-color: hsla(220, 8%, 22%, 1);
		background-image: url(assets/icons/done.svg);
		background-repeat: no-repeat;
		background-size: 0.625rem;
		background-position: center;
	}
}
.scrollbar {
	scrollbar-width: thin;
	border-radius: 10px;
	overscroll-behavior: contain;

	@supports (scrollbar-gutter: stable) {
		scrollbar-gutter: stable;
	}

	&::-webkit-scrollbar {
		width: 7px;
	}
	&::-webkit-scrollbar-track {
		border-radius: 10px;
		background: hsla(220, 8%, 22%, 0.5);
	}
	&::-webkit-scrollbar-thumb {
		border-radius: 10px;
		background: hsla(220, 8%, 22%, 1);
	}
}
</style>
