import axios from "axios";
import authHeader from "@/services/auth-header.ts";
import { toast } from "@/hooks/use-toast";
import { TOAST_STYLES } from "@/components/ui/toast";
import { _FormData } from "@/components/livestream-management/CategoryList/Modals/CreateCategory";

const API_URL = import.meta.env.VITE_API_BASE_URL + "/api/categories";

export const getCategories = async (
  page: number,
  limit: number,
  name: string,
  created_by: string,
  sort_by: string,
  sort: string
) => {
  return await axios.get(
    `${API_URL}?page=${page}&limit=${limit}&name=${name}&created_by=${created_by}&sort=${sort}&sort_by=${sort_by}`,
    { headers: authHeader() }
  );
};

export const createCategory = async (formdata: _FormData) => {
  return await axios.post(
    `${API_URL}`,
    { name: formdata.name },
    { headers: authHeader() }
  );
};

export const updateCategory = async (formdata: _FormData) => {
  if (formdata.id.length === 0) {
    toast({
      description: "Failed to update category",
      className: TOAST_STYLES.ERROR,
    });
    return;
  }
  return await axios.put(
    `${API_URL}/${formdata.id}`,
    { name: formdata.name },
    { headers: authHeader() }
  );
};

export const deleteCategory = async (formdata: _FormData) => {
  if (formdata.id.length === 0) {
    toast({
      description: "Failed to delete category",
      className: TOAST_STYLES.ERROR,
    });
    return;
  }
  return await axios.delete(`${API_URL}/${formdata.id}`, {
    headers: authHeader(),
  });
};
