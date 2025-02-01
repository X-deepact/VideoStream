import AppAvatar from '@/components/AppAvatar';
import { BellOff, BellRing } from 'lucide-react';
import { KMBformatter } from '@/lib/utils';
import AppButton from '@/components/AppButton';
import SubscribeButton from '@/components/SubscribeButton';

interface ComponentProps {
  avatarUrl: string;
  displayName: string;
  subscriptionsCount: number;
  videosCount: number;
  isNotiMute: boolean;
  onSubUnsub: () => void;
  onToggleMuteNotifications: () => void;
  onNavigateChannel: () => void;
}

const SubscriptionItem = ({
  avatarUrl,
  displayName,
  subscriptionsCount,
  videosCount,
  isNotiMute,
  onSubUnsub,
  onToggleMuteNotifications,
  onNavigateChannel,
}: ComponentProps) => {
  return (
    <div className='flex justify-between items-center gap-x-6 gap-y-4 py-4 border-b'>
      <div className='flex items-center gap-4'>
        <div onClick={onNavigateChannel}>
          <AppAvatar
            url={avatarUrl}
            classes='w-20 h-20 rounded-full border border-gray-200'
          />
        </div>
        <div>
          <p
            onClick={onNavigateChannel}
            className='font-semibold cursor-pointer text-md'
          >
            {displayName}
          </p>
          <p className='text-sm font-medium text-gray-500'>
            {KMBformatter(subscriptionsCount)} subscriber
            {subscriptionsCount > 1 ? 's' : ''}
          </p>
          <p className='text-sm font-medium text-gray-500'>
            {videosCount} video{videosCount > 1 ? 's' : ''}
          </p>
        </div>
      </div>
      <div className='flex gap-2'>
        <SubscribeButton isSubscribed onSubscribeUnsubscribe={onSubUnsub} />
        <AppButton
          className='rounded-full'
          Icon={isNotiMute ? BellOff : BellRing}
          isIconActive={false}
          label={isNotiMute ? 'Unmute Notification' : 'Mute Notification'}
          tooltipOnSmallScreens
          size='icon'
          variant='secondary'
          onClick={onToggleMuteNotifications}
        />
      </div>
    </div>
  );
};

export default SubscriptionItem;
