import { createDirectus } from '@directus/sdk';
import { rest, readItem, readItems } from '@directus/sdk/rest';
import { defineNuxtPlugin } from "../.nuxt/imports";

const directus = createDirectus('https://directus.example.com').with(rest());

export default defineNuxtPlugin(() => {
	return {
		provide: { directus, readItem, readItems },
	};
});