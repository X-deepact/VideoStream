import { useEffect, useState } from "react";
import { toast } from "@/hooks/use-toast.ts";
import { getUsernames } from "@/services/user.service";

interface Account {
  label: string;
  value: string;
}
export const useAccounts = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [refetchKey, setRefetchKey] = useState(0);
  useEffect(() => {
    const fetchAccount = async () => {
      try {
        const response = await getUsernames();
        const { data } = response.data;
        const transformData = data.map((account: any) => {
          return {
            label: account,
            value: account,
          };
        });
        setAccounts(transformData);
      } catch (e: any) {
        toast({
          description: e.message,
          variant: "destructive",
        });
      }
    };

    fetchAccount();
  }, [refetchKey]);
  const refetchAccounts = () => {
    setRefetchKey((prevKey) => prevKey + 1);
  };

  return {
    accounts,
    refetchAccounts,
  };
};
