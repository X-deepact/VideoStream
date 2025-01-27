import {
  apiFetchNotificationsCount,
  apiFetchNotificationsList,
  apiHideNotification,
  apiReadNotification,
  apiResetNotificationsCount,
} from '@/api/notification';
import {
  CommonFilters,
  FindAndCountResponse,
  SuccessResponse,
} from '@/data/api';
import {
  NotificationCountResponse,
  NotificationResponse,
} from '@/data/dto/notification';

export const fetchNotificationsCount =
  async (): Promise<NotificationCountResponse> => {
    const { data } = await apiFetchNotificationsCount();
    return data;
  };

export const resetNotificationsCount =
  async (): Promise<NotificationCountResponse> => {
    const { data } = await apiResetNotificationsCount();
    return data;
  };

export const fetchNotificationsList = async (
  payload: CommonFilters
): Promise<FindAndCountResponse<NotificationResponse>> => {
  const { data, error } = await apiFetchNotificationsList(payload);
  if (data && !error) return data;

  return [];
};

export const readNotification = async (
  id: number
): Promise<SuccessResponse> => {
  const { data } = await apiReadNotification(id);
  return {
    success: data && data!.success,
  };
};

export const hideNotification = async (
  id: number
): Promise<SuccessResponse> => {
  const { data } = await apiHideNotification(id);
  return {
    success: data && data!.success,
  };
};
