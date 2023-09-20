<script setup lang="ts">
import UiInput from "~/components/ui/UiInput.vue";
</script>
<template>
	<div class="card grid grid-cols-1 gap-[1.125rem] gap-6">
		<h3 class="font-semibold text-system-black-950 lg:text-2xl">Контакты получателя</h3>
		<UiInput class-name="w-full" name="name" hide-error placeholder="Имя" autocomplete="name"/>
		<UiInput class-name="w-full" name="phone" hide-error type="tel" placeholder="Телефон" autocomplete="tel" />
		<UiInput class-name="w-full" name="email" hide-error type="email" placeholder="Почта" autocomplete="email" />
	</div>
</template>
