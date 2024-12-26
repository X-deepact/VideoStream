import { useEffect, useState } from "react";
import axios from "axios";
import authHeader from "@/services/auth-header";
import loadingImg from "@/assets/loading.svg";
import { useToast } from "@/hooks/use-toast";

const API_URL = import.meta.env.VITE_API_BASE_URL;

const ImageWithAuth = (param: any) => {
  const { toast } = useToast();
  const { url } = param;
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const fetchImage = async () => {
    try {
      const response = await axios.get(`${API_URL}${url}`, {
        headers: authHeader(),
        responseType: "blob",
      });
      const blob = response.data;
      setImageSrc(URL.createObjectURL(blob));
    } catch (error) {
      toast({
        description: "The image could not be loaded.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchImage();
  }, []);

  return (
    <div>{imageSrc ? <img src={imageSrc} /> : <img src={loadingImg} />}</div>
  );
};

export default ImageWithAuth;
