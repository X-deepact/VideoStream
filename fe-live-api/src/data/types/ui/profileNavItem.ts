import { LucideIcon } from 'lucide-react';

export type ProfileNavItem = {
  label: string;
  icon: LucideIcon;
  id?: string;
  action?: () => void;
};
