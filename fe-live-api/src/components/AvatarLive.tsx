import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { getAvatarFallbackText } from '@/lib/utils';

interface ComponentProps {
  isLive: boolean;
  avatarUrl: string;
  displayName: string;
}

const AvatarLive = (props: ComponentProps) => {
  const { isLive = false, avatarUrl, displayName } = props;

  return (
    <Avatar
      className={`w-10 h-10 cursor-pointer ${
        isLive ? 'border-red-700 border-2' : ''
      }`}
    >
      <AvatarImage src={avatarUrl} className="object-cover" />
      <AvatarFallback>{getAvatarFallbackText(displayName)}</AvatarFallback>
    </Avatar>
  );
};

export default AvatarLive;
