<script lang="ts" setup>
import { ICategory, ISettings } from "~/types/common";
import TelLink from "~/components/helpers/TelLink.vue";
import EmailLink from "~/components/helpers/EmailLink.vue";
import { computed, useNuxtData } from "~/.nuxt/imports";

const { data: settings } = useNuxtData<ISettings>("settings");

const { data: categories } = useNuxtData<ICategory[]>("categories");
const mainCategories = computed(() =>
	categories.value?.filter((item) => !item.parentId)
);
const { data: pages } = useNuxtData("customerPages");
</script>

<template>
	<nav class="footer-menu">
		<ul>
			<li>
				<nuxt-link to="/catalog">Каталог</nuxt-link>
			</li>
			<li v-for="item of mainCategories" :key="item.id">
				<nuxt-link class="text-sm lg:text-base" :to="`/catalog${item.handle ?? ''}`">{{ item.name }}</nuxt-link>
			</li>
		</ul>
		<ul>
			<li>
				<nuxt-link to="/pages">Покупателям</nuxt-link>
			</li>
			<li v-for="page of pages?.navBars">
				<nuxt-link class="text-sm lg:text-base" :to="page.handle">{{
					page.title
				}}</nuxt-link>
			</li>
		</ul>
		<ul>
			<li>
				<nuxt-link to="/about">О нас</nuxt-link>
			</li>
			<li>
				<nuxt-link class="text-sm lg:text-base" to="/about">О компании</nuxt-link>
			</li>
			<li>
				<nuxt-link class="text-sm lg:text-base" to="/blog">Идеи и тренды</nuxt-link>
			</li>
		</ul>
		<ul>
			<li>
				<nuxt-link to="/contacts">Контакты</nuxt-link>
			</li>
			<li>
				<TelLink class="text-sm !font-medium lg:text-base" :tel="settings?.phone" />
			</li>
			<li>
				<EmailLink class="text-sm !font-medium lg:text-base" :email="settings?.Email" />
			</li>
			<li>
				{{ settings?.adressShowRoom }}
			</li>
			<li class="socials">
				<a v-if="settings?.telegramLink" :href="settings.telegramLink" target="_blank">
					<svgo-socials-telegram class="text-[2rem]" />
				</a>
				<a v-if="settings?.vkLink" :href="settings.vkLink" target="_blank">
					<svgo-socials-vk class="text-[2rem]" />
				</a>
			</li>
		</ul>
	</nav>
</template>

<style scoped>
.footer-menu {
	@apply grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-y-7 gap-x-2;
}

.footer-menu ul {
	@apply flex flex-col gap-2.5;
}

.footer-menu ul li:first-child {
	@apply font-semibold text-lg;
}

.footer-menu ul li {
	@apply text-system-gray-800 font-medium;
}

.footer-menu .socials {
	display: flex;
	gap: 17px;
}
</style>
