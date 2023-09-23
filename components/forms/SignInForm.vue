<script setup lang="ts">
import UiInput from "~/components/ui/UiInput.vue";
import UiButton from "~/components/ui/UiButton.vue";
import FormHelperLink from "~/components/helpers/FormHelperLink.vue";
import { useForm } from "vee-validate";
import { object, string } from "yup";
import { useFetch } from "@vueuse/core";

const emit = defineEmits(["success"]);
const phoneRegExp = /^\+7 \d{3} \d{3} \d{2}-\d{2}$/;

const { handleSubmit, meta, isSubmitting, setFieldError } = useForm({
	validationSchema: object({
		userPhone: string()
			.matches(phoneRegExp, "Неверный номер телефона")
			.required("Поле обязательно"),
	}),
});

const signIn = handleSubmit(async (values) => {
	const phone = values.userPhone.replace(/[^0-9]/g, "");
	const response = await fetch("/api/auth/sign_in", {
		body: JSON.stringify({
			phoneNumber: phone,
		}),
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
	});
	const data = await response.json();
	if (response.status !== 200) {
		const error =
			data.message.search("Too many") !== -1
				? "Попробуйте через некоторое время"
				: "Проверьте введенные данные";
		setFieldError("userPhone", error);
	} else {
		emit("success", phone, data?.email);
	}
});
</script>

<template>
	<form
		class="card flex flex-col gap-[1.12rem] lg:gap-6 items-center max-w-[35.875rem]"
		@submit.prevent="signIn"
	>
		<h2 class="font-semibold text-2xl">Вход по номеру</h2>
		<UiInput
			name="userPhone"
			placeholder="Телефон"
			type="tel"
			class-name="!w-full"
		/>
		<UiButton
			type="submit"
			variant="dark"
			title="Войти"
			class="w-full"
			:disabled="!meta.valid || isSubmitting"
		/>
		<FormHelperLink class="max-w-[26rem]" />
	</form>
</template>

<style scoped></style>
