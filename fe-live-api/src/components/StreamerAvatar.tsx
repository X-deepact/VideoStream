import useUserAccount from '@/hooks/useUserAccount';
import AppAvatar from './AppAvatar';
import { getAvatarFallbackText } from '@/lib/utils';

const StreamerAvatar = () => {
  const currentUser = useUserAccount();

  return (
    <div className="flex gap-2">
      <AppAvatar
        url={currentUser?.avatar_file_name || ''}
        fallback={getAvatarFallbackText(currentUser?.display_name || 'PF')}
      />
      <div>
        <h4>{currentUser.display_name || 'Unknown'}</h4>
        <p className="text-muted-foreground text-sm">
          @{currentUser?.username}
        </p>
      </div>
    </div>
  );
};

export default StreamerAvatar;
