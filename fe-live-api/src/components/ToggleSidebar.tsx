import { useSidebar } from './CustomSidebar';

const ToggleSidebar = ({ _isOpen }: { _isOpen: false }) => {
  const { setOpen } = useSidebar();
  setOpen(_isOpen);

  return null;
};

export default ToggleSidebar;
