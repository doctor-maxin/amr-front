import {defineStore} from "pinia";
import {IProduct} from "~/types/product";
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

type ProductState = {
    activeTab: Tabs;
    product: IProduct |null;
    isLoading: boolean;
    isLoadingModel: boolean;
    data: null | IProductConstructor;
    materialItems: IMaterialItem[];
}
export enum Tabs {
    DESC = "description",
    PROPS = "properties",
    CONST = 'constructor'
}
type IMaterialItem = {
    id: number;
    name: string;
    image: string;
    price: number;
}
type IProductMaterial = {
    name:string;
    id: number;
    nameList:string;
    items: number[];
    selectedValue?: number;
}
type IProductConstructor = {
    id: number;
    description: string;
    file3D: string;
    cameraX: number;
    cameraY: number;
    cameraZ: number;
    materials: { productConstructorMaterials_id: IProductMaterial }[];
}

export const useProductStore = defineStore('product-store', {
   state: (): ProductState => ({
       activeTab: Tabs.CONST,
       product: null,
       isLoading: false,
       isLoadingModel: false,
       materialItems: [],
       data: null,
       scene: null,
       camera: null,
       renderer: null
   }),
    actions: {
        selectOption(materialId: number, valueId: number) {
            if (this.data) {
                const materialItem = this.data.materials.find(i => i.productConstructorMaterials_id.id === materialId)
                if (materialItem) {
                    materialItem.productConstructorMaterials_id.selectedValue = valueId;
                    const item = this.materialItems.find(i => i.id === valueId)
                    useEvent('selectOption',{
                        list: materialItem.productConstructorMaterials_id.nameList,
                        image: item?.image
                    })
                }
            }
        },
        setTab(tab: Tabs) {
            this.activeTab = tab
        },
        setMaterialItems(list: IMaterialItem[]) {
            this.materialItems = list;
        },
        getMaterialItem(id: number) {
            return this.materialItems.find(item => item.id === id)
        },
        setProduct(product: IProduct) {
            if (product?.have3DFile) {
                this.product = product
                this.isLoading = true;
            }
        },
        setData(data: IProductConstructor) {
            this.data = data
            this.isLoading = false;
        },
        initThreeJS() {
            // this.scene = new THREE.Scene();
            // this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
            // const renderer = new THREE.WebGLRenderer();
            // renderer.setSize( window.innerWidth / 2, window.innerWidth / 2 );
            // this.renderer = renderer

            // return renderer.domElement
        },
        startAnimate() {
            requestAnimationFrame( this.startAnimate );
            this.renderer.render( this.scene, this.camera );
        },
        startLoadModel(path) {
            const light = new THREE.AmbientLight(0x404040)
            this.scene.add(light)

            const loader = new GLTFLoader();
            loader.load( path,  ( gltf ) => {
                this.scene.add( gltf.scene );
            }, undefined, function ( error ) {
                console.error( error );
            } );
        }
    }
})