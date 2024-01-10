<script lang="ts" setup>
import HeaderButton from "~/components/header/HeaderButton.vue";
import MobileHeaderButton from "~/components/header/MobileHeaderButton.vue";
import HeaderLogo from "~/components/header/HeaderLogo.vue";
import HeaderCatalogBtn from "~/components/header/HeaderCatalogBtn.vue";
import TelLink from "~/components/helpers/TelLink.vue";
import SearchBtn from "~/components/header/SearchBtn.vue";
import WhatsAppLink from '~/components/header/WhatsAppLink.vue';
import FavoriteBtn from './header/FavoriteBtn.vue';
import ProfileBtn from './header/ProfileBtn.vue';
import CartBtn from './header/CartBtn.vue';
import CompareBtn from './header/CompareBtn.vue'
import { ISettings } from "~/types/common";
import { useNuxtData } from "../.nuxt/imports";

const { data: settings } = useNuxtData<ISettings>('settings')
</script>

<template>
	<header id="header" class="w-full fixed top-0 z-30">
		<div class="relative z-30 h-mobile-header lg:h-header bg-system-gray flex items-center justify-between w-full">
			<div class="lg:ml-[4.37rem] flex h-full items-center gap-[1.12rem]">
				<MobileHeaderButton />
				<HeaderLogo />
				<HeaderCatalogBtn />
			</div>
			<div class="flex items-center gap-6 lg:gap-11 pr-[1.81rem] relative lg:pr-0">
				<!-- <WhatsAppLink /> -->
				<TelLink :tel="settings?.phone" class="hidden lg:block text-system-gray-800" />
				<CompareBtn  />
				<SearchBtn />
				<FavoriteBtn class="hidden lg:block" />
				<ProfileBtn class="hidden lg:block" />
				<CartBtn />
				<HeaderButton class="hidden lg:block" direction="right" />
			</div>
		</div>
	</header>
</template>

<style scoped></style>