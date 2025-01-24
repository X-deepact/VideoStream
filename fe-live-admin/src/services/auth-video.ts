import axios from "axios";
import authHeader from "@/services/auth-header.ts";

export const fetchAuthVideo = async (
  url: string
): Promise<{
  success: boolean;
  result: string;
}> => {
  try {
    const response = await axios.get(url, {
      headers: authHeader(),
      responseType: "blob",
    });
    const blobURL = URL.createObjectURL(response.data);
    return {
      result: blobURL,
      success: true,
    };
  } catch (e) {
    if (e instanceof Error) {
      console.error(e.message);
    }
    return {
      result: "Unknown error",
      success: false,
    };
  }
};
