<script lang="ts" setup>
import PageHeader from '~/components/page/Header.vue'
import {IBreadCrumb} from "~/types/common";
import UiButton from "~/components/ui/UiButton.vue";
import FormHelperLink from "~/components/helpers/FormHelperLink.vue";
import UiInput from "~/components/ui/UiInput.vue";
import TelLink from "~/components/helpers/TelLink.vue";
import EmailLink from "~/components/helpers/EmailLink.vue";
import CompanyMapHelper from '~/components/helpers/CompanyMap.vue'
import {markRaw} from "../.nuxt/imports";

const breadCrumbs = markRaw<IBreadCrumb[]>([{
	title: 'Главная',
	path: '/'
}, {
	title: 'Каталог',
	path: '/contacts'
}])

</script>
<template>
	<div>
		<PageHeader :bread-crumbs="breadCrumbs" page-name="Контакты"/>
		<main class="bg-white px-4 pt-[2.37rem] pb-[4.37rem] lg:pb-[8.75rem] lg:pt-[4.38rem]">
			<div class="max-w-[73.5rem] mx-auto ">
				<div class="grid grid-cols-1 gap-10 w-full justify-between lg:grid-cols-[36rem_16.875rem]">
					<form action="">
						<h4 class="text-system-gray-900 font-bold text-xs leading-[140%] lg:text-sm mb-1 lg:mb-0">
							ОБРАТНАЯ СВЯЗЬ</h4>
						<h2 class="text-[1.375rem] font-bold lg:text-[2.25rem] leading-[140%] ">Свяжитесь с нами, если у
							вас остались вопросы или нужна помощь</h2>
						<div class="flex pt-7 flex-col gap-[1.125rem]">
							<UiInput name="name" placeholder="Имя" class-name="w-full"/>
							<UiInput name="phone" placeholder="Телефон" class-name="w-full"/>
							<UiInput name="comment" placeholder="Комментарий" class-name="w-full"/>
							<div class="w-full">
								<UiButton title="Отправить" variant="dark" class="w-full"/>
								<FormHelperLink class="mt-[0.6rem] block w-full lg:mt-[0.8rem]"/>
							</div>
						</div>
					</form>
					<div itemscope itemtype="http://schema.org/Organization" class="ml-auto lg:pt-[2.1325rem]">
						<address class="flex flex-col gap-6 lg:gap-10 not-italic font-medium text-system-black-900 text-lg">
							<div class="address-block">
								<span class="address-header">Адрес шоурума</span>
								<span itemprop="address" itemscope itemtype="http://schema.org/PostalAddress">462811, Новосибирская область, г. Ногинск, ул. Будапештсткая, 21</span>
							</div>
							<div class="address-block">
								<span class="address-header">Время работы</span>
								<div class="flex flex-col gap-[0.37rem]">
									<span>Понедельник - пятница</span>
									<span>10:00 - 20:00</span>
								</div>
								<div class="flex flex-col gap-[0.37rem]">
									<span>Суббота - воскресенье</span>
									<span>11:00 - 19:00</span>
								</div>
							</div>
							<div class="address-block">
								<span class="address-header">Поддержка</span>
								<EmailLink email="info@author.ru" />
								<TelLink tel="+7 (999) 564-23-23" />
								<div class="flex gap-4">
									<nuxt-link to="#">
										<svgo-socials-telegram class="text-[2.3125rem]" />
									</nuxt-link>
									<nuxt-link to="#">
										<svgo-socials-vk class="text-[2.3125rem]" />
									</nuxt-link>
								</div>
							</div>
						</address>
					</div>
				</div>
				<div class="rounded-2xl overflow-hidden aspect-[21.4/9.125] lg:aspect-[73.5/25.8] mt-10 lg:mt-[5.75rem]">
				<CompanyMapHelper />
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
</style>