<script lang="ts" setup>
import {PublicApi} from "@zag-js/popover";
import {PropTypes} from "@zag-js/vue";
import TelLink from "~/components/helpers/TelLink.vue";
import EmailLink from "~/components/helpers/EmailLink.vue";
import {ISettings} from "~/types/common";
import {useNuxtData} from "~/.nuxt/imports";

defineProps<{
	api: PublicApi<PropTypes>
}>()

const {data: pages} = useNuxtData<{
	navBars: {
		title: string;
		handle: string;
		id: string;
	}[]
}>('customerPages')
const {data: settings} = useNuxtData<ISettings>('settings')
</script>

<template>
	<Transition
		enter-active-class="transition duration-200 ease-out"
		enter-from-class="opacity-0"
		enter-to-class=" opacity-100"
		leave-active-class="transition duration-150 ease-in"
		leave-from-class=" opacity-100"
		leave-to-class=" opacity-0">
		<div v-show="api.isOpen"
		     :class="{
		}"
		     class="w-screen absolute overflow-hidden glass transition-opacity top-full bottom-auto z-20 main-menu"
		     @click.self="api.close()">
			<Transition
				enter-active-class="transition duration-200 ease-out"
				enter-from-class="translate-y-1"
				enter-to-class="translate-y-0"
				leave-active-class="transition duration-150 ease-in"
				leave-from-class="translate-y-0"
				leave-to-class="translate-y-1">
				<div v-if="api.isOpen"
				     class="main-menu-content flex flex-col justify-between animate-menu-down transition ml-auto bg-system-gray-500 max-w-[40.1875rem] px-[5.87rem] "
				>
					<nav class="main-nav text-system-black-900" itemscope
					     itemtype="http://schema.org/SiteNavigationElement">
						<ul itemprop="about" itemscope itemtype="http://schema.org/ItemList">
							<li itemprop="itemListElement" itemscope itemtype="http://schema.org/ItemList">
								<nuxt-link @click.native="api.close()" itemprop="url" to="/catalog">
									<span>Каталог</span>
								</nuxt-link>
								<meta content="Каталог" itemprop="name"/>
							</li>
							<li itemprop="itemListElement" itemscope itemtype="http://schema.org/ItemList">
								<nuxt-link @click.native="api.close()" itemprop="url" to="/blog">
									<span>Идеи и тренды</span>
								</nuxt-link>
								<meta content="Идеи и тренды" itemprop="name"/>
							</li>
							<li itemprop="itemListElement" itemscope itemtype="http://schema.org/ItemList">
								<nuxt-link @click.native="api.close()" itemprop="url" to="/about">
									<span>О нас</span>
								</nuxt-link>
								<meta content="О нас" itemprop="name"/>
							</li>
							<li itemprop="itemListElement" itemscope itemtype="http://schema.org/ItemList">
								<nuxt-link @click.native="api.close()" itemprop="url" to="/contacts">
									<span>Контакты</span>
								</nuxt-link>
								<meta content="Контакты" itemprop="name"/>
							</li>
						</ul>
					</nav>

					<nav class="second-nav text-system-black-900" itemscope
					     itemtype="http://schema.org/SiteNavigationElement">
						<ul itemprop="about" itemscope itemtype="http://schema.org/ItemList">
							<template v-for="page of pages?.navBars" :key="page.id">

								<li itemprop="itemListElement" itemscope itemtype="http://schema.org/ItemList">
									<nuxt-link @click.native="api.close()" :to="page.handle" itemprop="url">
										<span>{{ page.title }}</span>
									</nuxt-link>
									<meta :content="page.title" itemprop="name"/>
								</li>
							</template>
						</ul>
					</nav>
					<address>
						<div class="address-block">
							<span class="address-header">Адрес шоурума</span>
							<span class="font-medium text-[1.125rem]" itemprop="address" itemscope
							      itemtype="http://schema.org/PostalAddress">{{ settings?.adressShowRoom }}</span>
						</div>
						<div class="address-block">
							<span class="address-header">Поддержка</span>
							<EmailLink :email="settings?.Email" class="!font-medium text-[1.125rem]"/>
							<TelLink :tel="settings?.phone"
							         class="-mt-1 whitespace-nowrap !font-medium  text-[1.125rem]"/>
						</div>
					</address>
				</div>
			</Transition>
		</div>
	</Transition>
</template>

<style lang="scss" scoped>
@keyframes scrollDown {
	from {
		opacity: 0;
	}
	to {
		opacity: 1;
	}
}

.main-menu {
	&-content {
		height: 100dvh;
		max-height: calc(100dvh - 5.3125rem );
		overflow-y: auto;
		padding-top: 3.88rem;
		padding-bottom: 4.56rem;
	}

	address {
		display: flex;
		gap: 3rem;
		align-items: flex-start;

		.address-block {
			display: flex;
			flex-direction: column;
			gap: 0.75rem;
			font-style: normal;

			.address-header {
				@apply text-system-gray-900;
				font-weight: 600;
				line-height: 140%;
				font-size: 1rem;
			}
		}
	}

	.main-nav {
		ul {
			gap: 2rem;
			display: flex;
			flex-direction: column;
		}

		a {
			font-size: 2.25rem;
			font-weight: 700;
			line-height: 140%;
		}
	}

	.second-nav {
		ul {
			gap: 1.5rem;
			display: flex;
			flex-direction: column;
		}

		a {
			font-size: 1.25rem;
			font-weight: 600;
			line-height: 140%;
		}
	}
}
</style>