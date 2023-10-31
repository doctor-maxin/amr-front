
<script setup lang="ts">
import { useListen } from "~/composables/useEventBus";
import { computed, ref, useAppConfig, useForm, useRoute } from "../../.nuxt/imports";
import * as dialog from "@zag-js/dialog";
import { normalizeProps, useMachine } from "@zag-js/vue";
import { IProduct } from "~/types/product";
import FormHelperLink from "~/components/helpers/FormHelperLink.vue";
import UiButton from "~/components/ui/UiButton.vue";
import UiInput from "~/components/ui/UiInput.vue";
import { useFetch } from "@vueuse/core/index";
import { toast } from "vue3-toastify";
import * as yup from "yup";

const [state, send] = useMachine(dialog.machine({ id: "productForm" }));
const api = computed(() => dialog.connect(state.value, send, normalizeProps));
const product = ref<IProduct | null>(null);

useListen("open:product-form", async (pr: IProduct) => {
	api.value.open();
	product.value = pr;
});
const phoneRegExp = /^\+7 \d{3} \d{3} \d{2}-\d{2}$/;
const appConfig = useAppConfig();

const { handleSubmit, isSubmitting, resetForm } = useForm({
	validationSchema: yup.object().shape({
		name: yup.string().required(),
		phone: yup
			.string()
			.required()
			.matches(phoneRegExp, "Неверный номер телефона"),
		comment: yup.string().optional(),
	}),
	initialValues: {
		name: "",
		phone: "",
		comment: "",
	},
});
const route = useRoute()

const sendForm = handleSubmit(async (values) => {
	const form = new FormData();
	form.append("name", values.name);
	form.append("phone", values.phone);
	form.append("comment", values.comment);
	form.append('variant', route.query?.variantId)
	form.append("product", JSON.stringify(product.value));

	const { data } = await useFetch("/api/callback").post(form).json<{
		id: string;
		status: string;
	}>();
	if (data.value?.id) {
		resetForm();
		toast.success(appConfig.messages.requestSuccess);
		api.value.close();
	} else {
		toast.error(appConfig.messages.requestError);
	}
});
</script>

<template>
	<ClientOnly>
		<Transition name="fade">
			<div v-if="api.isOpen" v-bind="api.backdropProps"
				class="fixed overscroll-contain top-0 h-[100dvh] w-screen items-end flex lg:items-center justify-center left-0 z-30 backdrop-brightness-50">
				<div v-bind="api.containerProps"
					class="bg-white w-screen relative lg:h-screen max-h-[90vh] max-w-[36rem] lg:max-h-[34.375rem] rounded-t-[1rem] lg:rounded-[2rem] px-4 py-7 lg:p-9">
					<form v-if="product" class="flex flex-col gap-5" @submit.prevent="sendForm">
						<h2 class="text-[1.375rem] lg:text-2xl text-system-black-950 font-semibold mb-3 text-center">
							Заказать расчет {{ product.name }}
						</h2>
						<UiInput name="name" autocomplete="name" hide-error placeholder="Имя" class-name="w-full" />
						<input type="text" hidden name="variant">
						<UiInput autocomplete="tel" hide-error name="phone" placeholder="Телефон" class-name="w-full"
							type="tel" />
						<UiInput hide-error name="comment" placeholder="Комментарий" class-name="w-full" />
						<div class="w-full">
							<UiButton type="submit" :disabled="isSubmitting" title="Отправить" variant="dark"
								class="w-full" />
							<FormHelperLink class="mt-[0.6rem] block w-full lg:mt-[0.8rem]" />
						</div>
					</form>

					<button class="text-white absolute xl:-right-8 -top-10 xl:-top-8 right-3 z-10"
						v-bind="api.closeTriggerProps">
						<svgo-close filled class="text-4xl" />
					</button>
				</div>
			</div>
		</Transition>
	</ClientOnly>
</template>


<style scoped></style>
