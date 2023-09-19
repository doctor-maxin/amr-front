<script lang="ts" setup>
import {PublicApi} from "@zag-js/popover";
import {normalizeProps, PropTypes, useMachine} from "@zag-js/vue";
import * as select from "@zag-js/select"
import {computed, useDeviceWidth, useUrlSearchParams, watch} from "~/.nuxt/imports";
import UiButton from "../../ui/UiButton.vue";

const props = defineProps<{
	api: PublicApi<PropTypes>
}>()

const selectData = [{
	value: 'date_created',
	label: 'По дате'
}, {
	value: 'popular',
	label: 'По популярности'
}, {
	value: 'price',
	label: 'Сначала дешевые'
}, {
	value: '-price',
	label: 'Сначала дорогие'
}]

const [state, send] = useMachine(select.machine({
	id: "sortSelect",
	collection: select.collection({
		items: selectData
	}),
	value: [selectData[0].value],
	name: 'sortSelect',
	closeOnSelect: false
}))

const apiSelect = computed(() => select.connect(state.value, send, normalizeProps))
const {isTablet} = useDeviceWidth()

watch(() => props.api.isOpen, () => {
	if (props.api.isOpen) apiSelect.value.open(); else apiSelect.value.close()
}, {
	immediate: true
})

const params = useUrlSearchParams('history', {
	initialValue: {
		sort: selectData[0].value
	}
})

const updateParam = () => {
	console.log('on update')
	params.sort = apiSelect.value.value.toString()
	apiSelect.value.close()
	props.api.close()
}

const onSortChange = (item) => {
	apiSelect.value.setValue([item.value])
	if (!isTablet.value) {
		apiSelect.value.close()
		params.sort = apiSelect.value.value.toString()
	}
}
</script>

<template>
	<div v-if="api.isOpen" class="z-20 pt-8 lg:pt-4 lg:px-0 pb-5 w-screen lg:w-[17rem] bg-white lg:bg-transparent !-left-2 px-4"
	     v-bind="api.positionerProps">
		<div v-bind="api.contentProps">
			<div class="w-full hidden lg:block">
				<button v-bind="apiSelect.triggerProps" class="flex justify-between mb-2 items-center w-full bg-system-gray rounded-[1.25rem]">
					<span class="text-xl py-5 pl-5">{{ apiSelect.valueAsString || "Select option" }}</span>
					<svgo-chevron-right filled class="rotate-90 transition-transform mr-5 mb-0 lg:text-2xl" :class="{
						'-rotate-90': apiSelect.isOpen
					}" />
				</button>
			</div>

			<div class="!static !transform-none" v-bind="apiSelect.positionerProps">
				<ul class="flex flex-col gap-4 lg:gap-0 lg:bg-system-gray lg:rounded-[1.25rem] lg:p-2.5" v-bind="apiSelect.contentProps" v-if="apiSelect.isOpen">
					<li
						v-for="item in selectData"
						:key="item.value"
						:class="{
							'border-system-gray-800 lg:border-transparent lg:bg-system-gray-600': apiSelect.value?.[0] === item.value
						}"
						class="bg-system-gray border py-5 px-6 rounded-[1.25rem] lg:px-3 lg:py-2.5 lg:rounded-xl cursor-pointer transition-colors hover:bg-system-gray-600"
						v-bind="apiSelect.getItemProps({ item })"
						@click="onSortChange(item)"
					>
						<span class="text-lg font-semibold">{{ item.label }}</span>
					</li>
				</ul>
				<UiButton class="my-4 w-full lg:hidden" title="Применить" variant="dark" @click="updateParam"/>
				<UiButton class="mb-4 lg:hidden w-full" title="Сбросить фильтры" title-class="text-center w-full" @click="api.close()"/>
			</div>
		</div>
	</div>
</template>

<style scoped>

</style>