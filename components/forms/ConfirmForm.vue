<script setup lang="ts">
import UiPinInput from "~/components/ui/UiPinInput.vue";
import UiButton from "~/components/ui/UiButton.vue";
import { useForm } from "vee-validate";
import { object, string } from "yup";
import { useDirectusAuth } from "../../.nuxt/imports";

const { login } = useDirectusAuth();
const emit = defineEmits(["success", "resend"]);
const props = defineProps<{
	timer?: number;
	phone?: string;
	email?: string;
	resendSeconds?: number;
}>();

const { handleSubmit, meta, isSubmitting, setFieldError } = useForm({
	validationSchema: object({
		code: string().length(4).required("Поле обязательно"),
	}),
});

const signInConfirm = handleSubmit(async (values) => {
	try {
		await login({
			email: props.email ?? "",
			password: values.code,
		});
		emit("success");
	} catch (err: any) {
		setFieldError("code", "Неверный код");
	}
});
</script>

<template>
	<form
		class="card flex flex-col gap-[1.12rem] lg:gap-6 items-center max-w-[35.875rem]"
		@submit.prevent="signInConfirm"
	>
		<h2 class="font-semibold text-2xl">Введите код из СМС</h2>
		<UiPinInput name="code" />
		<UiButton
			type="submit"
			variant="dark"
			title="Войти"
			class="w-full"
			:disabled="!meta.valid || isSubmitting"
		/>
		<div class="text-[1.125rem] font-medium">
			Не пришел код?
			<button
				type="button"
        :disabled="timer"
				@click="emit('resend')"
				class="font-semibold disabled:text-system-gray-800"
			>
				{{
					timer
						? "Отправить еще через " + resendSeconds
						: "Отправить еще раз"
				}}
			</button>
		</div>
	</form>
</template>

<style scoped></style>
