import mitt from "mitt";

export type IFilterPayload = {
	id: string;
	values: string[];
};

type ApplicationEvents = {
	"on-filter": IFilterPayload[];
	"on-sort": void;
	toFeedBack: void;
	"open-map": void;
	"close-modals": void;
};

const emitter = mitt<ApplicationEvents>();

export const useEvent = emitter.emit;
export const useListen = emitter.on;
