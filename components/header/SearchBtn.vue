<script setup lang="ts">
import SearchIcon from "~/assets/icons/search.svg";
</script>

<template>
	<nuxt-link to="/search" class="appearance-none group" @click.native="useEvent('close-modals')">
		<SearchIcon filled class="text-2xl appearance-none group-hover:text-accent-300 hover:text-accent-300" />
	</nuxt-link>
</template>

<style scoped></style>
