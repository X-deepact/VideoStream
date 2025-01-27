import useNotificationsList from '@/hooks/useNotificationsList';
import { getTimeAgoFormat } from '@/lib/date-time';
import { memo, useState } from 'react';
import NotFoundCentered from '../NotFoundCentered';
import { BellOff, BellRing, EllipsisVertical, EyeOff, X } from 'lucide-react';
import AuthImage from '../AuthImage';
import AppAvatar from '../AppAvatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Button } from '../ui/button';
import { hideNotification, readNotification } from '@/services/notification';
import {
  NOTIFICATION_TYPE,
  NotificationResponse,
} from '@/data/dto/notification';
import { useNavigate } from 'react-router-dom';
import { getFEUrl, WATCH_LIVE_PATH, WATCH_VIDEO_PATH } from '@/data/route';
import EndOfResults from '../EndOfResults';
import InlineLoading from '../InlineLoading';
import ApiFetchingError from '../ApiFetchingError';
import AppButton from '../AppButton';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { toggleMuteNotificationsFromChannel } from '@/services/subscription';

const NotificationContent = ({ closeSheet }: { closeSheet: () => void }) => {
  const navigate = useNavigate();

  const [inProgressNotifications, setInProgressNotifications] = useState<
    Set<number>
  >(new Set());

  const {
    data,
    isLoading,
    error: isFetchingError,
    totalItems,
    refetchData,
    fetchNextPage,
    setData,
  } = useNotificationsList();

  const handleNotificationClick = (noti: NotificationResponse) => {
    setInProgressNotifications((prev) => new Set(prev).add(noti.id));

    const handleNavigation = async () => {
      try {
        switch (noti.type) {
          case NOTIFICATION_TYPE.SUBSCRIBE_LIVE:
            navigate(getFEUrl(WATCH_LIVE_PATH, noti.stream_id.toString()));
            break;
          case NOTIFICATION_TYPE.SUBSCRIBE_VIDEO:
            navigate(getFEUrl(WATCH_VIDEO_PATH, noti.stream_id.toString()));
            break;
          default:
            break;
        }

        if (!noti.is_read) {
          await readNotification(noti.id);
        }
      } finally {
        setInProgressNotifications((prev) => {
          const newSet = new Set(prev);
          newSet.delete(noti.id);
          return newSet;
        });
      }
    };

    handleNavigation();
  };

  const handleHideNotification = async (noti: NotificationResponse) => {
    const oldData = [...data];

    setData((prev) => prev.filter((p) => p.id !== noti.id));

    try {
      const isSuccess = await hideNotification(noti.id);

      if (isSuccess?.success) {
        toast.success('Notification hidden!');
      } else {
        setData(oldData);
        toast.error('Failed to hide notification.');
      }
    } catch {
      setData(oldData);
      toast.error('An error occurred while hiding the notification.');
    }
  };

  const handleMuteNotificationsFromChannel = async (
    noti: NotificationResponse
  ) => {
    const oldData = [...data];
    const newData = !noti.is_mute;
    setData((prev) =>
      prev.map((item) =>
        item.id === noti.id ? { ...item, is_mute: newData } : item
      )
    );
    try {
      if (
        (noti.type === NOTIFICATION_TYPE.SUBSCRIBE_LIVE ||
          noti.type === NOTIFICATION_TYPE.SUBSCRIBE_VIDEO) &&
        noti?.streamer_id
      ) {
        const isSuccess = await toggleMuteNotificationsFromChannel({
          isMute: newData,
          streamerId: Number(noti?.streamer_id),
        });

        if (isSuccess?.success) {
          const action = newData ? 'muted' : 'turned on';
          toast.success(`Notification ${action}!`);
        } else {
          setData(oldData);
          toast.error(
            `Failed to ${newData ? 'mute' : 'turn on'} the notification.`
          );
        }
      }
    } catch {
      setData(oldData);
      toast.error(
        `An error occurred while ${
          newData ? 'muting' : 'unmuting'
        } the notification.`
      );
    }
  };

  return (
    <div className="pb-4 w-full">
      <div className="sticky top-0 w-full bg-white dark:bg-black z-10 border-b">
        <div className="flex justify-between items-center py-2 px-4">
          <h2 className="text-xl font-semibold">Notifications</h2>
          <AppButton
            Icon={X}
            size="icon"
            label="Close"
            variant="ghost"
            className="z-10"
            tooltipOnSmallScreens
            onClick={closeSheet}
          />
        </div>
      </div>

      {data?.length > 0 && (
        <ul className="space-y-2">
          {!isLoading &&
            data.map((notification) => (
              <div
                key={notification.id}
                className={cn(
                  inProgressNotifications.has(notification.id)
                    ? 'opacity-50'
                    : ''
                )}
              >
                <div onClick={() => closeSheet()}>
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onMarkAsRead={handleNotificationClick}
                    onHide={handleHideNotification}
                    onMuteAll={handleMuteNotificationsFromChannel}
                  />
                </div>
              </div>
            ))}
        </ul>
      )}

      {/* Load More Button */}
      {data.length < totalItems && (
        <div className="mt-4 flex justify-center">
          <Button
            variant="link"
            className="p-0"
            onClick={fetchNextPage}
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'Load more'}
          </Button>
        </div>
      )}

      {!isLoading && data?.length === totalItems && data?.length !== 0 && (
        <EndOfResults />
      )}

      {!isFetchingError && isLoading && <InlineLoading />}

      {!isFetchingError && !isLoading && data?.length === 0 && (
        <NotFoundCentered
          title="No notifications yet."
          Icon={<BellOff className="text-white" />}
        />
      )}

      {isFetchingError && (
        <ApiFetchingError
          label="Sorry, can't fetch notifications right now!"
          isLoading={isLoading}
          onRefetch={refetchData}
        />
      )}
    </div>
  );
};

export default NotificationContent;

export const NotificationItem = memo(
  ({
    notification,
    onMarkAsRead,
    onHide,
    onMuteAll,
    className,
  }: {
    notification: NotificationResponse;
    className?: string;
    onMarkAsRead: (noti: NotificationResponse) => void;
    onHide?: (noti: NotificationResponse) => void;
    onMuteAll?: (noti: NotificationResponse) => void;
  }) => {
    return (
      <li
        className={cn(
          'flex items-start hover:bg-muted cursor-pointer gap-2 p-3 h-[110px]',
          className
        )}
      >
        <div className="flex flex-col items-center justify-center gap-5">
          <AppAvatar
            url={notification.avatar_url}
            classes="w-9 h-9 rounded-full"
          />
          {!notification.is_read && (
            <span className="w-2 h-2 bg-red-500 rounded-full"></span>
          )}
        </div>
        <div className="ml-2 flex-1" onClick={() => onMarkAsRead(notification)}>
          <p className="font-medium line-clamp-2">
            {notification.id} - {notification.content}
          </p>
          <p className="text-xs text-muted-foreground mt-3">
            {getTimeAgoFormat(notification.created_at)}
          </p>
        </div>
        {notification.thumbnail_url && (
          <div onClick={() => onMarkAsRead(notification)}>
            <AuthImage
              src={notification.thumbnail_url}
              alt="Thumbnail"
              className="w-32 h-20 object-cover rounded-lg ml-3"
            />
          </div>
        )}
        {onHide && onMuteAll && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="h-8 w-8 p-0" variant="ghost">
                <EllipsisVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => onHide(notification)}
                className="cursor-pointer"
              >
                <EyeOff /> Hide this notification
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onMuteAll(notification)}
                className="cursor-pointer"
              >
                {notification.is_mute ? (
                  <>
                    <BellRing /> Turn on notifications from this channel
                  </>
                ) : (
                  <>
                    <BellOff /> Turn off all from this channel
                  </>
                )}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </li>
    );
  }
);
