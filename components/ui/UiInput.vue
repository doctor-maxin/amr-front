<script setup lang="ts">
import { Mask } from "maska";
import { ref, useField, watch } from "~/.nuxt/imports";

interface UIInputProps {
	type?: HTMLInputElement["type"];
	placeholder?: HTMLInputElement["placeholder"];
	autocomplete?: HTMLInputElement["autocomplete"];
	name: HTMLInputElement["name"];
	hideError?: boolean;
	readonly?: HTMLInputElement["readOnly"];
	className?: HTMLInputElement["className"];
}

const maskMaker = new Mask({
	mask: "+7 ### ### ##-##",

});
const input = ref<HTMLInputElement | null>(null);
const props = defineProps<UIInputProps>();
const { value, handleChange, errorMessage, meta } = useField(() => props.name);

watch(value, (val: any) => {
	if (props.type === "tel") {
		console.dir(value.value)
		console.dir(val)

		if (['7', '8', '+7', '+7 7', '+7 8'].includes(value.value)) {
			if (['7', '8', '+7 ', '+7 7', '+7 8'].includes(val)) {
				const maskedValue = maskMaker.masked('+7 ');
				handleChange(maskedValue)
			} else {
				const maskedValue = maskMaker.masked(val);
				handleChange(maskedValue)
			}
		} else {
			const maskedValue = maskMaker.masked(val);
			handleChange(maskedValue)
		}

	} else {
		handleChange(val)
	}
});

defineExpose({
	input,
});
</script>

<template>
	<label class="relative w-full" :class="{
		'cursor-not-allowed pointer-events-none': readonly,
	}">
		<input v-model="value" :name="name" :autocomplete="autocomplete" :placeholder="placeholder" :readonly="readonly"
			:type="type" ref="input"
			class="rounded-[2.38rem] px-6 py-4 bg-white font-semibold text-system-gray-800 placeholder:text-system-gray-800 placeholder:text-opacity-70 border focus:outline-none ring-accent-100 focus:ring"
			:class="[
				className,
				{
					'border-red-400': meta.touched && errorMessage,
					'border-system-gray-800': !(meta.touched && errorMessage),
					'hover:border-accent-300 !bg-transparent': hideError,
					'focus:ring-0 !cursor-not-allowed pointer-events-none':
						readonly,
				},
			]" />
		<span v-if="meta.touched && errorMessage && !hideError" class="text-red-500 text-xs absolute bottom-1 left-6">
			{{ errorMessage }}
		</span>
	</label>
</template>

<style scoped></style>
