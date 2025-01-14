import { getFormattedDate } from '@/lib/date-time';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import AppAvatar from '../AppAvatar';

interface ComponentProps {
  isSelfSent?: boolean;
  avatarUrl: string;
  displayName: string;
  content: string;
  createdAt?: string;
}

const MessageItem = (props: ComponentProps) => {
  const { avatarUrl, displayName, content, createdAt } = props;

  return (
    <div className="p-0.5">
      <TooltipProvider>
        <Tooltip>
          <div className="flex gap-1 items-center">
            <AppAvatar url={avatarUrl} />
            <p className="text-justify">{displayName || 'Unknown'}</p>
          </div>
          <TooltipTrigger asChild>
            <p className="mt-1">{content}</p>
          </TooltipTrigger>
          {createdAt && (
            <TooltipContent className="bg-secondary">
              <p className="text-xs">
                {getFormattedDate(new Date(createdAt), true)}
              </p>
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default MessageItem;
