import { useEffect, useState } from "react";
import { getLivestreamSessionList } from "@/services/livestream-session.service.ts";
import { toast } from "@/hooks/use-toast.ts";
import { LivestreamSession } from "@/lib/interface.tsx";

interface Props {
  currentPage: number;
  streamType: string;
  status: string[];
  title: string;
}

export const useStreamingSessions = (props: Props) => {
  const { streamType, status, title, currentPage = 1 } = props;

  const [isLoading, setIsLoading] = useState(false);
  const [sessions, setSessions] = useState<LivestreamSession[]>([]);
  const [quantities, setQuantities] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [refetchkey, setRefetchkey] = useState(0);

  useEffect(() => {
    const fetchSessionList = async () => {
      if (isLoading) {
        return;
      }
      setIsLoading(true);
      try {
        const options = [];
        if (streamType) options.push(`catalog=${streamType}`);
        if (status) status.map((s) => options.push(`status=${s}`));
        if (title) options.push(`keyword=${title}`);
        const response = await getLivestreamSessionList(currentPage, options);
        const { data } = response.data;

        setSessions(data.page ?? []);
        setQuantities(data.page?.length ?? 0);
        setTotalPages(
          data.total_items ? Math.ceil(data.total_items / data.page_size) : 0
        );
        setTotalItems(data.total_items ?? 0);
      } catch (e: any) {
        toast({
          description: e.message,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSessionList();
  }, [refetchkey, currentPage, streamType, status, title]);

  const refetchSessionList = () => {
    setRefetchkey((prevKey) => prevKey + 1);
  };

  return {
    sessions,
    quantities,
    totalItems,
    totalPages,
    refetchSessionList,
    setSessions,
  };
};
