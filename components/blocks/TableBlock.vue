<script lang="ts" setup>
import {ITableBlock} from "../../types/common";
import {computed} from "../../.nuxt/imports";

const props = defineProps<{
	block: ITableBlock
}>();

const tbodyRows = computed(() => props.block.data.withHeadings ? props.block.data.content.slice(1) : props.block.data.content)
</script>

<template>
	<div class=" mb-4 lg:mb-[2.635rem] overflow-x-hidden">
		<table :class="{
		'with-heading': block.data.withHeadings}" class="text-system-black-900">
			<thead>
			<tr v-if="block.data.withHeadings">
				<th v-for="item of block.data.content[0]">
					{{ item }}
				</th>
			</tr>
			</thead>
			<tbody>
			<tr v-for="(row, index) of tbodyRows" :key="'row-' + index">
				<td v-for="(col, index) of row" :key="'col-' + col" v-html="col">
				</td>
			</tr>
			</tbody>
		</table>
	</div>
</template>

<style lang="scss" scoped>
table {
	border-radius: 1.25rem;
	overflow: hidden;
	width: 100%;


	&.with-heading {
		thead {
			tr:nth-child(odd) {
				@apply bg-system-gray-500;
			}
		}

		tbody {
			tr:nth-child(even) {
				@apply bg-system-gray-500;
			}

			tr:nth-child(odd) {
				@apply bg-system-gray;
			}
		}
	}

	&:not(.with-heading) {
		tr:nth-child(odd) {
			@apply bg-system-gray-500;
		}

		tr:nth-child(even) {
			@apply bg-system-gray;
		}
	}

	th {
		text-align: left;
	}
}

table th, table td {
	padding: 0.75rem 1.5rem;

	@media (min-width: 1024px) {
		padding: 1.25rem 2.75rem 1.195rem;
	}
}
</style>