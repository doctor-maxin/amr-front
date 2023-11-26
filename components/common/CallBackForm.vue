<script lang="ts" setup>
import UiButton from "../ui/UiButton.vue";
import UiInput from "../ui/UiInput.vue";
import FormHelperLink from "../helpers/FormHelperLink.vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import {
	computed,
	ref,
	useAppConfig,
	useField,
	useForm,
	useListen,
	useNuxtData,
	useRoute,
} from "../../.nuxt/imports";
import { ISettings } from "../../types/common";
import TelLink from "../helpers/TelLink.vue";
import EmailLink from "../helpers/EmailLink.vue";
import UiFileInput from "~/components/ui/UiFileInput.vue";
import { useEvent } from "~/composables/useEventBus";
import * as yup from "yup";
import { useFetch } from "@vueuse/core";
import { toast } from "vue3-toastify";
import { normalizeProps, useMachine } from "@zag-js/vue";
import * as popover from "@zag-js/popover";

const container = ref<HTMLElement | null>(null);

const phoneRegExp = /^\+7 \d{3} \d{3} \d{2}-\d{2}$/;
const { data: settings } = useNuxtData<ISettings>("settings");
const appConfig = useAppConfig();

const { handleSubmit, setFieldValue, values, resetForm } = useForm({
	validationSchema: yup.object().shape({
		callBackName: yup.string().required(),
		callBackPhone: yup
			.string()
			.required()
			.matches(phoneRegExp, "Неверный номер телефона"),
		callBackText: yup.string().optional(),
		callBackFile: yup.mixed().optional(),
		callBackType: yup.string().required(),
	}),
	initialValues: {
		callBackType: "consult",
		callBackName: "",
		callBackPhone: "",
		callBackText: "",
		callBackFile: undefined,
	},
});

const openMap = () => useEvent("open-map");
const route = useRoute();

const sendForm = handleSubmit(async (values) => {
	const form = new FormData();
	form.append("name", values.callBackName);
	form.append("phone", values.callBackPhone);
	form.append("comment", values.callBackText);
	form.append("type", values.callBackType);
	if (values.callBackFile) form.append("file", values.callBackFile);

	const params = new URLSearchParams(window.location.search)
	params.append('from', window.location.href)

	const { data } = await useFetch(`/api/callback?${params.toString()}`).post(form).json<{
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
const setCallBackType = (value: string) => setFieldValue("callBackType", value);
</script>

<template>
	<section class="grid grid-cols-1 lg:grid-cols-3" ref="container">
		<div class="flex flex-col order-1 relative">
			<img class="absolute w-full h-full object-cover -z-10" src="/images/callback-bg.png" alt="Мебель" />
			<div class="px-4 lg:p-[4.38rem] lg:pb-[5rem] h-full lg:flex lg:flex-col pt-[3.19rem] pb-[2.59rem]">
				<h4 class="mb-1 text-xs lg:text-sm font-bold text-system-gray-500">
					КАТАЛОГ
				</h4>
				<h3 class="text-white lg:text-[2.25rem] font-bold mb-[1.62rem] text-[1.375rem]">
					Хотите получить консультацию?
				</h3>
				<div
					class="w-full lg:mt-auto aspect-[21/9] map-block rounded-2xl flex items-center relative justify-center">
					<UiButton class="!py-2.5" @click="openMap" title="Мы на карте" title-class="!font-medium"
						variant="dark" />
				</div>
			</div>
		</div>
		<div
			class="bg-system-gray-500 h-full px-4 pt-0 lg:flex lg:flex-col pb-[2.25rem] lg:pt-[4.62rem] lg:pb-[5rem] lg:px-[1.87rem] order-3 lg:order-2">
			<div class="lg:flex hidden gap-6 flex-col items-start">
				<button :class="{
					'text-system-black-900 !text-opacity-100 before:opacity-100':
						values.callBackType === 'consult',
				}" class="text-[1.375rem] text-left font-bold relative before:opacity-0 pl-[1.31rem] before:absolute before:bg-black before:w-2 before:h-2 before:rounded-full before:left-0 before:top-1/2 before:-translate-y-1/2 text-system-gray-400 text-opacity-40"
					type="button" @click="setCallBackType('consult')">
					Получить консультацию
				</button>
				<button :class="{
					'text-system-black-900 text-left before:opacity-100 !text-opacity-100':
						values.callBackType === '3d',
				}" class="text-[1.375rem] font-bold relative before:opacity-0 text-system-gray-400 pl-[1.31rem] before:absolute before:bg-black before:w-2 before:h-2 before:rounded-full before:left-0 before:top-1/2 before:-translate-y-1/2 text-opacity-40"
					type="button" @click="setCallBackType('3d')">
					Заказать 3D проект
				</button>
				<button :class="{
					'text-system-black-900 before:opacity-100 !text-opacity-100':
						values.callBackType === 'calc',
				}" class="text-[1.375rem] text-left font-bold relative before:opacity-0 text-system-gray-400 pl-[1.31rem] before:absolute before:bg-black before:w-2 before:h-2 before:rounded-full before:left-0 before:top-1/2 before:-translate-y-1/2 text-opacity-40"
					type="button" @click="setCallBackType('calc')">
					Получить расчет стоимости
				</button>
			</div>
			<div class="bg-system-gray-600 lg:mt-auto flex flex-col rounded-[1.25rem] px-[1.635rem] py-5 mt-6">
				<h4 class="font-bold text-xl mb-2.5">Свяжитесь с нами</h4>
				<TelLink :tel="settings?.phone" class="text-base lg:text-base mb-2" />
				<EmailLink :email="settings?.Email" class="text-base lg:text-base" />
				<div class="flex mt-3.5 gap-2.5">
					<a v-if="settings?.telegramLink" :href="settings.telegramLink" target="_blank">
						<svgo-socials-telegram class="text-[2rem]" />
					</a>
					<a v-if="settings?.vkLink" :href="settings.vkLink" target="_blank">
						<svgo-socials-vk class="text-[2rem]" />
					</a>
				</div>
			</div>
		</div>
		<div class="bg-system-gray-500 order-2 lg:order-3 px-4 pt-[2.875rem] lg:py-[5rem] pb-[1.635rem]">
			<div class="lg:hidden pb-[1.635rem]">
				<Swiper slides-per-view="auto" space-between="22">
					<SwiperSlide class="!w-fit">
						<button :class="{
							'text-system-gray-400 text-opacity-40':
								values.callBackType !== 'consult',
							'text-system-black-900 text-opacity-100':
								values.callBackType === 'consult',
						}" class="font-bold text-[1.125rem]" type="button" @click="setCallBackType('consult')">
							Получить консультацию
						</button>
					</SwiperSlide>
					<SwiperSlide class="!w-fit">
						<button :class="{
							'text-system-gray-400 text-opacity-40':
								values.callBackType !== '3d',
							'text-system-black-900 text-opacity-100':
								values.callBackType === '3d',
						}" class="font-bold text-[1.125rem]" type="button" @click="setCallBackType('3d')">
							Заказать 3D проект
						</button>
					</SwiperSlide>
					<SwiperSlide class="!w-fit">
						<button :class="{
							'text-system-black-900 text-opacity-100':
								values.callBackType === 'calc',
							'text-system-gray-400 text-opacity-40':
								values.callBackType !== 'calc',
						}" class="font-bold text-[1.125rem]" type="button" @click="setCallBackType('calc')">
							Получить расчет стоимости
						</button>
					</SwiperSlide>
				</Swiper>
			</div>
			<div class="flex lg:max-w-[26.375rem] flex-col gap-[1.135rem] lg:gap-6 pb-[1.135rem] lg:pb-[1.5rem] w-full">
				<VeeField type="text" hidden name="callBackType" />
				<UiInput autocomplete="name" hide-error class-name="w-full" name="callBackName" placeholder="Имя" />
				<UiInput autocomplete="tel" hide-error class-name="w-full" name="callBackPhone" placeholder="Телефон"
					type="tel" />
				<UiInput hide-error class-name="w-full bg-transparent" name="callBackText" placeholder="Комментарий" />
				<UiFileInput placeholder="Загрузить проект" name="callBackFile" />
			</div>
			<UiButton class="w-full mb-2.5 lg:mb-3.5 lg:max-w-[26.375rem]" title="Отправить" type="submit" variant="dark"
				@click="sendForm" />
			<FormHelperLink class="text-center lg:max-w-[26.375rem] block w-full" />
		</div>
	</section>
</template>

<style scoped>
.map-block {
	background-image: url("/images/map.png");
	background-position: center;
	background-size: 500%;
}
</style>
