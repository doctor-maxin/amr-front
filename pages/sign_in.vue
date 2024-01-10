<script setup lang="ts">
import SignInForm from "~/components/forms/SignInForm.vue";
import ConfirmForm from "~/components/forms/ConfirmForm.vue";
import { ref, nextTick, useHead } from "~/.nuxt/imports";
import { useFetch } from "@vueuse/core";
import { useRouter } from "nuxt/app";
import fetchSeo from "~/composables/fetchSeo";

useHead({
	title: 'Вход'
})
await fetchSeo()

const firstScreen = ref(true);
const phone = ref("");
const email = ref("");
const router = useRouter();
const timer = ref(0);
const resendSeconds = ref<number>(45);
const onSignIn = (tel: string, em: string) => {
	firstScreen.value = false;
	phone.value = tel;
	email.value = em;
	timer.value = window.setInterval(() => {
		resendSeconds.value--;
	}, 1000);
	setTimeout(() => {
		window.clearInterval(timer.value);
		timer.value = 0;
		nextTick(() => {
			resendSeconds.value = 45;
		});
	}, 1000 * 44);
};

const resendCode = async () => {
	await useFetch("/api/auth/sign_in").post({
		phoneNumber: phone.value,
	});
	timer.value = window.setInterval(() => {
		resendSeconds.value--;
	}, 1000);
	setTimeout(() => {
		window.clearInterval(timer.value);
		timer.value = 0;
		nextTick(() => {
			resendSeconds.value = 45;
		});
	}, 1000 * 44);
};

const signInConfirm = (values) => {
	const router = useRouter();

	router.push("/account");
};
</script>

<template>
	<div class="px-4 lg:px-11 pt-[2.38rem] pb-[4.38rem] flex-1 flex items-center justify-center">
		<SignInForm v-if="firstScreen" @success="onSignIn" />
		<ConfirmForm v-else :resend-seconds="resendSeconds" :timer="timer" :email="email" :phone="phone"
			@resend="resendCode" @success="signInConfirm" />
	</div>
</template>

<style scoped></style>
