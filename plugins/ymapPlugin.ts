import plugin from 'vue-yandex-maps'

export default defineNuxtPlugin((nuxtApp) => {
    const appConfig = useRuntimeConfig();
    console.log('kle', appConfig.public.yandexKey)

    const settings = {
        apiKey:  appConfig.public.yandexKey, // Индивидуальный ключ API
        lang: 'ru_RU', // Используемый язык
        coordorder: 'latlong', // Порядок задания географических координат
        debug: false, // Режим отладки
        version: '2.1' // Версия Я.Карт
    }
    nuxtApp.vueApp.use(plugin, settings)
})