import { useEffect, useState } from "react";
import { getAccountListWithRole } from "@/services/user.service.ts";
import { AccountProps } from "@/lib/interface.tsx";
import { toast } from "@/hooks/use-toast.ts";

interface Account {
  label: string;
  value: string;
}
export const useFetchAccount = (role: string) => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [refetchKey, setRefetchKey] = useState(0);
  useEffect(() => {
    const fetchAccount = async () => {
      try {
        const response = await getAccountListWithRole(role);
        const { data } = response.data;
        const transformData = data.page.map((account: AccountProps) => {
          return {
            label: account.username,
            value: String(account.id),
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
