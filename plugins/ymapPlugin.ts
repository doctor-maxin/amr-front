import plugin from "vue-yandex-maps";

export default defineNuxtPlugin((nuxtApp) => {
	const appConfig = useRuntimeConfig();

	const settings = {
		apiKey: "cc97cb86-1ceb-44ef-9890-0c2211bf66e1", // Индивидуальный ключ API
		lang: "ru_RU", // Используемый язык
		coordorder: "latlong", // Порядок задания географических координат
		debug: false, // Режим отладки
		version: "2.1", // Версия Я.Карт
	};
	nuxtApp.vueApp.use(plugin, settings);
});
