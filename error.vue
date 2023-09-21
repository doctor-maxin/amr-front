<script lang="ts" setup>
import UiButton from "~/components/ui/UiButton.vue";
import {IProduct} from "~/types/product";
import {useDirectusItems, useAsyncData, clearError, ref} from "./.nuxt/imports";
import { ISettings } from "./types/common";

const {getSingletonItem, getItemById} = useDirectusItems();

defineProps({
	error: Object
})
const product = ref<Pick<IProduct, 'name' | 'images' | 'handle'> | null>(null);
const {data: settings} = await useAsyncData('settings', () => getSingletonItem<ISettings>({
	collection: 'settings',
	params: {
		fields: ['notFoundText', 'notFoundProduct']
	}
}))

if (settings.value?.notFoundProduct) {
	const response = await getItemById<Pick<IProduct, 'name' | 'images' | 'handle'>>({
		collection: settings.value.notFoundProduct.collection,
		id: settings.value.notFoundProduct.key,
		params: {
			fields: ['name', 'images.directus_files_id', 'handle']
		}
	})
	if (response) product.value = response
}

const handleError = () => clearError({redirect: '/'})
const toProduct = () => {
	clearError({redirect: `/catalog/${product.value?.handle}`})
}
</script>

<template>
	<div class="bg-system-gray-500 error-page flex flex-col">
		<nuxt-link to="/"><img alt="Логотип" class="logo" src="/logo.png"/></nuxt-link>
		<div class="content">
			<div class="text-[2rem] flex gap-4 lg:text-[3rem] mb-2 lg:mb-0"><span class="font-bold">ОШБИКА</span>
				<span>{{ error?.statusCode }}</span></div>
			<div class="lg:max-w-[21.6rem]" v-if="error?.statusCode === 404">
				<p class="text-sm font-semibold lg:text-[1.125rem] lg:pt-5">{{ settings?.notFoundText }}</p>
				<nuxt-link v-if="product" class="product " @click.prevent="toProduct">
					<NuxtImg
						v-if="product.images?.length"
						:src="product.images[0].directus_files_id"
						class="max-w-[17.75rem] lg:max-w-none rounded-2xl"
						provider="directus"
					/>
					<UiButton title="Посмотреть" @click="toProduct"/>
				</nuxt-link>
			</div>
			<UiButton class="w-full lg:w-fit lg:mt-5" title="Вернуться на главную" title-class="btn-title" variant="dark"
			          @click="handleError"/>
		</div>
	</div>
</template>

<style lang="scss">
.error-page {
	padding: 2.62rem 1rem 2.815rem;
	min-height: 100dvh;
	@media (min-width: 1024px) {
		padding: 4rem 4.375rem;
	}
}

.error-page .logo {
	width: 8.5rem;
	height: 2.625rem;
}

.error-page .content {
	padding-top: 3.5rem;
	margin-top: auto;
	@media (min-width: 1024px) {
		display: flex;
		align-items: flex-start;
		gap: 5rem;
		justify-content: flex-start;
	}
}

.error-page .content p {
	margin-bottom: 1.56rem;
	@media (min-width: 1024px) {
		margin-bottom: 4.81em;
	}
}

.error-page .btn-title {
	font-weight: 400;
}

.error-page .product {
	margin-bottom: 3.5rem;
	display: flex;
	flex-direction: column;
	gap: 1.56rem;
}
</style>