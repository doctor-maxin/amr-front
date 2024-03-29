import mitt from "mitt";
import { IStore } from "~/types/common";
import { IProduct, IVariant } from "~/types/product";

export type IFilterPayload = {
	id: string;
	values: string[];
};

type ApplicationEvents = {
	"on-filter": IFilterPayload[];
	"on-sort": void;
	'reset-filters': void;
	'toFeedBack': boolean | undefined;
	"open-map": void;
	"open:product-form": IProduct;
	"close-modals": void;
	"select:variant": IVariant;
	'setDeliveryPoint': IStore;
	'selectOption': {
		list: string;
		image?: string;
	}
};

const emitter = mitt<ApplicationEvents>();

export const useEvent = emitter.emit;
export const useListen = emitter.on;
