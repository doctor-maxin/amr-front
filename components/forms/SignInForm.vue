<script setup lang="ts">
import UiInput from "~/components/ui/UiInput.vue";
import UiButton from "~/components/ui/UiButton.vue";
import FormHelperLink from "~/components/helpers/FormHelperLink.vue";
import {useForm} from "vee-validate";
import {object, string} from "yup";

const emit = defineEmits(['success'])
const phoneRegExp = /^\+7 \d{3} \d{3} \d{2}-\d{2}$/;

const {handleSubmit, meta, isSubmitting} = useForm({
	validationSchema: object({
		userPhone: string().matches(phoneRegExp, 'Неверный номер телефона').required('Поле обязательно')
	})
})

const signIn = handleSubmit(async (values) => {
	emit('success', values.userPhone)
	console.log('values', values)
})
</script>

<template>
	<form class="card flex flex-col gap-[1.12rem] lg:gap-6 items-center max-w-[35.875rem]" @submit.prevent="signIn" >
		<h2 class="font-semibold text-2xl">Вход по номеру</h2>
		<UiInput name="userPhone" placeholder="Телефон" type="tel" class-name="!w-full" />
		<UiButton type="submit" variant="dark" title="Войти" class="w-full" :disabled="!meta.valid || isSubmitting" />
		<FormHelperLink class="max-w-[26rem]" />
	</form>
</template>

<style scoped>

</style>