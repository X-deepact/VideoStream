import React from 'react';
import { CheckCheck } from 'lucide-react';
import { Button } from './ui/button';
import SpecialButton from './SpecialButton';
import { cn } from '@/lib/utils';

interface SubscribeButtonProps {
  isSubscribed: boolean;
  className?: string;
  onSubscribeUnsubscribe: () => void;
}

const SubscribeButton: React.FC<SubscribeButtonProps> = ({
  isSubscribed,
  className,
  onSubscribeUnsubscribe,
}) => {
  return (
    <div className={cn('relative inline-block', className)}>
      {!isSubscribed ? (
        <SpecialButton label='Subscribe' onClick={onSubscribeUnsubscribe} />
      ) : (
        <Button
          variant='secondary'
          onClick={onSubscribeUnsubscribe}
          className='px-4 py-2 text-sm rounded-full'
        >
          <div className='flex items-center justify-center gap-2'>
            <CheckCheck />
            Subscribed
          </div>
        </Button>
      )}
    </div>
  );
};

export default SubscribeButton;
