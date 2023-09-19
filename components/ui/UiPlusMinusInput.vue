<script lang="ts" setup>
import { useField, watch } from "../../.nuxt/imports";
import { CartPopulatedItem } from "../../types/cart";
import { useCartStore } from "../../store/cart.store";
import { toast } from "vue3-toastify";

const props = defineProps<{
	line: CartPopulatedItem;
}>();

const cartStore = useCartStore();
const {
	errorMessage,
	handleChange,
	value: count,
} = useField(() => `product-${props.line.id}`, undefined, {
	initialValue: props.line.count,
});

const mutateProduct = (value: number) => {
	cartStore.setLine(props.line.id, value);
};

watch(count, (_val, oldValue) => {
	if (oldValue !== _val && oldValue !== 0) {
		if (count.value > 0 && count.value <= props.line.product.count) {
			console.log("!", count.value, _val, oldValue);
			mutateProduct(count.value);
		} else if (count.value >= props.line.product.count) {
			handleChange(props.line.product.count);
		} else {
			handleChange(1);
		}
	}
});

watch(
	() => props.line.count,
	() => {
		if (props.line.count !== count.value) handleChange(props.line.count);
	},
	{
		immediate: true,
	}
);

const addMore = () => {
	console.log(props.line.product.count);
	if (count.value < props.line.product.count) {
		handleChange(count.value + 1);
	} else toast.error("Нет больше в наличии");
};
const removeMore = () => {
	if (count.value > 0) {
		handleChange(count.value - 1);
	}
};
</script>

<template>
	<div class="relative">
		<div
			class="w-fit min-w-[6.8125rem] lg:min-w-[9.5rem] gap-1 flex items-center bg-system-gray-500 rounded-[6.88rem]"
		>
			<button
				class="w-10 h-[2.5rem] lg:h-[3.375rem] lg:w-[3.375rem] flex items-center justify-center"
				type="button"
				@click="removeMore"
			>
				<svg
					fill="none"
					height="3"
					viewBox="0 0 10 3"
					width="10"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path d="M0 3V0H10V3H0Z" fill="currentColor" />
				</svg>
			</button>
			<input
				v-model.number="count"
				:max="line.product.count"
				class="bg-transparent flex-1 text-center font-bold text-base"
				min="1"
				name="product"
				type="number"
			/>
			<button
				class="w-10 h-[2.5rem] lg:h-[3.375rem] lg:w-[3.375rem] flex items-center justify-center"
				type="button"
				@click="addMore"
			>
				<svg
					fill="none"
					height="12"
					viewBox="0 0 12 12"
					width="12"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M4.60738 12V0H7.39263V12H4.60738ZM0 7.33333V4.66667H12V7.33333H0Z"
						fill="currentColor"
					/>
				</svg>
			</button>
		</div>
		<span class="absolute top-full text-center text-xs text-red-400">{{
			errorMessage
		}}</span>
	</div>
</template>

<style scoped>
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
	-webkit-appearance: none;
	margin: 0;
}

/* Firefox */
input[type="number"] {
	-moz-appearance: textfield;
}
</style>
