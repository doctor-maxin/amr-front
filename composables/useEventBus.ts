import mitt from "mitt";

type ApplicationEvents = {
	"on-filter": void;
	toFeedBack: void;
	"open-map": void;
	"close-modals": void;
};

const emitter = mitt<ApplicationEvents>();

export const useEvent = emitter.emit;
export const useListen = emitter.on;
