<script setup lang="ts">
import UiInput from "~/components/ui/UiInput.vue";
import UiButton from "~/components/ui/UiButton.vue";
import {
	nextTick,
	ref,
	useDirectusAuth,
	useDirectusUser,
	useDirectusUsers,
	useForm,
	useHead,
} from "../../.nuxt/imports";
import * as yup from "yup";
import { DirectusUser } from "nuxt-directus/dist/runtime/types";
import { toast } from "vue3-toastify";

useHead({
	title: "Личный кабинет",
});
const isEditing = ref<boolean>(false);
const user = useDirectusUser();
const { updateUser } = useDirectusUsers();
const firstNameRef = ref<{
	input?: null | HTMLInputElement;
}>(null);
const { setUser } = useDirectusAuth();

const { handleSubmit, resetForm } = useForm({
	validationSchema: yup.object().shape({
		firstName: yup.string().optional(),
		lastName: yup.string().optional(),
		phone: yup.string().required(),
		email: yup.string().required().email(),
		city: yup.string().optional(),
	}),
	initialValues: {
		firstName: user.value?.first_name,
		lastName: user.value?.last_name,
		phone: user.value?.phone,
		email: user.value?.email,
		city: user.value?.city,
	},
});

const save = handleSubmit(async (values) => {
	try {
		const newUser = await updateUser<DirectusUser>({
			id: user.value?.id ?? "",
			user: {
				first_name: values.firstName,
				last_name: values.lastName,
				email: values.email,
				phone: values.phone,
				city: values.city,
			},
		});
		setUser(newUser);
		toast.success("Данные успешно обновлены");
		isEditing.value = false;
	} catch (err: any) {
		toast.error("Возникла ошибка при сохранении");
		console.log("updatte ", err);
	}
});

const startEdit = () => {
	isEditing.value = true;
	nextTick(() => {
		if (firstNameRef.value?.input) {
			console.log(firstNameRef.value.input);
			firstNameRef.value.input.focus();
		}
	});
};
const stopEdit = () => {
	resetForm();
	isEditing.value = false;
};
</script>

<template>
	<div class="card flex flex-col gap-[1.125rem] lg:gap-[1.56rem]">
		<h2 class="font-semibold lg:text-2xl">Мои данные</h2>
		<div class="grid lg:grid-cols-2 gap-[1.125rem] lg:gap-[1.56rem]">
			<UiInput
				ref="firstNameRef"
				class-name="w-full"
				:readonly="!isEditing"
				name="firstName"
				autocomplete="given-name"
				placeholder="Имя"
			/>
			<UiInput
				class-name="w-full"
				name="lastName"
				autocomplete="family-name"
				:readonly="!isEditing"
				placeholder="Фамилия"
			/>
		</div>
		<UiInput
			class-name="w-full"
			type="email"
			name="email"
			autocomplete="email"
			:readonly="!isEditing"
			placeholder="Почта"
		/>
		<UiInput
			class-name="w-full"
			type="tel"
			autocomplete="tel"
			name="phone"
			:readonly="!isEditing"
			placeholder="Телефон"
		/>
		<UiInput
			class-name="w-full"
			name="city"
			:readonly="!isEditing"
			placeholder="Город"
		/>
		<div class="ml-auto flex gap-1.5 lg:gap-[1.12rem] overflow-x-clip">
			<UiButton
				v-if="!isEditing"
				@click="startEdit"
				variant="default"
				title="Редактировать"
				title-class="font-normal text-sm lg:text-base"
			/>
			<UiButton
				v-else
				@click="stopEdit"
				variant="default"
				title="Отменить"
				title-class="font-normal text-sm lg:text-base"
			/>
			<UiButton
				variant="dark"
				@click="save"
				:disabled="!isEditing"
				title="Сохранить"
				title-class="font-normal text-sm lg:text-base"
			/>
		</div>
	</div>
</template>

<style scoped></style>
