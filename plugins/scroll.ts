import PerfectScrollbar from 'vue3-perfect-scrollbar'
import 'vue3-perfect-scrollbar/dist/vue3-perfect-scrollbar.css'
import { defineNuxtPlugin } from "#imports";

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.use(PerfectScrollbar);
});
