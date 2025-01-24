import AppAvatar from '@/components/AppAvatar';
import { Button } from '@/components/ui/button';
import { BellOff, BellRing, CheckCheck } from 'lucide-react';
import { formatKMBCount } from '@/lib/utils';
import AppButton from '@/components/AppButton';

interface ComponentProps {
  avatarUrl: string;
  displayName: string;
  subscriptionsCount: number;
  videosCount: number;
  isNotiMute: boolean;
  onSubUnsub: () => void;
  onToggleMuteNotifications: () => void;
}

const SubscriptionItem = ({
  avatarUrl,
  displayName,
  subscriptionsCount,
  videosCount,
  isNotiMute,
  onSubUnsub,
  onToggleMuteNotifications,
}: ComponentProps) => {
  return (
    <div className="flex justify-between items-center gap-x-6 gap-y-4 py-4 border-b">
      <div className="flex items-center gap-4">
        <AppAvatar
          url={avatarUrl}
          classes="w-20 h-20 rounded-full border border-gray-200"
        />
        <div>
          <p className="font-semibold text-md">{displayName}</p>
          <p className="text-sm font-medium text-gray-500">
            {formatKMBCount(subscriptionsCount)} subscriber
            {subscriptionsCount > 1 ? 's' : ''}
          </p>
          <p className="text-sm font-medium text-gray-500">
            {videosCount} video{videosCount > 1 ? 's' : ''}
          </p>
        </div>
      </div>
      <div className="flex gap-2">
        <Button
          onClick={onSubUnsub}
          size="sm"
          variant="secondary"
          className="px-4 py-3 text-sm rounded-full"
        >
          <CheckCheck />
          Subscribed
        </Button>
        <AppButton
          className="rounded-full"
          Icon={isNotiMute ? BellOff : BellRing}
          isIconActive={false}
          label={isNotiMute ? 'Unmute Notification' : 'Mute Notification'}
          tooltipOnSmallScreens
          size="icon"
          variant="secondary"
          onClick={onToggleMuteNotifications}
        />
      </div>
    </div>
  );
};

export default SubscriptionItem;
