import {
  apiFetchSubscriptionList,
  apiToggleMuteNotificationsFromChannel,
} from '@/api/subscription';
import { FindAndCountResponse, SuccessResponse } from '@/data/api';
import {
  SubscriptionListRequest,
  SubscriptionResponse,
} from '@/data/dto/subscription';

export const fetchSubscriptionList = async (
  payload: SubscriptionListRequest
): Promise<FindAndCountResponse<SubscriptionResponse>> => {
  const { data, error } = await apiFetchSubscriptionList(payload);
  if (data && !error) return data;

  return [];
};

export const toggleMuteNotificationsFromChannel = async ({
  isMute,
  streamerId,
}: {
  isMute: boolean;
  streamerId: number;
}): Promise<SuccessResponse> => {
  const { data } = await apiToggleMuteNotificationsFromChannel(
    isMute,
    streamerId
  );
  return {
    success: data && data!.success,
  };
};
