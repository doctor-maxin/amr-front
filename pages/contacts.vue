<script lang="ts" setup>
import PageHeader from "~/components/page/Header.vue";
import { IBreadCrumb, ISettings } from "~/types/common";
import UiButton from "~/components/ui/UiButton.vue";
import FormHelperLink from "~/components/helpers/FormHelperLink.vue";
import UiInput from "~/components/ui/UiInput.vue";
import TelLink from "~/components/helpers/TelLink.vue";
import EmailLink from "~/components/helpers/EmailLink.vue";
import CompanyMapHelper from "~/components/helpers/CompanyMap.vue";
import { markRaw, useEvent } from "../.nuxt/imports";
import { useAppConfig, useForm, useNuxtData } from "#imports";
import * as yup from "yup";
import { useFetch } from "@vueuse/core/index";
import { toast } from "vue3-toastify";

const breadCrumbs = markRaw<IBreadCrumb[]>([
	{
		title: "Главная",
		path: "/",
	},
	{
		title: "Контакты",
		path: "/contacts",
	},
]);
const openMap = () => useEvent("open-map");
const { data: settings } = useNuxtData<ISettings>("settings");
const phoneRegExp = /^\+7 \d{3} \d{3} \d{2}-\d{2}$/;
const appConfig = useAppConfig();

const { handleSubmit, isSubmitting, resetForm } = useForm({
	validationSchema: yup.object().shape({
		name: yup.string().required(),
		phone: yup
			.string()
			.required()
			.matches(phoneRegExp, "Неверный номер телефона"),
		comment: yup.string().optional(),
	}),
	initialValues: {
		name: "",
		phone: "",
		comment: "",
	},
});

const sendForm = handleSubmit(async (values) => {
	const form = new FormData();
	form.append("name", values.name);
	form.append("phone", values.phone);
	form.append("comment", values.comment);

	const { data } = await useFetch("/api/callback").post(form).json<{
		id: string;
		status: string;
	}>();
	if (data.value?.id) {
		resetForm();
		toast.success(appConfig.messages.requestSuccess);
	} else {
		toast.error(appConfig.messages.requestError);
	}
});
</script>
<template>
	<div>
		<PageHeader :bread-crumbs="breadCrumbs" page-name="Контакты" />
		<main
			class="bg-white px-4 pt-[2.37rem] pb-[4.37rem] lg:pb-[8.75rem] lg:pt-[4.38rem]"
		>
			<div class="max-w-[73.5rem] mx-auto">
				<div
					class="grid grid-cols-1 gap-10 w-full justify-between lg:grid-cols-[36rem_16.875rem]"
				>
					<form @submit.prevent="sendForm">
						<h4
							class="text-system-gray-900 font-bold text-xs leading-[140%] lg:text-sm mb-1 lg:mb-0"
						>
							ОБРАТНАЯ СВЯЗЬ
						</h4>
						<h2
							class="text-[1.375rem] font-bold lg:text-[2.25rem] leading-[140%]"
						>
							Свяжитесь с нами, если у вас остались вопросы или
							нужна помощь
						</h2>
						<div class="flex pt-7 flex-col gap-[1.125rem]">
							<UiInput
								name="name"
								autocomplete="name"
								hide-error
								placeholder="Имя"
								class-name="w-full"
							/>
							<UiInput
								autocomplete="tel"
								hide-error
								name="phone"
								placeholder="Телефон"
								class-name="w-full"
								type="tel"
							/>
							<UiInput
								hide-error
								name="comment"
								placeholder="Комментарий"
								class-name="w-full"
							/>
							<div class="w-full">
								<UiButton
									type="submit"
									:disabled="isSubmitting"
									title="Отправить"
									variant="dark"
									class="w-full"
								/>
								<FormHelperLink
									class="mt-[0.6rem] block w-full lg:mt-[0.8rem]"
								/>
							</div>
						</div>
					</form>
					<div
						itemscope
						itemtype="http://schema.org/Organization"
						class="ml-auto lg:pt-[2.1325rem]"
					>
						<address
							class="flex flex-col gap-6 lg:gap-10 not-italic font-medium text-system-black-900 text-lg"
						>
							<div class="address-block">
								<span class="address-header"
									>Адрес шоурума</span
								>
								<span
									itemprop="address"
									itemscope
									itemtype="http://schema.org/PostalAddress"
									>{{ settings?.adressShowRoom }}</span
								>
							</div>
							<div class="address-block">
								<span class="address-header">Время работы</span>
								<div class="flex flex-col gap-[0.37rem]">
									<span>{{ settings?.worksDays }}</span>
									<span>{{ settings?.worksTimes }}</span>
								</div>
								<div class="flex flex-col gap-[0.37rem]">
									<span>{{ settings?.weekendsDays }}</span>
									<span>{{ settings?.weekendsTimes }}</span>
								</div>
							</div>
							<div class="address-block">
								<span class="address-header">Поддержка</span>
								<EmailLink :email="settings?.Email" />
								<TelLink :tel="settings?.phone" />
								<div class="flex gap-4">
									<a
										v-if="settings?.telegramLink"
										:href="settings.telegramLink"
										target="_blank"
									>
										<svgo-socials-telegram
											class="text-[2.3125rem]"
										/>
									</a>
									<a
										v-if="settings?.vkLink"
										:href="settings.vkLink"
										target="_blank"
									>
										<svgo-socials-vk
											class="text-[2.3125rem]"
										/>
									</a>
								</div>
							</div>
						</address>
					</div>
				</div>
				<div
					class="rounded-2xl flex items-center justify-center map-block overflow-hidden aspect-[21.4/9.125] lg:aspect-[73.5/25.8] mt-10 lg:mt-[5.75rem]"
				>
					<UiButton
						class="!py-2.5"
						@click="openMap"
						title="Мы на карте"
						title-class="!font-medium"
						variant="dark"
					/>
				</div>
			</div>
		</main>
	</div>
</template>
<style scoped lang="scss">
.address-block {
	display: flex;
	flex-direction: column;
	gap: 0.75rem;
}
.address-header {
	@apply text-system-gray-900;
	font-weight: 600;
	font-size: 1rem;
	line-height: 140%;
}
.map-block {
	background-image: url("/images/map.png");
	background-position: center;
	background-size: 200%;
}
</style>
