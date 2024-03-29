<script setup lang="ts">
import { useProductStore } from "~/store/product.store";
import { storeToRefs } from "pinia";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import UiSpinner from "~/components/ui/UiSpinner.vue";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const productStore = useProductStore();
const { data } = storeToRefs(productStore);
const container = ref<HTMLDivElement | null>(null);
const renderer = shallowRef(new THREE.WebGLRenderer({ antialias: true }));
const scene = shallowRef(new THREE.Scene());
const isLoading = ref(true);
const camera = shallowRef(null);
const light = shallowRef(new THREE.AmbientLight(0x404040, 10));
const loader = shallowRef(new GLTFLoader());
const axesHelper = shallowRef(new THREE.AxesHelper());
const controls = ref(null);
const config = useRuntimeConfig();

scene.value.add(light.value);
scene.value.add(axesHelper.value);
scene.value.background = new THREE.Color(0xa0a0a0);
scene.value.fog = new THREE.Fog(0xa0a0a0, 10, 50);

const animate = () => {
	requestAnimationFrame(animate);
	// controls.value.update();
	// console.log(camera.value.rotation, camera.value.position)
	renderer.value.render(scene.value, camera.value);
};

const onResize = () => {
	if (container.value) {
		const width = container.value.getBoundingClientRect().width;
		const height = container.value.getBoundingClientRect().height;
		renderer.value.setSize(width, height);
	}
};

onBeforeUnmount(() => {
	if (process.client) window.removeEventListener("resize", onResize);
});

const setCameraData = () => {
	if (!camera.value) return;

	const position = data.value?.position?.split(",");
	const pX = position?.[0] ? Number(position[0]) : 0;
	const pY = position?.[1] ? Number(position[1]) : 0;
	const pZ = position?.[2] ? Number(position[2]) : 0;
	const rotation = data.value?.rotation?.split(",");
	const rX = rotation?.[0] ? Number(rotation[0]) : 0;
	const rY = rotation?.[1] ? Number(rotation[1]) : 0;
	const rZ = rotation?.[2] ? Number(rotation[2]) : 0;

	//@ts-ignore
	camera.value.position.set(pX, pY, pZ);
	//@ts-ignore
	camera.value.rotation.set(rX, rY, rZ);
};

onMounted(async () => {
	if (process.client && container.value) {
		setTimeout(() => {
			onResize();
		}, 300);
		window.addEventListener("resize", onResize);

		const width = container.value.getBoundingClientRect().width;
		const height = container.value.getBoundingClientRect().height;
		renderer.value.setSize(width, height);
		container.value.appendChild(renderer.value.domElement);
		camera.value = new THREE.PerspectiveCamera(
			(0.8 * 180) / Math.PI,
			width / height,
			0.01,
			1000
		);

		setCameraData();
		renderer.value.shadowMap.enabled = true;
		renderer.value.shadowMap.type = THREE.PCFSoftShadowMap;


		scene.value.background = new THREE.Color(0xa0a0a0);
		scene.value.fog = new THREE.Fog(0xa0a0a0, 10, 50);

		const hemiLight = new THREE.HemisphereLight(0xffffff, 0x8d8d8d, 2);
		hemiLight.position.set(0, 20, 0);
		scene.value.add(hemiLight);

		const dirLight = new THREE.DirectionalLight(0xffffff, 2);
		dirLight.position.set(3, 10, 10).normalize()
		dirLight.castShadow = true;
		dirLight.shadow.camera.top = 2;
		dirLight.shadow.camera.bottom = - 2;
		dirLight.shadow.camera.left = - 2;
		dirLight.shadow.camera.right = 2;
		dirLight.shadow.camera.near = 0.1;
		dirLight.shadow.camera.far = 40;
		scene.value.add(dirLight);

		//const dirLight = new THREE.AmbientLight(0xffffff);
		//dirLight.position.set(0, 1, 3);
		//dirLight.castShadow = true;
		// controls.value = new OrbitControls( camera.value, renderer.value.domElement );

		renderer.value.gammaInput = true;
		renderer.value.gammaOutput = true;
		// controls.value.update();
		//scene.value.add(dirLight);

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

					txt.encoding = THREE.sRGBEncoding;
					txt.wrapS = THREE.RepeatWrapping;
					txt.wrapT = THREE.RepeatWrapping;

					mesh.material.map = txt;
					mesh.material.needsUpdate = true;
				}
			);
		}
	}
});
</script>

<template>
	<div class="aspect-[59/42] relative sticky top-[5.3125rem] w-full" ref="container">
		<div v-if="isLoading" class="bg-white w-full h-full absolute top-0 left-0 flex items-center justify-center">
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
