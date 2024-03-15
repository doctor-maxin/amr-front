import { useRoute } from "#imports";
import { IFilterPayload } from "~/composables/useEventBus";

export function useFiltersHelpers() {
	const getFiltersFromQuery = () => {
		if (process.server || !window) return;
		const activeFilters: IFilterPayload[] = [];
		const queries = window.location.search.split("&");
		let filters: any = queries.find(
			(item) => item.split("=")[0] === "filters"
		);

		if (!filters) return activeFilters;
		filters = filters.slice(8);
		console.log("Check before", filters);

		if (filters) {
			const filterItems = decodeURIComponent(filters as string)?.split(
				"&"
			);
			console.log(filterItems);
			if (!filterItems) return activeFilters;
			for (const filterItem of filterItems) {
				if (!filterItem) continue;
				const [key, val] = filterItem.split("=");
				if (val?.length) {
					const values = decodeURIComponent(val);
					activeFilters.push({
						id: key,
						values: values.split(","),
					});
				}
			}
		}
		console.log("checl", activeFilters.length);
		return activeFilters;
	};

	return {
		getFiltersFromQuery,
	};
}
