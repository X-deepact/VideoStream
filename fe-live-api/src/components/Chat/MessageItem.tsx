import { getFormattedDate } from '@/lib/date-time';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface ComponentProps {
  avatarUrl: string;
  username: string;
  content: string;
  createdAt: string;
}

const MessageItem = (props: ComponentProps) => {
  const { avatarUrl, username, content, createdAt } = props;

  return (
    <div className="p-0.5">
      <TooltipProvider>
        <Tooltip>
          <div className="flex gap-1">
            <Avatar className="w-5 h-5 cursor-pointer">
              <AvatarImage src={avatarUrl} />
              <AvatarFallback>PF</AvatarFallback>
            </Avatar>
            <p className="text-justify">{username}</p>
          </div>
          <TooltipTrigger asChild>
            <p className="mt-1">{content}</p>
          </TooltipTrigger>
          <TooltipContent className="bg-secondary">
            <p className="text-xs">
              {getFormattedDate(new Date(createdAt), true)}
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default MessageItem;
