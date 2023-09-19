import { vMaska } from 'maska';
import {defineNuxtPlugin} from '~/.nuxt/imports';

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.directive('maska', vMaska);
});
