<script setup lang="ts">
import UiInput from "~/components/ui/UiInput.vue";
</script>
<template>
	<div class="card grid grid-cols-1 gap-[1.125rem]">
		<h3 class="font-semibold text-system-black-950">Контакты получателя</h3>
		<UiInput class-name="w-full" name="name" placeholder="Имя"/>
		<UiInput class-name="w-full" name="phone" type="tel" placeholder="Телефон"/>
		<UiInput class-name="w-full" name="Почта" type="email" placeholder="Почта" />
	</div>
</template>
