<script setup lang="ts">

import UiPinInput from "~/components/ui/UiPinInput.vue";
import UiButton from "~/components/ui/UiButton.vue";
import {useForm} from "vee-validate";
import {object, string} from "yup";

const emit = defineEmits(['success', 'resend'])
defineProps<{
	timer?: number;
	phone?: string;
	resendSeconds?: number;
}>()

const {handleSubmit, meta, isSubmitting} = useForm({
	validationSchema: object({
		code: string().length(4).required('Поле обязательно')
	})
})

const signInConfirm = handleSubmit(async (values) => {
	emit('success', values.code)
})

</script>

<template>
<form class="card flex flex-col gap-[1.12rem] lg:gap-6 items-center max-w-[35.875rem]" @submit.prevent="signInConfirm">
	<h2 class="font-semibold text-2xl">Введите код из СМС</h2>
	<UiPinInput name="code" />
	<UiButton type="submit" variant="dark" title="Войти" class="w-full" :disabled="!meta.valid || isSubmitting" />
	<div class="text-[1.125rem] font-medium">Не пришел код? <button type="button" @click="emit('resend')" class="font-semibold disabled:text-system-gray-800">{{timer ? 'Отправить еще через ' + resendSeconds : 'Отправить еще раз'}}</button></div>
</form>
</template>

<style scoped>

</style>