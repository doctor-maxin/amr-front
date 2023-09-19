<template>
	<a class="text-primary-blue font-semibold" itemprop="email" :href="`mailto:${email}`">{{
			email
	}}</a>
</template>
<script setup lang="ts">

interface TelLinkProps {
	email?: string;
}
defineProps<TelLinkProps>();
</script>
