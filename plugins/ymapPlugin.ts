import plugin from 'vue-yandex-maps'
import { defineNuxtPlugin } from '#app'


export default defineNuxtPlugin((nuxtApp) => {
    const settings = {
        apiKey: '45411020-0966-44ba-9ad2-f75d62b1d897', // Индивидуальный ключ API
        lang: 'ru_RU', // Используемый язык
        coordorder: 'latlong', // Порядок задания географических координат
        debug: false, // Режим отладки
        version: '2.1' // Версия Я.Карт
    }
    nuxtApp.vueApp.use(plugin, settings)
})