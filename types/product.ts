export type IVariantType = 'color' | 'image'
export type IVariant = {
	color: string;
	id: string;
	type: IVariantType;
	name: string;
	image: undefined;
	images: {
		directus_files_id: string;
		id?: number;
		products_id?: string;
	}[];
	productId: number;
} | {
	id: string;
	name: string;
	color: undefined;
	images: {
		directus_files_id: string;
		id?: number;
		products_id?: string;
	}[];
	type: IVariantType;
	image: string;
	productId: number;
}
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
	variants?: IVariant[];
	canNotBye: boolean;
	taxValue: null | string;
	vendor: string;
	handle: string;
	images: {
		directus_files_id: string;
		id?: number;
		products_id?: string;
	}[];
	price: number;
};

export type IProductWithCategory = IProduct & {
	categoryId: {
		handle: string;
		id: string;
	};
};

export type IProductPicked = Pick<
	IProduct,
	"handle" | "id" | "name" | "price" | "images" | "count" | "canNotBye"
>;

export type ICatalogProduct = Pick<IProduct, 'id' | 'handle' | 'name' | 'images' | 'price' | 'canNotBye' | 'count' | 'variants'>