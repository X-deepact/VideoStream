import { useEffect, useState } from "react";
import { toast } from "@/hooks/use-toast.ts";
import { getlogActions } from "@/services/user.service";
interface Action {
  label: string;
  value: string;
}
export const useActions = () => {
  const [actions, setActions] = useState<Action[]>([]);
  const [refetchKey, setRefetchKey] = useState(0);
  useEffect(() => {
    const fetchAction = async () => {
      try {
        const response = await getlogActions();
        const { data } = response.data;
        const transformData = data.map((action: any) => {
          return {
            label: action,
            value: action,
          };
        });
        setActions(transformData);
      } catch (e: any) {
        toast({
          description: e.message,
          variant: "destructive",
        });
      }
    };

    fetchAction();
  }, [refetchKey]);
  const refetchActions = () => {
    setRefetchKey((prevKey) => prevKey + 1);
  };

  return {
    actions,
    refetchActions,
  };
};
