export type IProduct = {
    catalogId: string;
    categoryId: string;
    count: number;
    id: string;
    name: string;
    nameCount: number | null;
    options: any[];
    optionsValues: any[];
    taxName: null | string;
    description: string;
    taxValue: null | string;
    vendor: string;
    handle: string;
    images: {
        directus_files_id: string;
        id?: number;
        products_id?: string;
    }[];
    price: number;
}

export type IProductWithCategory = IProduct & {
    categoryId: {
        handle: string;
        id: string;
    }
}

export type IProductPicked = Pick<IProduct, 'handle' | 'id' | 'name' | 'price' | 'images'>
