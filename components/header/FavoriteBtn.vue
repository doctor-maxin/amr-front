<script setup lang="ts">
import HeartIcon from '~/assets/icons/heart.svg'
import {useCartStore} from "~/store/cart.store";
import {useFavoritesStore} from "../../store/favorites.store";

const favoritesStore = useFavoritesStore();
</script>

<template>
	<nuxt-link to="/favorites" type="button" class="relative">
		<template v-if="favoritesStore.favoritesTotalLength">
			<div class="absolute -top-[0.69rem] -right-[0.81rem] aspect-square w-[1.1875rem] h-[1.1875rem] bg-system-gray-800 rounded-full flex items-center justify-center">
				<span class="text-[0.75rem] leading-[1.1875rem] text-white">{{favoritesStore.favoritesTotalLength}}</span>
			</div>
		</template>
		<HeartIcon filled class="text-2xl" />
	</nuxt-link>
</template>

<style scoped>

</style>