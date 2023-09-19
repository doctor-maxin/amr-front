<script setup lang="ts">
import UiInput from "~/components/ui/UiInput.vue";
import UiButton from "~/components/ui/UiButton.vue";
</script>

<template>
<div class="card flex flex-col gap-[1.125rem] lg:gap-[1.56rem]">
	<h2 class="font-semibold lg:text-2xl">Мои данные</h2>
	<div class="grid lg:grid-cols-2 gap-[1.125rem] lg:gap-[1.56rem]">
		<UiInput name="firstName" placeholder="Имя" />
		<UiInput name="lastName" placeholder="Фамилия" />
	</div>
	<UiInput type="email" name="email" placeholder="Почта" />
	<UiInput type="tel" name="phone" placeholder="Телефон" />
	<div class="ml-auto flex gap-1.5 lg:gap-[1.12rem] overflow-x-clip">
		<UiButton variant="default" title="Редактировать" title-class="font-normal text-sm lg:text-base" />
		<UiButton variant="dark" title="Сохранить" title-class="font-normal text-sm lg:text-base" />
	</div>
</div>
</template>

<style scoped>

</style>