import resolveConfig from 'tailwindcss/resolveConfig';
import * as tailwindConfig from '~/tailwind.config.js';
import { computed, onMounted, onUnmounted, ref } from '~/.nuxt/imports'

export function useDeviceWidth() {
    let w = typeof window !== 'undefined' ? window : undefined;
    let windowWidth = ref(w?.innerWidth || 0);
    const fullConfig = resolveConfig(tailwindConfig);

    const onWidthChange = () => {
        windowWidth.value = w?.innerWidth || 0;
    };
    onMounted(() => w?.addEventListener('resize', onWidthChange));
    onUnmounted(() => w?.removeEventListener('resize', onWidthChange));

    const isMobile = computed(() => {
        let mobile = Number(
            fullConfig.theme?.screens
                ? //@ts-ignore
                fullConfig.theme.screens['sm'].replace('px', '')
                : 640
        );
        return windowWidth.value >= 0 && windowWidth.value < mobile;
    });

    const isTablet = computed(() => {
        let tablet = Number(
            fullConfig.theme?.screens
                ? fullConfig.theme.screens['lg'].replace('px', '')
                : 1025
        );
        return windowWidth.value >= 0 && windowWidth.value < tablet;
    });

    return { isMobile, isTablet };
}
