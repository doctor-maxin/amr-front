<script setup lang="ts">
import ProfileIcon from "~/assets/icons/user.svg";
</script>

<template>
	<nuxt-link
		to="/account"
		type="button"
		@click.native="useEvent('close-modals')"
	>
		<ProfileIcon filled class="text-2xl" />
	</nuxt-link>
</template>

<style scoped></style>
