import { SORT_ORDER } from "@/lib/validation.ts";

export interface GeneralColumnsProps {
	sort: {
		setSortBy: (field: string) => void;
		setSortOrder: (order: SORT_ORDER) => void;
		sortBy: string;
		sortOrder: SORT_ORDER;
	};
}
