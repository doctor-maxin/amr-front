<script setup lang="ts">
import * as fileUpload from "@zag-js/file-upload";
import { normalizeProps, useMachine } from "@zag-js/vue";
import { computed, useField } from "#imports";

interface UiFileInputProps {
	placeholder?: HTMLInputElement["placeholder"];
	name: HTMLInputElement["name"];
}

const props = defineProps<UiFileInputProps>();
const { handleChange } = useField(() => props.name);

const [state, send] = useMachine(
	fileUpload.machine({
		id: "uiFileInput",
		maxFiles: 1,
		maxFileSize: 1024 * 1024 * 10,
		name: props.name,
		onFilesChange: (details) => {
			if (details.acceptedFiles?.length)
				handleChange(details.acceptedFiles[0]);
			else handleChange(undefined);
		},
	})
);

const api = computed(() =>
	fileUpload.connect(state.value, send, normalizeProps)
);
</script>
<template>
	<label
		class="relative file-input w-full ring-accent-100"
		v-bind="api.rootProps"
		:class="{
			ring: api.isDragging,
		}"
	>
		<span
			v-bind="api.dropzoneProps"
			v-if="api.files.length === 0"
			class="flex justify-between items-center cursor-pointer"
		>
			<input v-bind="api.hiddenInputProps" />
			<button
				class="font-semibold text-system-gray-900"
				v-bind="api.triggerProps"
			>
				{{ api.isDragging ? "Отпустите файл" : placeholder }}
			</button>
			<svgo-file-upload filled class="text-2xl" />
		</span>
		<li
			v-if="api.files.length"
			v-for="file in api.files"
			:key="file.name"
			class="flex justify-between items-center"
		>
			<span class="font-semibold line-clamp-1 text-system-gray-900">{{
				file.name
			}}</span>
			<button v-bind="api.getDeleteTriggerProps({ file })">
				<svgo-close class="text-2xl" filled />
			</button></li
	></label>
</template>
<style scoped lang="scss">
.file-input {
	@apply px-7 py-4 rounded-[5rem] border border-dashed border-system-black-900;
	background-color: transparent;

	svg {
		margin-bottom: 0;
	}
}
</style>
