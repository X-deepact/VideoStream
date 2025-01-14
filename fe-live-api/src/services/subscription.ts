import { apiFetchSubscriptionList } from '@/api/subscription';
import { FindAndCountResponse } from '@/data/api';
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
