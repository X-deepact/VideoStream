import useUserAccount from '@/hooks/useUserAccount';
import DefaultPf from '@/assets/images/pf.png';
import AppAvatar from './AppAvatar';

const StreamerAvatar = () => {
  const currentUser = useUserAccount();

  return (
    <div className="flex gap-2">
      <AppAvatar url={currentUser?.avatar_file_name || DefaultPf} />
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
