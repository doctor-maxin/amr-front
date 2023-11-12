<script setup lang="ts">
import ProfileIcon from "~/assets/icons/user.svg";

const user = useDirectusUser();
</script>

<template>
	<nuxt-link to="/account" class="lg:!flex items-center gap-2" type="button" @click.native="useEvent('close-modals')">
		<ProfileIcon filled class="text-2xl" />
		<span v-if="user?.first_name" class="font-medium">{{ user.first_name }}</span>
	</nuxt-link>
</template>

<style scoped></style>
