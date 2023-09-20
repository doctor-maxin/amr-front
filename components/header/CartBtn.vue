<script setup lang="ts">
import CartIcon from "~/assets/icons/cart.svg";
import { useCartStore } from "~/store/cart.store";

const cartStore = useCartStore();
</script>

<template>
	<nuxt-link
		to="/cart"
		class="relative"
		@click.native="useEvent('close-modals')"
	>
		<template v-if="cartStore.cartTotalLength">
			<div
				class="absolute -top-[0.69rem] -right-[0.81rem] aspect-square w-[1.1875rem] h-[1.1875rem] bg-system-gray-800 rounded-full flex items-center justify-center"
			>
				<span class="text-[0.75rem] leading-[1.1875rem] text-white">{{
					cartStore.cartTotalLength
				}}</span>
			</div>
		</template>
		<CartIcon filled class="text-2xl" />
	</nuxt-link>
</template>

<style scoped></style>
