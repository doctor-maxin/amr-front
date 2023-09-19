<script setup lang="ts">
import SignInForm from "~/components/forms/SignInForm.vue";
import ConfirmForm from "~/components/forms/ConfirmForm.vue";
import {ref, nextTick} from "~/.nuxt/imports";

const firstScreen = ref(true);
const phone = ref('');
const timer = ref(0);
const resendSeconds = ref<number>(45)

const onSignIn = (tel: string) => {
	firstScreen.value = false
	phone.value = tel;
	timer.value = window.setInterval(() => {
		resendSeconds.value--
	}, 1000)
	setTimeout(() => {
		window.clearInterval(timer.value)
		timer.value = 0
		nextTick(() => {
			resendSeconds.value = 45
		})
	}, 1000 * 44)
}

const signInConfirm = (values) => {
    alert('success')
}
</script>

<template>
	<div class="px-4  lg:px-11 pt-[2.38rem] pb-[4.38rem] flex-1 flex items-center justify-center">
		<SignInForm v-if="firstScreen" @success="onSignIn" />
		<ConfirmForm v-else :resend-seconds="resendSeconds" :timer="timer" :phone="phone" @resend="" @success="signInConfirm" />
	</div>
</template>

<style scoped>

</style>