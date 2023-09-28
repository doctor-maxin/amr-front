<script setup lang="ts">
import { useNuxtData } from "#imports";
import { ISettings } from "~/types/common";

const { data: settings } = useNuxtData<ISettings>("settings");
</script>

<template>
	<span
		class="text-[0.75rem] text-system-gray-800 text-center leading-[140%] lg:text-base"
		>отправляя данную форму вы соглашается с
		<nuxt-link class="font-medium" :to="settings?.privacyPolicyLink"
			>политикой конфиденциальности</nuxt-link
		>
	</span>
</template>

<style scoped></style>
