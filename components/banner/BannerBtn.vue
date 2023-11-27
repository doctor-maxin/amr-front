<script setup lang="ts">
const props = defineProps<{
	title?: string;
	to: string;
}>();
const eventList = ["toFeedBack"];
const router = useRouter();

const onClick = () => {
	if (eventList.includes(props.to)) {
		//@ts-ignore
		useEvent(props.to, true);
	} else {
		router.push(props.to);
	}
};
</script>
<template>
	<button
		@click.prevent="onClick"
		class="flex group/btn h-[3.25rem] lg:h-[4.25rem] border-[1.5px] bg-transparent hover:bg-accent-300 transition-colors hover:border-accent-300 border-system-black-950 items-center lg:gap-3 lg:px-[1.87rem] gap-6 px-5 rounded-[4rem]"
	>
		<span
			class="font-semibold transition-colors group-hover/btn:text-white text-system-black-950 text-base"
			>{{ title }}</span
		>
		<svgo-arrow-right
			v-if="!eventList.includes(to)"
			class="text-2xl transition-colors group-hover/btn:text-white"
			filled
		/>
	</button>
</template>

<style scoped></style>
