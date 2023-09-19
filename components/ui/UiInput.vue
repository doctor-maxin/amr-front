<script setup lang="ts">
import { Mask } from 'maska';
import {useField, watch} from "~/.nuxt/imports";

interface UIInputProps {
	type?: HTMLInputElement['type'];
	placeholder?: HTMLInputElement['placeholder'];
	name: HTMLInputElement['name'];
	className?: HTMLInputElement['className'];
}

const maskMaker = new Mask({ mask: '+7 ### ### ##-##' });

const props = defineProps<UIInputProps>()
const {value, handleChange, errorMessage, meta} = useField(() => props.name)

watch(value, (val: any) => {
	if (props.type === 'tel') {
		const maskedValue = maskMaker.masked(val);
		handleChange(maskedValue)
	}
})

</script>

<template>
	<label class="relative w-full">
	<VeeField :name="name" :placeholder="placeholder" :type="type" class="rounded-[2.38rem] px-6 py-4 bg-white font-semibold text-system-gray-800 placeholder:text-system-gray-800 border focus:outline-none border-system-gray-800 ring-accent-100 focus:ring invalid:ring-red-500"
	          :class="[className, {
				  'border-red-400': meta.touched && errorMessage
	          }]"
	/>
		<span v-if="meta.touched && errorMessage" class="text-red-500 text-xs absolute bottom-1 left-6">
			{{errorMessage}}
		</span>
	</label>
</template>

<style scoped>

</style>