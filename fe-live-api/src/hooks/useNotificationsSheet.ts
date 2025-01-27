import { useState } from 'react';

export const useNotificationSheet = () => {
  const [isOpen, setIsOpen] = useState(false);
  const openSheet = () => setIsOpen(true);
  const closeSheet = () => setIsOpen(false);

  return { isOpen, openSheet, closeSheet };
};
