import mitt from "mitt";
import { IProduct, IVariant } from "~/types/product";

export type IFilterPayload = {
	id: string;
	values: string[];
};

type ApplicationEvents = {
	"on-filter": IFilterPayload[];
	"on-sort": void;
	toFeedBack: void;
	"open-map": void;
	"open:product-form": IProduct;
	"close-modals": void;
	"select:variant": IVariant;
};

const emitter = mitt<ApplicationEvents>();

export const useEvent = emitter.emit;
export const useListen = emitter.on;
