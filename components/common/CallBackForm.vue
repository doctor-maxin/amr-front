<script lang="ts" setup>
import UiButton from "../ui/UiButton.vue";
import UiInput from "../ui/UiInput.vue";
import FormHelperLink from "../helpers/FormHelperLink.vue";
import {Swiper, SwiperSlide} from 'swiper/vue'
import {ref, useEvent, useField, useListen, useNuxtData} from "../../.nuxt/imports";
import {ISettings} from "../../types/common";
import TelLink from "../helpers/TelLink.vue";
import EmailLink from "../helpers/EmailLink.vue";

const {value: callBackType, setValue: setCallBackType} = useField('callBackType', undefined, {
	initialValue: 'consult'
})
const container = ref<HTMLElement | null>(null)

const {data: settings} = useNuxtData<ISettings>('settings')

useListen('toFeedBack', () => {
  if (container.value) container.value.scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  })
})
</script>

<template>
	<section class="grid grid-cols-1 lg:grid-cols-3" ref="container">
		<div class="flex flex-col order-1 relative">
			<img class="absolute w-full h-full object-cover -z-10" src="/images/callback-bg.png">
			<div class="px-4 lg:p-[4.38rem] lg:pb-[5rem] h-full lg:flex lg:flex-col pt-[3.19rem] pb-[2.59rem]">
				<h4 class="mb-1 text-xs lg:text-sm font-bold text-system-gray-500">КАТАЛОГ</h4>
				<h3 class="text-white lg:text-[2.25rem] font-bold mb-[1.62rem]   text-[1.375rem]">Хотите получить
					консультацию?</h3>
				<div
					class="w-full lg:mt-auto aspect-[21/9] map-block rounded-2xl flex items-center relative justify-center">
					<UiButton class="!py-2.5" @click="useEvent('open-map')" title="Мы на карте" title-class="!font-medium" variant="dark"/>
				</div>
			</div>
		</div>
		<div
			class="bg-system-gray-500 h-full px-4 pt-0 lg:flex lg:flex-col pb-[2.25rem] lg:pt-[4.62rem] lg:pb-[5rem] lg:px-[1.87rem] order-3 lg:order-2">
			<div class="lg:flex  hidden gap-6 flex-col items-start">
				<button :class="{
						'text-system-black-900 text-opacity-100 before:opacity-100': callBackType === 'consult'
					}"
				        class="text-[1.375rem] font-bold relative before:opacity-0 pl-[1.31rem] before:absolute before:bg-black before:w-2 before:h-2 before:rounded-full before:left-0 before:top-1/2 before:-translate-y-1/2 text-system-gray-400   text-opacity-40"
				        type="button" @click="setCallBackType('consult')">Получить консультацию
				</button>
				<button :class="{
						'text-system-black-900 before:opacity-100 text-opacity-100': callBackType === '3d'
					}"
				        class="text-[1.375rem] font-bold relative before:opacity-0  text-system-gray-400 pl-[1.31rem] before:absolute before:bg-black before:w-2 before:h-2 before:rounded-full before:left-0 before:top-1/2 before:-translate-y-1/2   text-opacity-40"
				        type="button" @click="setCallBackType('3d')">
					Заказать 3D
					проект
				</button>
				<button :class="{
						'text-system-black-900 before:opacity-100 text-opacity-100': callBackType === 'calc',
					}"
				        class="text-[1.375rem] font-bold relative before:opacity-0 text-system-gray-400 pl-[1.31rem] before:absolute before:bg-black before:w-2 before:h-2 before:rounded-full before:left-0 before:top-1/2 before:-translate-y-1/2 text-opacity-40"
				        type="button"
				        @click="setCallBackType('calc')">Получить расчет стоимости
				</button>
			</div>
			<div class="bg-system-gray-600 lg:mt-auto flex flex-col rounded-[1.25rem]   px-[1.635rem] py-5">
				<h4 class="font-bold text-xl mb-2.5">Свяжитесь с нами</h4>
				<TelLink :tel="settings?.phone" class="text-base lg:text-base mb-2"/>
				<EmailLink :email="settings?.Email" class="text-base lg:text-base"/>
				<div class="flex mt-3.5 gap-2.5">
					<a v-if="settings?.telegramLink" :href="settings.telegramLink" target="_blank">
						<svgo-socials-telegram class="text-[2rem]"/>
					</a>
					<a v-if="settings?.vkLink" :href="settings.vkLink" target="_blank">
						<svgo-socials-vk class="text-[2rem]"/>
					</a>
				</div>
			</div>
		</div>
		<form class="bg-system-gray-500  order-2 lg:order-3 px-4 pt-[2.875rem] lg:py-[5rem] pb-[1.635rem]">
			<div class="lg:hidden pb-[1.635rem]">
				<Swiper slides-per-view="auto" space-between="22">
					<SwiperSlide class="!w-fit">
						<button :class="{
						'text-system-gray-400 ': callBackType !== 'consult',
						'text-system-black-900 text-opacity-100': callBackType === 'consult'
					}" class="font-bold  text-[1.125rem]  text-opacity-40"
						        type="button" @click="setCallBackType('consult')">Получить консультацию
						</button>
					</SwiperSlide>
					<SwiperSlide class="!w-fit">
						<button :class="{
						'text-system-gray-400': callBackType !== '3d',
						'text-system-black-900 text-opacity-100': callBackType === '3d'
					}" class="font-bold  text-[1.125rem]  text-opacity-40" type="button" @click="setCallBackType('3d')">
							Заказать 3D
							проект
						</button>
					</SwiperSlide>
					<SwiperSlide class="!w-fit">
						<button :class="{
						'text-system-black-900': callBackType === 'calc',
						'text-system-gray-400 text-opacity-100': callBackType !== 'calc',
					}" class="font-bold  text-[1.125rem]  text-opacity-40" type="button"
						        @click="setCallBackType('calc')">Получить расчет стоимости
						</button>
					</SwiperSlide>
				</Swiper>
			</div>
			<div class="flex lg:max-w-[26.375rem] flex-col gap-[1.135rem] lg:gap-6 pb-[1.135rem] lg:pb-[1.5rem] w-full">
				<UiInput class-name="w-full" name="callBackName" placeholder="Имя"/>
				<UiInput class-name="w-full" name="callBackPhone" placeholder="Телефон" type="tel"/>
				<UiInput class-name="w-full" name="callBackText" placeholder="Комментарий"/>
				<UiInput class-name="w-full" name="callBackFile" placeholder="Загрузить проект"/>
			</div>
			<UiButton class="w-full mb-2.5 lg:mb-3.5 lg:max-w-[26.375rem]" title="Отправить" type="submit" variant="dark"/>
			<FormHelperLink class="text-center lg:max-w-[26.375rem] block w-full"/>
		</form>s
	</section>
</template>

<style scoped>
.map-block {
	background-image: url("/images/map.png");
	background-position: center;
	background-size: 500%;
}
</style>