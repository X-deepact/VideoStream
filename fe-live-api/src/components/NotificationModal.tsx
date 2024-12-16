import { memo } from 'react';
import { CheckCheck, CircleX } from 'lucide-react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { NotifyModalType } from './UITypes';

export interface NotificationModalProps {
  isImage?: boolean;
  type?: NotifyModalType;
  isOpen: boolean;
  title: string;
  description: string | JSX.Element;
  onOpen?: (isOpen: boolean) => void;
  onClose?: () => void;
}

const NotificationModal = (props: NotificationModalProps): JSX.Element => {
  const {
    type = 'success',
    isImage = false,
    isOpen,
    title,
    description,
    onOpen,
    onClose,
  } = props;

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle
            className={`${type === NotifyModalType.ERROR && 'text-red-500'} ${
              type === NotifyModalType.SUCCESS && 'text-primary'
            }`}
          >
            <div className={`flex gap-3 items-center `}>
              {type === NotifyModalType.SUCCESS && <CheckCheck />}
              {type === NotifyModalType.ERROR && <CircleX />}
              {title}
            </div>
          </AlertDialogTitle>
          {!isImage ? (
            <AlertDialogDescription className="text-justify leading-5 tracking-normal">
              {description}
            </AlertDialogDescription>
          ) : (
            <AlertDialogDescription>
              <img
                src={description as string}
                alt={title}
                className="overflow-hidden rounded-md h-auto object-contain border border-slate-200"
              />
            </AlertDialogDescription>
          )}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={onClose}>Okay</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

const NotifyModal = memo(NotificationModal);
export { NotifyModal };
