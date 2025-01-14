import { memo, useEffect } from 'react';
import { Info } from 'lucide-react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export interface ConfirmationModalProps {
  isDanger?: boolean;
  isOpen: boolean;
  title: string;
  description: string | JSX.Element;
  cancelBtnText?: string;
  proceedBtnText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationModal = (props: ConfirmationModalProps): JSX.Element => {
  const {
    isDanger = false,
    isOpen,
    title,
    description,
    cancelBtnText = 'Cancel',
    proceedBtnText = 'Confirm',
    onConfirm,
    onCancel,
  } = props;

  const handleCancel = () => {
    onCancel();
    document.body.style.pointerEvents = 'auto';
  };

  const handleConfirm = () => {
    onConfirm();
    document.body.style.pointerEvents = 'auto';
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.pointerEvents = 'auto';
    }

    return () => {
      document.body.style.pointerEvents = 'auto';
    };
  }, [isOpen]);

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            <div
              className={`flex gap-3 items-center ${
                isDanger && 'text-red-500'
              }`}
            >
              <Info />
              {title}
            </div>
          </AlertDialogTitle>
          <AlertDialogDescription className="text-left leading-5 tracking-normal">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel}>
            {cancelBtnText}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className={`${isDanger && 'bg-red-500 hover:bg-red-400'}`}
          >
            {proceedBtnText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

const ConfirmModal = memo(ConfirmationModal);
export { ConfirmModal };
