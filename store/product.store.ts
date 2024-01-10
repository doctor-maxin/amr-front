import { defineStore } from "pinia";
import { IProduct } from "~/types/product";

type ProductState = {
    activeTab: Tabs;
    product: IProduct | null;
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
export type IMaterialItem = {
    id: number;
    name: string;
    image: string;
    price: number;
}
export type IProductMaterial = {
    name: string;
    id: number;
    nameList: string;
    items: {
        productConstructorMaterialItem_id: IMaterialItem
    }[];
    selectedValue?: number;
}
export type IProductConstructor = {
    id: number;
    description: string;
    file3D: string;
    position: string;
    rotation: string;
    materials: { productConstructorMaterials_id: IProductMaterial }[];
}

export const useProductStore = defineStore('product-store', {
    state: (): ProductState => ({
        activeTab: Tabs.DESC,
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
                    useEvent('selectOption', {
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
            if (product?.have3D) {
                this.product = product
                this.isLoading = true;
            }
        },
        setData(data: IProductConstructor) {
            this.data = data
            this.isLoading = false;
        },
    }
})