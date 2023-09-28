<script setup lang="ts">
import { useDirectusItems, useField, useForm } from "#imports";
import * as yup from 'yup'
import { useCartStore } from "~/store/cart.store";
import { IPromoCode } from "~/types/common";
import { storeToRefs } from "pinia";

const {getItems} = useDirectusItems()
const cartStore = useCartStore()
const {discount} = storeToRefs(cartStore)

const {handleSubmit, isSubmitting} = useForm({
	initialValues: {
		promocode: discount.value?.code || ''
	},
	validationSchema: yup.object().shape({
		promocode: yup.string()
	})
})

const {value, setErrors, errorMessage} = useField('promocode')

const processForm = handleSubmit(async (values) => {
	const result = await getItems<IPromoCode>({
		collection: 'promocodes',
		params: {
			filter: {
				code: {
					_contains: values.promocode
				}
			}
		}
	})
	if (!result?.length) {
		return setErrors('Промокод не найден')
	}
	cartStore.setPromoCode(result[0])
})
</script>
<template>
	<div class="relative">
		<form @submit.prevent="processForm" class="mb-2 p-[5px] border border-black flex max-w-full items-center justify-between rounded-[2.1875rem]">
			<input name="promocode" v-model="value" type="text" placeholder="Промокод" class="pl-7 w-full pr-4 font-semibold focus:outline-none placeholder:text-system-gray-800 bg-transparent" />
			<button :disabled="isSubmitting" type="submit" class="rounded-[2.1875rem] disabled:pulse disabled:bg-opacity-60 hover:bg-accent-300 transition-colors bg-system-black-900 px-5 py-3 text-white font-medium">Применить</button>
		</form>
		<div v-if="errorMessage" class="text-[#F33] font-medium">{{errorMessage}}</div>
	</div>
</template>
