import { useNavigate } from 'react-router-dom';
import { ProfileNavItem } from '@/data/types/ui/profileNavItem';
import { LogOut, Moon, Settings2, Tv } from 'lucide-react';
import {
  LOGOUT_PATH,
  RESOURCE_ID,
  SETTINGS_PATH,
  STREAMER_PROFILE_PATH,
} from '@/data/route';
import {
  getLoggedInUserInfo,
  invalidateAccount,
} from '@/data/model/userAccount';
import { USER_ROLE } from '@/data/types/role';

export const useProfileNavItems = (): ProfileNavItem[][] => {
  const navigate = useNavigate();
  const currentUser = getLoggedInUserInfo();

  return [
    [
      {
        label: 'Channel',
        icon: Tv,
        accessRoles: [USER_ROLE.STREAMER],
        action: () =>
          currentUser &&
          currentUser?.id &&
          navigate(STREAMER_PROFILE_PATH.replace(RESOURCE_ID, currentUser.id)),
      },
      // {
      //   label: 'Privacy Center',
      //   icon: Lock,
      // },
      // {
      //   label: 'Appeals Portal',
      //   icon: Shield,
      // },
    ],
    [
      {
        label: 'Settings',
        icon: Settings2,
        accessRoles: [],
        action: () => {
          navigate(SETTINGS_PATH);
        },
      },
      {
        label: 'Mode',
        icon: Moon,
        accessRoles: [],
        id: 'theme',
      },
    ],
    [
      {
        label: 'Logout',
        icon: LogOut,
        accessRoles: [],
        action: () => {
          invalidateAccount();
          navigate(LOGOUT_PATH);
        },
      },
    ],
  ];
};
