import { cn, getAvatarFallbackText } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from './../ui/avatar';
import { USER_STATUS } from '@/type/users';
import { X } from 'lucide-react';

interface ComponentProps {
  url: string;
  displayName: string;
  classes?: string;
  fallback?: string;
  status?: USER_STATUS;
}

const AppAvatar = ({
  url,
  displayName,
  classes,
  fallback,
  status,
}: ComponentProps) => {
  const statusColors = {
    online: 'bg-green-500',
    offline: 'bg-gray-400',
    blocked: 'bg-red-500',
  };

  return (
    <div className="relative inline-block">
      <Avatar className={cn('w-8 h-8 border border-gray-400', classes)}>
        <AvatarImage src={url} alt={fallback} className="object-cover" />
        <AvatarFallback className="text-sm">
          {fallback || getAvatarFallbackText(displayName)}
        </AvatarFallback>
      </Avatar>
      {status && (
        <span
          className={cn(
            'absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white flex items-center justify-center text-xs text-gray-200',
            statusColors[status]
          )}
          title={status}
        >
          {status === 'blocked' && <X className="text-white" />}
        </span>
      )}
    </div>
  );
};

export default AppAvatar;
