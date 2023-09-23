<script setup lang="ts">
import UiInput from "~/components/ui/UiInput.vue";
import UiButton from "~/components/ui/UiButton.vue";
import {
	ref,
	useDirectusUser,
	useDirectusUsers,
	useForm,
} from "../../.nuxt/imports";
import * as yup from "yup";
import { DirectusUser } from "nuxt-directus/dist/runtime/types";

const isEditing = ref<boolean>(false);
const user = useDirectusUser();
console.log(user.value);
const { updateUser } = useDirectusUsers();

const { handleSubmit } = useForm({
	validationSchema: yup.object().shape({
		firstName: yup.string().optional(),
		lastName: yup.string().optional(),
		phone: yup.string().required(),
		email: yup.string().required().email(),
	}),
	initialValues: {
		firstName: user.value?.first_name,
		lastName: user.value?.last_name,
		phone: user.value?.phone,
		email: user.value?.email,
	},
});

const save = handleSubmit(async (values) => {
	try {
		await updateUser<DirectusUser>({
			id: user.value?.id ?? "21",
			user: {
				first_name: values.firstName,
				last_name: values.lastName,
				email: values.email,
				phone: values.phone,
			},
		});
	} catch (err: any) {
		console.log("updatte ", err);
	}
});
</script>

<template>
	<div class="card flex flex-col gap-[1.125rem] lg:gap-[1.56rem]">
		<h2 class="font-semibold lg:text-2xl">Мои данные</h2>
		<div class="grid lg:grid-cols-2 gap-[1.125rem] lg:gap-[1.56rem]">
			<UiInput
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
		<div class="ml-auto flex gap-1.5 lg:gap-[1.12rem] overflow-x-clip">
			<UiButton
				@click="isEditing = true"
				variant="default"
				title="Редактировать"
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
