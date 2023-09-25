<script setup lang="ts">
import { PublicApi } from "@zag-js/popover";
import { PropTypes } from "@zag-js/vue";
import { IFilter } from "../../../types/common";
import { normalizeProps, useMachine } from "@zag-js/vue";
import * as accordion from "@zag-js/accordion";
import { computed } from "../../../.nuxt/imports";

const props = defineProps<{
	api: PublicApi<PropTypes>;
	items: IFilter[];
}>();

const [state, send] = useMachine(
	accordion.machine({ id: "filtersList", multiple: true })
);
const accardionApi = computed(() =>
	accordion.connect(state.value, send, normalizeProps)
);
</script>

<template>
	<div
		v-if="api.isOpen"
		class="z-20 pt-8 lg:pt-8 lg:px-[2.63rem] pb-5 lg:pb-[2.875rem] w-screen lg:max-w-[26rem] rounded-[1.25rem] bg-white lg:bg-system-gray !-left-2 px-4"
		v-bind="api.positionerProps"
	>
		<div v-bind="api.contentProps">
			<span
				class="hidden lg:block font-semibold text-[1.375rem] text-system-black-900 mb-[1.37rem]"
				>Фильтры</span
			>
			<div
				class="max-h-[46rem] overflow-y-auto flex flex-col gap-5"
				v-bind="accardionApi.rootProps"
			>
				<div
					v-for="item of items"
					:key="item.options_id.id"
					class="bg-system-gray-600 rounded-xl"
					v-bind="
						accardionApi.getItemProps({ value: item.options_id.id })
					"
				>
					<button
						v-bind="
							accardionApi.getItemTriggerProps({
								value: item.options_id.id,
							})
						"
						class="flex justify-between w-full px-6 py-6 items-center"
					>
						<span>{{ item.options_id.name }}</span>
						<svg
							:class="{
								'rotate-180': !accardionApi.getItemContentProps(
									{ value: item.options_id.id }
								)?.hidden,
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
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
						</svg>
					</button>
					<div
						v-bind="
							accardionApi.getItemContentProps({
								value: item.options_id.id,
							})
						"
						class="flex flex-col gap-2"
					>
						<label
							v-for="val of item.options_id.values"
							:key="val.id"
						>
							<input type="checkbox" :name="val.id" />
							<span>{{ val.value }}</span>
						</label>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped></style>
