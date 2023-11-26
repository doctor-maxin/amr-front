<script setup lang="ts">
import { normalizeProps, useMachine } from "@zag-js/vue";
import * as yup from "yup";
import { toast } from "vue3-toastify";
import { useFetch } from "@vueuse/core/index";
import FormHelperLink from "~/components/helpers/FormHelperLink.vue";
import UiButton from "~/components/ui/UiButton.vue";
import UiInput from "~/components/ui/UiInput.vue";
import { useListen } from "~/composables/useEventBus";
import * as dialog from "@zag-js/dialog";
import UiFileInput from '~/components/ui/UiFileInput.vue'


const [state, send] = useMachine(
    dialog.machine({
        id: 'feedBack',
        modal: true
    })
)
const api = computed(() => dialog.connect(state.value, send, normalizeProps))

const phoneRegExp = /^\+7 \d{3} \d{3} \d{2}-\d{2}$/;
const appConfig = useAppConfig();
const fileUpload = ref<boolean>(false)

const { handleSubmit, isSubmitting, resetForm } = useForm({
    validationSchema: yup.object().shape({
        callBackName: yup.string().required(),
        callBackFile: yup.mixed().optional(),
        callBackPhone: yup
            .string()
            .required()
            .matches(phoneRegExp, "Неверный номер телефона"),
        // callBackText: yup.string().optional(),
    }),
    initialValues: {
        callBackName: "",
        callBackPhone: "",
        callBackFile: undefined,
        // callBackText: "",
    },
});

useListen("toFeedBack", (showFileUpload?: boolean) => {
    if (showFileUpload) fileUpload.value = true;
    api.value.open();
});

watch(() => api.value.isOpen, (isOpen) => {
    if (!isOpen) {
        fileUpload.value = false;
    }
})

const sendForm = handleSubmit(async (values) => {
    const form = new FormData();
    form.append("name", values.callBackName);
    form.append("phone", values.callBackPhone);
    if (values.callBackFile) form.append("file", values.callBackFile);

    // form.append("comment", values.callBackText);

    const params = new URLSearchParams(window.location.search)
    params.append('from', window.location.href)

    const { data } = await useFetch(`/api/callback?${params.toString()}`).post(form).json<{
        id: string;
        status: string;
    }>();
    if (data.value?.id) {
        resetForm();
        toast.success(appConfig.messages.requestSuccess);
        api.value.close()
    } else {
        toast.error(appConfig.messages.requestError);
    }
})
</script>
<template>
    <ClientOnly>
        <Transition name="fade">
            <div v-if="api.isOpen" v-bind="api.backdropProps" @click.self="api.close()"
                class="fixed overscroll-contain top-0 h-[100dvh] w-screen items-end flex lg:items-center justify-center left-0 z-30 backdrop-brightness-50">
                <div v-bind="api.containerProps"
                    class="bg-white w-screen mt-auto lg:mb-auto relative lg:h-screen h-auto max-h-[calc(100vh_-_2.5rem)] max-w-[36rem] lg:max-h-[34.375rem] rounded-t-[1rem] lg:rounded-[2rem] px-4 py-7 lg:p-9">
                    <div class="overflow-y-auto pb-7 max-h-[calc(100vh_-_2.5rem_-_1.75rem)]">
                        <form class="flex flex-col gap-5 p-1" @submit.prevent="sendForm">
                            <h2 class="text-[1.375rem] lg:text-2xl text-system-black-950 font-semibold mb-3 text-center">
                                Заказать расчет
                            </h2>
                            <UiInput name="callBackName" autocomplete="name" hide-error placeholder="Имя"
                                class-name="w-full" />
                            <UiInput autocomplete="tel" hide-error name="callBackPhone" placeholder="Телефон"
                                class-name="w-full" type="tel" />
                            <!--                        <UiInput hide-error name="comment" placeholder="Комментарий" class-name="w-full" />-->
                            <UiFileInput v-if="fileUpload" placeholder="Загрузить проект" name="callBackFile" />
                            <div class="w-full">
                                <UiButton type="submit" :disabled="isSubmitting" title="Отправить" variant="dark"
                                    class="w-full" />
                                <FormHelperLink class="mt-[0.6rem] block w-full lg:mt-[0.8rem]" />
                            </div>
                        </form>
                    </div>
                    <button class="text-white absolute xl:-right-8 -top-10 xl:-top-8 right-3 z-10"
                        v-bind="api.closeTriggerProps">
                        <svgo-close filled class="text-4xl" />
                    </button>
                </div>
            </div>
        </Transition>
    </ClientOnly>
</template>