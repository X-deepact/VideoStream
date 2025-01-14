import { useEffect, useState } from "react";
import { getCategories } from "@/services/category.service.ts";
import { Catalogue } from "@/lib/interface.tsx";
import { toast } from "@/hooks/use-toast.ts";

interface Category {
	label: string,
	value: string,
}
export const useCategories = () => {
	const [categories, setCategories] = useState<Category[]>([]);
	const [refetchKey, setRefetchKey] = useState(0);
	useEffect(() => {
		const fetchCategories = async () => {
			try {
				const response = await getCategories();
				const {data} = response.data;
				const transformData = data.map((category: Catalogue) => {
					return {
						label: category.name,
						value: String(category.id)
					}
				});

				setCategories(transformData);
			} catch (e) {
				toast({
					description: e.message,
					variant: "destructive"
				})
			}
		}

		fetchCategories();
	}, [refetchKey]);

	const refetchCategories = () => {
		setRefetchKey((prevKey) => prevKey + 1);
	};

	return {
		categories,
		refetchCategories
	}
};