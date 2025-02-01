import { useEffect, useState } from "react";
import axios from "axios";
import authHeader from "@/services/auth-header";
import loadingImg from "@/assets/loading.svg";
import { useToast } from "@/hooks/use-toast";

interface ComponentProps {
  className?: string;
  url: string;
}

const ImageWithAuth = (props: ComponentProps) => {
  const { toast } = useToast();
  const { url, className } = props;
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const fetchImage = async () => {
    try {
      const response = await axios.get(`${url}`, {
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
    <div>
      {imageSrc ? (
        <img className={`${className}`} src={imageSrc} />
      ) : (
        <img src={loadingImg} />
      )}
    </div>
  );
};

export default ImageWithAuth;
