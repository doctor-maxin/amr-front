import { defineNuxtPlugin } from "#app";
import Tooltip from '@programic/vue3-tooltip';
import '@programic/vue3-tooltip/dist/index.css';

export default defineNuxtPlugin(nuxtApp => {
    nuxtApp.vueApp.use(Tooltip)
});