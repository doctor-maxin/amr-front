<script setup lang="ts">
import {
	useAsyncData,
	useDirectusItems,
	useDirectusUser,
	useHead
} from "../../.nuxt/imports";
import { IOrder } from "../../types/common";
import AccountOrderList from "~/components/account/AccountOrderList.vue";
import UiSpinner from "../../components/ui/UiSpinner.vue";
import fetchSeo from "~/composables/fetchSeo";


useHead({
	title: 'Заказы'
})
await fetchSeo()

const { getItems } = useDirectusItems();
const user = useDirectusUser();
const { data, pending } = useAsyncData(() =>
	getItems<IOrder>({
		collection: "orders",
		params: {
			filter: {
				user_created: {
					_eq: user.value?.id,
				},
			},
		},
	})
);
</script>

<template>
	<div>
		<div class="flex justify-center" v-if="!data?.length">
			<UiSpinner v-if="pending" />
			<h2 v-else class="text-2xl text-center text-system-gray-900 font-semibold text-opacity-40">
				Вы еще ничего не заказывали
			</h2>
		</div>
		<div v-else>
			<AccountOrderList :list="data" />
		</div>
	</div>
</template>

<style scoped></style>
