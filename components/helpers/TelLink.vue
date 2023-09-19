<template>
	<a class="text-primary-blue font-semibold" itemprop="telephone" :href="formattedTel">{{
		phone
	}}</a>
</template>
<script setup lang="ts">
import { usePhoneFormat } from '~/composables/usePhoneFormat';
import {computed} from "~/.nuxt/imports";

interface TelLinkProps {
	tel?: string | number;
}
const { tel } = defineProps<TelLinkProps>();
const { phone, formatPhone } = usePhoneFormat();
const formattedTel = computed(() => {
	const link = tel?.toString().replace(/\D/g, '') ?? ''
	return 'tel:' + (link.startsWith('7') ? '+' : '') + link;
});
formatPhone(tel ? tel.toString() : '');
</script>
