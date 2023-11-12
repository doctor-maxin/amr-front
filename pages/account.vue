<script lang="ts" setup>
import PageHeader from "~/components/page/Header.vue";
import { ILink } from "~/types/common";
import {
	definePageMeta,
	shallowRef,
	useDirectusAuth,
	useRouter,
} from "~/.nuxt/imports";

definePageMeta({
	middleware: ["auth"],
});

const { logout } = useDirectusAuth();
const link = shallowRef<ILink>({
	title: "В каталог",
	path: "/catalog",
});
const router = useRouter();

const exit = async () => {
	await logout();
	await router.push("/");
};
</script>

<template>
	<div>
		<PageHeader :bread-crumbs="[]" :link="link" page-name="Личный кабинет" />
		<main
			class="px-4 pt-[2.375rem] pb-[4.375rem] mx-auto lg:pt-[4.5rem] lg:pb-[8.75rem] max-w-[92.375rem] flex flex-col gap-[1.75rem] lg:gap-[2.635rem]">
			<div class="flex justify-between rounded-[1.25rem] py-[1.56rem] bg-system-gray-500 px-[2.75rem]">
				<div class="gap-[1.12rem] text-system-black-900 flex lg:gap-[3.75rem] font-semibold">
					<nuxt-link class="router-link" to="/account">Профиль</nuxt-link>
					<nuxt-link class="router-link" to="/account/orders">История заказов</nuxt-link>
				</div>
				<button @click="logout" class="lg:flex hidden gap-2 items-center font-semibold" type="button">
					<svgo-exit class="text-[1.5rem]" filled />
					<span class="">Выйти</span>
				</button>
			</div>
			<nuxt-page />
			<button @click="logout"
				class="flex w-fit mx-auto rounded-2xl lg:hidden gap-2 items-center font-semibold bg-system-gray-500 px-[0.62rem] py-[0.87rem]"
				type="button">
				<svgo-exit class="text-[1.5rem]" filled />
				<span class="">Выйти</span>
			</button>
		</main>
	</div>
</template>

<style scoped>
.router-link-active,
.router-link {
	opacity: 0.5;
}

.router-link-exact-active {
	opacity: 1;
}
</style>
