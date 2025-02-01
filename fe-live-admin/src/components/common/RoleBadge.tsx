import React from 'react';
import { cn } from '@/lib/utils';
import { ROLE } from '@/type/role';

interface RoleBadgeProps {
  role: ROLE;
  style?: 'text' | 'badge-soft' | 'badge';
}

const roleStyles: Record<ROLE, string> = {
  [ROLE.ADMIN]: 'text-blue-500',
  [ROLE.SUPERADMIN]: 'text-red-500',
  [ROLE.USER]: 'text-blue-500',
  [ROLE.STREAMER]: 'text-purple-500',
};

const badgeStyles: Record<ROLE, string> = {
  [ROLE.ADMIN]: 'bg-blue-500 text-white',
  [ROLE.SUPERADMIN]: 'bg-red-500 text-white',
  [ROLE.USER]: 'bg-green-500 text-white',
  [ROLE.STREAMER]: 'bg-purple-500 text-white',
};

const badgeSoftStyles: Record<ROLE, string> = {
  [ROLE.ADMIN]: 'bg-blue-100 text-blue-800',
  [ROLE.SUPERADMIN]: 'bg-red-100 text-red-800',
  [ROLE.USER]: 'bg-green-100 text-green-800',
  [ROLE.STREAMER]: 'bg-purple-100 text-purple-800',
};

const RoleBadge: React.FC<RoleBadgeProps> = ({ role, style = 'badge' }) => {
  if (style === 'text') {
    return (
      <span
        className={cn('text-xs font-semibold capitalize', roleStyles[role])}
      >
        {role?.toString()}
      </span>
    );
  }

  if (style === 'badge-soft')
    return (
      <span
        className={cn(
          'px-1.5 py-0.5 text-xs font-medium rounded-full capitalize',
          badgeSoftStyles[role]
        )}
      >
        {role?.toString()}
      </span>
    );

  return (
    <span
      className={cn(
        'px-1.5 py-0.5 text-xs font-medium rounded-full capitalize',
        badgeStyles[role]
      )}
    >
      {role?.toString()}
    </span>
  );
};

export default RoleBadge;
