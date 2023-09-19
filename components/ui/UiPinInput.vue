<script lang="ts" setup>
import * as pinInput from "@zag-js/pin-input";
import {normalizeProps, useMachine} from "@zag-js/vue";
import {useField} from "vee-validate";
import {computed, onMounted} from "~/.nuxt/imports";

interface UIInputProps {
	name: HTMLInputElement['name'];
	className?: HTMLInputElement['className'];
}

const props = defineProps<UIInputProps>()
const {handleChange, errorMessage, meta} = useField(() => props.name)

const onComplete = (details) => {
	handleChange(details.value.join(''))
}

const [state, send] = useMachine(
	pinInput.machine({
		id: "signInCode",
		blurOnComplete: true,
		type: "alphanumeric",
		otp: true,
		value: ['', '', '', ''],
		onComplete
	})
);
const api = computed(() => pinInput.connect(state.value, send, normalizeProps));

onMounted(() => {
	if (api.value) api.value.focus()
})
</script>

<template>
	<label class="relative w-full">
		<client-only>
			<div ref="ref" v-bind="api.rootProps" class="flex flex-row items-center justify-center gap-[1.12rem]">
				<input v-bind="api.getInputProps({ index: 0 })"/>
				<input v-bind="api.getInputProps({ index: 1 })"/>
				<input v-bind="api.getInputProps({ index: 2 })"/>
				<input v-bind="api.getInputProps({ index: 3 })"/>
			</div>
		</client-only>
		<span v-if="meta.touched && errorMessage" class="text-red-500 text-xs absolute bottom-1 left-6">
			{{ errorMessage }}
		</span>
	</label>
</template>

<style scoped lang="scss">
input[data-scope="pin-input"] {
	@apply w-[3.375rem] h-[3.375rem] bg-transparent border border-system-gray-800 rounded-full flex items-center justify-center text-[1.25rem] text-center font-semibold ring-accent-100 focus:outline-none focus:ring invalid:ring-red-500;
}
</style>