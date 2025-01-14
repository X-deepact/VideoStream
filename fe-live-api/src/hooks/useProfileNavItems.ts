import { useNavigate } from 'react-router-dom';
import { ProfileNavItem } from '@/data/types/ui/profileNavItem';
import { Lock, LogOut, Moon, Settings2, Shield, Tv } from 'lucide-react';
import { LOGOUT_PATH, SETTINGS_PATH } from '@/data/route';
import { invalidateAccount } from '@/data/model/userAccount';

export const useProfileNavItems = (): ProfileNavItem[][] => {
  const navigate = useNavigate();

  return [
    [
      {
        label: 'Channel',
        icon: Tv,
      },
      {
        label: 'Privacy Center',
        icon: Lock,
      },
      {
        label: 'Appeals Portal',
        icon: Shield,
      },
    ],
    [
      {
        label: 'Settings',
        icon: Settings2,
        action: () => {
          navigate(SETTINGS_PATH);
        },
      },
      {
        label: 'Mode',
        icon: Moon,
        id: 'theme',
      },
    ],
    [
      {
        label: 'Logout',
        icon: LogOut,
        action: () => {
          invalidateAccount();
          navigate(LOGOUT_PATH);
        },
      },
    ],
  ];
};
