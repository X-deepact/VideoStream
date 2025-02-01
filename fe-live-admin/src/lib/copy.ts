import { toast } from "@/hooks/use-toast.ts";

const copyToClipBoard = (text: string) => {
  if (navigator.clipboard) {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast({
          description: "URL successfully copied to clipboard!",
        });
      })
      .catch((error: any) => {
        toast({
          description: error.message,
          variant: "destructive",
        });
      });
  }
};

export default copyToClipBoard;
