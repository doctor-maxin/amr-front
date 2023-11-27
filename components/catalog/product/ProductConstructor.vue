<script setup lang="ts">
import { useProductStore } from "~/store/product.store";
import { storeToRefs } from "pinia";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import UiSpinner from "~/components/ui/UiSpinner.vue";

const productStore = useProductStore();
const { data } = storeToRefs(productStore);
const container = ref<HTMLDivElement | null>(null);
const renderer = shallowRef(new THREE.WebGLRenderer());
const scene = shallowRef(new THREE.Scene());
const isLoading = ref(true);
const camera = shallowRef(null);
const light = shallowRef(new THREE.AmbientLight(0x404040, 10));
const loader = shallowRef(new GLTFLoader());
const axesHelper = shallowRef(new THREE.AxesHelper());
const controls = shallowRef(null);
const config = useRuntimeConfig();

scene.value.add(light.value);
scene.value.add(axesHelper.value);
scene.value.background = new THREE.Color(0xa0a0a0);
scene.value.fog = new THREE.Fog(0xa0a0a0, 10, 50);

const animate = () => {
	requestAnimationFrame(animate);
	// controls.value.update();

	renderer.value.render(scene.value, camera.value);
};

onMounted(async () => {
	if (process.client && container.value) {
		const width = container.value.getBoundingClientRect().width;
		const height = container.value.getBoundingClientRect().height;
		renderer.value.setSize(width, height);
		container.value.appendChild(renderer.value.domElement);
		camera.value = new THREE.PerspectiveCamera(
			60,
			width / height,
			0.1,
			100
		);
		camera.value.position.set(0, 1.2, -2.5);
		camera.value.rotation.set(6.3, 3.1, 0);
		const axesHelper = new THREE.AxesHelper(3);
		// scene.value.add(axesHelper);
		const dirLight = new THREE.DirectionalLight(0xffffff, 3);
		dirLight.position.set(-3, 10, -10);
		dirLight.castShadow = true;
		dirLight.shadow.camera.top = 2;
		dirLight.shadow.camera.bottom = -2;
		dirLight.shadow.camera.left = -2;
		dirLight.shadow.camera.right = 2;
		dirLight.shadow.camera.near = 0.1;
		dirLight.shadow.camera.far = 40;

		// controls.value.update();
		scene.value.add(dirLight);
		animate();
		loader.value.load(
			`${config.public.directus.url}/assets/${data.value?.file3D}`,
			(gltf) => {
				scene.value.add(gltf.scene);
				isLoading.value = false;
			},
			undefined,
			(err) => {
				console.error(err);
			}
		);
	}
});

useListen("selectOption", (ev) => {
	for (const name of ev.list.split(",")) {
		const mesh = scene.value.getObjectByName(name);
		if (mesh) {
			new THREE.TextureLoader().load(
				`${config.public.directus.url}/assets/${ev.image}`,
				(txt) => {
					mesh.material.map = txt;
					mesh.material.needsUpdate = true;
				}
			);
		}
	}
});
</script>

<template>
	<div class="aspect-square relative sticky top-0 w-full" ref="container">
		<div
			v-if="isLoading"
			class="bg-white w-full h-full absolute top-0 left-0 flex items-center justify-center"
		>
			<UiSpinner />
		</div>
	</div>
</template>

<style scoped>
#canvas {
	width: 50vw;
	height: 50vw;
}
</style>
