<script lang="ts" setup>
import { storeToRefs } from "pinia";
import * as yup from "yup";
import {
	computed,
	debouncedWatch,
	markRaw,
	ref,
	useAppConfig,
	useDirectusItems,
	useForm,
	useRouter,
	useUrlSearchParams,
	watchEffect,
} from "../../.nuxt/imports";
import CheckoutAside from "../../components/checkout/CheckoutAside.vue";
import CheckoutContacts from "../../components/checkout/CheckoutContacts.vue";
import CheckoutDelivery from "../../components/checkout/CheckoutDelivery.vue";
import CheckoutPaymentTypes from "../../components/checkout/CheckoutPaymentTypes.vue";
import PageHeader from "../../components/page/Header.vue";
import UiButton from "../../components/ui/UiButton.vue";
import { useCartStore } from "../../store/cart.store";
import { CartPopulatedItem, DeliveryTypes } from "../../types/cart";
import { IBreadCrumb, ILink } from "../../types/common";
import { IProduct } from "../../types/product";

const breadCrumbs = markRaw<IBreadCrumb[]>([
	{
		title: "Корзина",
		path: "/cart",
	},
	{
		title: "Оформление",
		path: "/checkout",
	},
	{
		title: "Оплата",
		path: "/",
		disabled: true,
	},
]);

const backLink = {
	path: "back",
	title: "Продолжить покупки",
} satisfies ILink;
const cartStore = useCartStore();
const phoneRegExp = /^\+7 \d{3} \d{3} \d{2}-\d{2}$/;
const { items } = storeToRefs(cartStore);
const { productId } = useUrlSearchParams("history");

const router = useRouter();

const { getItems } = useDirectusItems();
const lines = ref<Map<string, CartPopulatedItem>>(new Map());
const appConfig = useAppConfig();
const filters = computed(() => {
	let payload = {
		id: {
			_in: "",
		},
	};
	if (typeof productId === "string") {
		payload.id._in = productId;
	} else if (items.value?.length) {
		payload.id._in = items.value.map((item) => item.id);
	}
	return payload;
});

const products = await getItems<IProduct>({
	collection: "products",
	params: {
		filter: filters.value,
		fields: ["images.directus_files_id", "*"],
	},
});

const { setFieldError, meta, values } = useForm({
	validationSchema: yup.lazy((value) => {
		const payload = {
			name: yup.string().required().min(4),
			phone: yup
				.string()
				.matches(phoneRegExp, "Неверный номер телефона")
				.required("Поле обязательно"),
			email: yup.string().required().email(),
			paymentType: yup.string().required(),
		};

		if (value.deliveryType === "points") {
			payload.deliveryPointId = yup.string().required();
			payload.address = yup.mixed().optional();
		} else {
			payload.city = yup.string().required();
			payload.street = yup.string().required();
			payload.house = yup.string().required();
			payload.flat = yup.string().required();
			payload.floor = yup.string().optional();
			payload.entrance = yup.string().optional();
		}
		return yup.object().shape(payload);
	}),
	initialValues: {
		name: "",
		phone: "",
		email: "",
		paymentType: "",
		deliveryType: "",
		city: "",
		street: "",
		house: "",
		flat: "",
		floor: undefined,
		entrance: undefined,
		address: "",
		deliveryPointId: "",
	},
});

watchEffect(() => {
	if (productId) {
		const product = products.find((p) => p.id === productId);
		if (product)
			lines.value.set(productId.toString(), {
				product,
				count: 1,
				id: productId.toString(),
			});
	} else {
		for (const item of items.value) {
			const product = products.find((p) => p.id === item.id);
			if (product)
				lines.value.set(item.id, {
					product,
					...item,
				});
		}
		for (const id of lines.value.keys()) {
			const hasId = items.value.find((p) => p.id === id);
			if (!hasId) {
				lines.value.delete(id);
			}
		}
	}
});

debouncedWatch(
	() => values.deliveryPointId,
	async () => {
		console.log("Calc started");
		if (
			values.deliveryType === DeliveryTypes.points &&
			values.deliveryPointId
		) {
			return cartStore.setDelivery({
				amount: 0,
				calculated: true,
				type: DeliveryTypes.points,
			});
		}
	},
	{
		debounce: 500,
	}
);
const calcDeliveryPrice = async () => {
	console.log("Calc started");
	if (!window.ymaps) return;
	if (!values.city || !values.street || !values.house) return;
	const fromAddress = `${values.city ?? ""} ,${values.street ?? ""}, ${
		values.house ?? ""
	}`;

	const route = await ymaps.route([fromAddress, appConfig.stockCoords]);
	const km = parseInt(route.getLength()) / 1000;

	cartStore.setDelivery({
		type: DeliveryTypes.delivery,
		calculated: true,
		//@ts-ignore
		amount: (appConfig.priceTarriff * km).toFixed(0),
	});
};

debouncedWatch(() => values.city, calcDeliveryPrice, { debounce: 500 });
debouncedWatch(() => values.street, calcDeliveryPrice, { debounce: 500 });
debouncedWatch(() => values.house, calcDeliveryPrice, { debounce: 500 });
</script>

<template>
	<PageHeader
		:bread-crumbs="breadCrumbs"
		:link="backLink"
		page-name="Корзина"
		progress
	/>
	<div
		class="max-w-[92.375rem] lg:mx-auto pt-[2.375rem] pb-[1.56rem] lg:pb-[8.75rem] lg:pt-[4.62rem] flex-1"
	>
		<main
			v-if="lines.size || productId"
			class="lg:items-start gap-[2.75rem] lg:gap-[1.875rem] lg:flex-row flex-col justify-center flex px-4 bg-white"
		>
			<div class="flex flex-1 w-full flex-col gap-7 w-full">
				<CheckoutContacts />
				<CheckoutDelivery />
				<CheckoutPaymentTypes />
			</div>
			<CheckoutAside
				:values="values"
				:is-valid="meta.valid"
				:lines="lines"
				:set-field-error="setFieldError"
			/>
		</main>
		<main v-else class="flex items-center justify-center flex-col gap-10">
			<div
				class="text-system-black-900 font-semibold text-2xl text-opacity-40"
			>
				В корзине ничего нет, давайте это исправим!
			</div>
			<UiButton
				@click="router.push('/catalog')"
				variant="dark"
				title="Перейти в каталог"
				class="w-full max-w-[22rem]"
				title-class="!text-base"
			/>
		</main>
	</div>
</template>

<style scoped></style>
