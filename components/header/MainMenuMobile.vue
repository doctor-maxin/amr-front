<script lang="ts" setup>
import { PublicApi } from "@zag-js/popover";
import { PropTypes } from "@zag-js/vue";
import * as tabs from "@zag-js/tabs";
import { normalizeProps, useMachine } from "@zag-js/vue";
import HeaderMobileCatalog from "~/components/header/mobile/HeaderMobileCatalog.vue";
import HeaderMobileMenu from "~/components/header/mobile/HeaderMobileMenu.vue";
import { computed, markRaw, useForm } from "~/.nuxt/imports";

defineProps<{
	api: PublicApi<PropTypes>;
}>();

const [state, send] = useMachine(
	tabs.machine({ id: "mobileSecondMenu", value: "menu" })
);
const tabsApi = computed(() => tabs.connect(state.value, send, normalizeProps));
const tabList = markRaw([
	{
		id: "menu",
		label: "Меню",
	},
	{
		id: "catalog",
		label: "Каталог",
	},
]);
</script>

<template>
	<Transition enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0"
		enter-to-class=" opacity-100" leave-active-class="transition duration-150 ease-in" leave-from-class=" opacity-100"
		leave-to-class=" opacity-0">
		<div v-show="api.isOpen" :class="{}"
			class="w-screen absolute mobile-menu overflow-hidden bg-system-gray-500 transition-opacity top-full bottom-auto z-20">
			<div class="mobile-menu-content">
				<div class="flex justify-center py-5 items-center gap-4">
					<nuxt-link to="/sign_in" class="bg-system-gray rounded-[1.25rem] px-3 py-2 flex gap-2 items-center">
						<svgo-user class="text-[1.5rem]" filled />
						<span class="font-semibold text-sm">Личный кабинет</span>
					</nuxt-link>
					<nuxt-link to="/favorites" class="bg-system-gray rounded-[1.25rem] px-3 py-2 flex gap-2 items-center">
						<svgo-heart class="text-[1.5rem]" filled />
						<span class="font-semibold text-sm">Избранное</span>
					</nuxt-link>
				</div>
				<div class="bg-white grid grid-cols-1 grid-rows-[auto_minmax(0,_1fr)] max-h-full w-full pt-4 px-4 pb-9 flex-1"
					v-bind="tabsApi.rootProps">
					<div v-bind="tabsApi.tablistProps"
						class="bg-system-gray mb-5 rounded-[5rem] p-[0.315rem] overflow-hidden flex items-center">
						<button v-for="item in tabList" v-bind="tabsApi.getTriggerProps({ value: item.id })" :key="item.id"
							class="tab">
							{{ item.label }}
						</button>
					</div>
					<div class="overflow-y-auto" v-bind="tabsApi.getContentProps({ value: tabList[1].id })
						">
						<HeaderMobileCatalog :api="api" />
					</div>
					<div class="overflow-y-auto" v-bind="tabsApi.getContentProps({ value: tabList[0].id })
						">
						<HeaderMobileMenu :api="api" />
					</div>
				</div>
			</div>
		</div>
	</Transition>
</template>

<style lang="scss" scoped>
.mobile-menu {
	&-content {
		height: calc(100dvh - 3.875rem);
		display: grid;
		grid-template-columns: 1fr;
		grid-template-rows: auto minmax(0, 1fr);
		max-height: 100%;

		@media (min-width: 1025px) {
			height: calc(100dvh - 5.3125rem);
		}
	}
}

[data-scope="tabs"][role="tab"] {
	width: 100%;
	padding-left: 1.38rem;
	padding-right: 1.38rem;
	padding-top: 0.62rem;
	padding-bottom: 0.62rem;
	border-radius: 5rem;
}

[data-scope="tabs"][role="tab"][data-selected] {
	@apply bg-system-gray-600;
}
</style>
