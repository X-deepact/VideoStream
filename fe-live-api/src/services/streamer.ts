import { apiFetchStreamerDetails } from '@/api/streamer';
import { StreamerDetailsResponse } from '@/data/dto/streamer';

export const fetchStreamerDetails = async (
  id: string
): Promise<StreamerDetailsResponse | null> => {
  const { data } = await apiFetchStreamerDetails(id);
  return data;
};
