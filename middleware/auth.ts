import {
	defineNuxtRouteMiddleware,
	navigateTo,
	useDirectusAuth,
	useDirectusUser,
} from "~/.nuxt/imports";

export default defineNuxtRouteMiddleware(async (to, from) => {
	const { fetchUser, setUser } = useDirectusAuth();
	const user = useDirectusUser();
	const nuxtApp = useNuxtApp()

	if (!user.value) {
		const user = await fetchUser();
		setUser(user.value);
	}
	if (!user.value) {
		return nuxtApp.runWithContext(() => navigateTo("/sign_in"));
	}
});
