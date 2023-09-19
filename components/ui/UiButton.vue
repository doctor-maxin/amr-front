<script lang="ts" setup>

withDefaults(defineProps<{
	title?: string;
	variant?: 'default' | 'filled' | 'empty' | 'dark'
	color?: string;
	type?: 'reset' | 'submit' | 'button'
	titleClass?: string;
}>(), {
	title: '',
	variant: 'default',
	color: 'text-system-gray-800',
	type: 'button',
	titleClass: ''
})
</script>

<template>
	<template v-if="variant === 'default'">
		<button :type="type"
		        class="flex w-fit group items-center gap-8 lg:gap-3 lg:px-[1.88rem] pl-[1.88rem] pr-6 py-4 lg:py-6 border rounded-btn transition-colors border-system-gray-800 hover:border-accent-300 group hover:bg-accent-300">
			<span :class="titleClass" class="font-semibold leading-[1.25rem] group-hover:text-white transition-colors text-system-gray-800">{{ title }}</span>
		</button>
	</template>
	<template v-else-if="variant === 'filled'">
		<button :type="type"
		        class="flex gap-1 items-center bg-system-gray rounded-[4.5rem] px-6 py-4 group hover:bg-accent-300 transition-colors"
		>
			<span :class="titleClass" class="text-lg text-system-gray-800 group-hover:text-white transition-colors font-semibold">{{ title }}</span>
		</button>
	</template>
	<template v-else-if="variant === 'dark'">
		<button :type="type"
		        class="flex gap-1 items-center disabled:bg-system-gray-800 disabled:bg-opacity-30 justify-center bg-system-gray-800 rounded-[4.5rem] px-6 py-4 group hover:bg-accent-300 transition-colors"
		>
			<span class="text-lg text-white text-center font-semibold transition-colors group-hover:text-white" :class="titleClass" >{{ title }}</span>
		</button>
	</template>
	<template v-else-if="variant === 'empty'">
		<button :type="type"
		        class="flex gap-1 items-center font-semibold group hover:text-accent-300"
		>
			<span :class="[titleClass, color]"
			      class="text-system-gray-800 group-hover:text-accent-300 transition-colors">
				{{ title }}
			</span>
		</button>
	</template>
</template>

<style>
.nuxt-icon.icon path {
	stroke: currentColor;
}
</style>