import AppAvatar from '@/components/AppAvatar';
import { Button } from '@/components/ui/button';
import { CheckCheck } from 'lucide-react';
import { formatKMBCount } from '@/lib/utils';

interface ComponentProps {
  avatarUrl: string;
  displayName: string;
  subscriptionsCount: number;
  videosCount: number;
  onSubUnsub: () => void;
}

const SubscriptionItem = ({
  avatarUrl,
  displayName,
  subscriptionsCount,
  videosCount,
  onSubUnsub,
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
      <Button
        onClick={onSubUnsub}
        size="sm"
        variant="secondary"
        className="px-4 py-3 text-sm rounded-full"
      >
        <CheckCheck />
        Subscribed
      </Button>
    </div>
  );
};

export default SubscriptionItem;
