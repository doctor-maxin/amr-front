<script setup lang="ts">
import FooterLogo from "~/components/footer/FooterLogo.vue";
import FooterMenu from "~/components/footer/FooterMenu.vue";
import FooterInfo from "~/components/footer/FooterInfo.vue";
import GeekFlow from '~/components/GeekFlow.vue'
</script>

<template>
<footer class="bg-system-gray items-start px-4 lg:px-[4.37rem] gap-5 lg:py-14 py-5 grid lg:grid-cols-[auto_1fr_auto]">
	<FooterLogo />
	<FooterMenu />
	<FooterInfo />
</footer>
<GeekFlow />
</template>

<style scoped>

</style>