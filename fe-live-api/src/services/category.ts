import { apiFetchCategories } from '@/api/category';
import { CategoryResponse } from '@/data/dto/category';

export const fetchCategories = async (): Promise<CategoryResponse[]> => {
  const { data } = await apiFetchCategories();
  return data;
};
