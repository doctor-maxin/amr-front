<script lang="ts" setup>
withDefaults(
	defineProps<{
		to: string;
		title?: string;
		variant?: "default" | "filled" | "empty" | "dark";
		color?: string;
	}>(),
	{
		title: "",
		variant: "default",
		color: "text-system-gray-800",
	}
);
</script>

<template>
	<template v-if="variant === 'default'">
		<nuxt-link
			:to="to"
			@click="$emit('click', $event)"
			class="flex w-fit group items-center gap-8 lg:gap-3 lg:px-[1.88rem] pl-[1.88rem] pr-6 py-4 lg:py-6 border rounded-btn border-system-gray-800"
		>
			<span
				class="font-semibold leading-[1.25rem] text-system-gray-800"
				>{{ title }}</span
			>
			<svgo-arrow-right
				class="text-2xl transition-transform group-hover:translate-x-1"
				filled
			/>
		</nuxt-link>
	</template>
	<template v-else-if="variant === 'filled'">
		<nuxt-link
			:to="to"
			@click="$emit('click', $event)"
			class="flex gap-1 items-center bg-system-gray rounded-[4.5rem] px-6 py-4 group hover:bg-accent-300 transition-colors"
		>
			<span
				class="text-lg text-system-gray-800 font-semibold group-hover:text-white transition-colors"
				>{{ title }}</span
			>
			<svgo-arrow-top-right
				class="text-2xl group-hover:text-white transition-colors"
				filled
			/>
		</nuxt-link>
	</template>
	<template v-else-if="variant === 'empty'">
		<nuxt-link
			:to="to"
			@click="$emit('click', $event)"
			class="flex gap-1 items-center font-semibold group"
		>
			<span
				class="text-system-gray-800 group-hover:text-accent-300 transition-colors"
				:class="[color]"
			>
				{{ title }}
			</span>
			<svgo-arrow-top-right
				class="text-2xl icon group-hover:text-accent-300 transition-colors"
				:class="[color]"
				filled
			/>
		</nuxt-link>
	</template>
	<template v-else-if="variant === 'dark'">
		<nuxt-link
			:to="to"
			@click="$emit('click', $event)"
			class="bg-system-black-950 rounded-[4.5rem] px-4 lg:px-6 py-3 lg:py-4 hover:bg-accent-300 transition-colors"
		>
			<span
				class="text-system-gray-800 block w-full text-white transition-colors text-center"
				:class="[color]"
			>
				{{ title }}
			</span>
		</nuxt-link>
	</template>
</template>

<style>
.nuxt-icon.icon path {
	stroke: currentColor;
}
</style>
