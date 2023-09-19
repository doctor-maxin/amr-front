<script lang="ts" setup>
import {computed} from "~/.nuxt/imports";

const props = defineProps<{
	total: number;
	page: number;
	limit: number;
}>()

const emits = defineEmits(['onPage'])
const pagesCount = computed<number>(() => Math.ceil(props.total / props.limit))

</script>

<template>
	<div v-if="pagesCount > 1"
	     class="bg-system-gray rounded-[3.3125rem] items-center py-1.5 lg:py-4 px-12 flex justify-center lg:w-fit lg:mx-auto text-base font-semibold lg:gap-3 gap-1">
		<button :disabled="page === 1" class="disabled:opacity-50" type="button" @click="emits('onPage', page - 1)">
			<svgo-arrow-filled class="text-2xl !mb-0 rotate-180" filled/>
		</button>
		<template v-for="item in pagesCount">
			<button v-if="item < 5" :class="{
			'bg-system-gray-600 rounded-full border-system-gray-600': item.toString() === page.toString()
		}" class="w-[1.8rem] h-[1.8rem] lg:w-8 lg:h-8 flex items-center justify-center lg:text-xl "
			        type="button" @click="emits('onPage', item)">{{ item }}
			</button>
			<button v-else-if="item === pagesCount" :class="{
			'bg-system-gray-600 rounded-full border-system-gray-600': item.toString() === page.toString()
		}" class="w-[1.8rem] h-[1.8rem] lg:w-8 lg:h-8 flex items-center justify-center lg:text-xl "
			        type="button" @click="emits('onPage', item)">{{ item }}
			</button>
			<button v-else class="w-[1.8rem] h-[1.8rem] lg:w-8 lg:h-8 flex items-center justify-center lg:text-xl "
			        type="button">...
			</button>
		</template>
		<button :disabled="page === pagesCount" class="disabled:opacity-50" type="button"
		        @click="emits('onPage', page + 1)">
			<svgo-arrow-filled class="text-2xl  !mb-0" filled/>
		</button>
	</div>
</template>

<style scoped>

</style>