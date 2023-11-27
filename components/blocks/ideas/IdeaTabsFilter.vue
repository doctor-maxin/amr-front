<script setup lang="ts">
import { ITag } from "~/types/common";

const props = defineProps<{
	activeTags: string[] | undefined;
}>();
const emit = defineEmits<{
	(event: "change", val: number): void;
}>();

const onClick = (v: number) => {
	emit("change", v);
};

const { data: tags } = useNuxtData<ITag[]>("tags");
</script>
<template>
	<div
		class="flex -mx-4 px-4 gap-3 overflow-x-auto snap-x snap-mandatory snap-end"
	>
		<template v-for="tag of tags" :key="tag.id">
			<button
				type="button"
				@click="onClick(tag.id)"
				:class="{
					'border-accent-300': activeTags?.includes(
						tag.id.toString()
					),
					'border-system-gray': !activeTags?.includes(
						tag.id.toString()
					),
				}"
				class="text-sm lg:text-base px-7 py-2 lg:py-3.5 border bg-system-gray rounded-[5rem] font-semibold"
			>
				{{ tag.title }}
			</button>
		</template>
	</div>
</template>
