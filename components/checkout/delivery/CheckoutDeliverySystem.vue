<script setup lang="ts">
import UiInput from "~/components/ui/UiInput.vue";
</script>

<template>
<div class="flex flex-col gap-[1.125rem] lg:gap-6">
	<UiInput hide-error class-name="w-full" name="city" placeholder="Город" id="ship-city" autocomplete="shipping locality" />
	<UiInput hide-error class-name="w-full" name="street" placeholder="Улица" id="ship-street-address" autocomplete="shipping street-address" />
	<div class="grid grid-cols-2 gap-x-2 lg:gap-x-7 gap-y-[1.125rem] xl:grid-cols-4">
	<UiInput hide-error class-name="w-full" name="house" placeholder="Дом" />
	<UiInput hide-error class-name="w-full" name="flat" placeholder="Квартира"  />
	<UiInput hide-error class-name="w-full" name="entrance" placeholder="Подъезд"  />
	<UiInput hide-error class-name="w-full" name="floor" placeholder="Этаж" />
	</div>
</div>
</template>

<style scoped>

</style>