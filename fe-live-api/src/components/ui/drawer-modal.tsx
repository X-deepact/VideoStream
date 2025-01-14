'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';

interface BaseProps {
  children: React.ReactNode;
}

interface RootDrawerModalProps extends BaseProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

interface DrawerModalProps extends BaseProps {
  className?: string;
  asChild?: true;
}

const desktop = '(min-width: 768px)';

const DrawerModal = ({ children, ...props }: RootDrawerModalProps) => {
  const isDesktop = useMediaQuery(desktop);
  const DrawerModal = isDesktop ? Dialog : Drawer;

  return <DrawerModal {...props}>{children}</DrawerModal>;
};

const DrawerModalTrigger = ({
  className,
  children,
  ...props
}: DrawerModalProps) => {
  const isDesktop = useMediaQuery(desktop);
  const DrawerModalTrigger = isDesktop ? DialogTrigger : DrawerTrigger;

  return (
    <DrawerModalTrigger className={className} {...props}>
      {children}
    </DrawerModalTrigger>
  );
};

const DrawerModalClose = ({
  className,
  children,
  ...props
}: DrawerModalProps) => {
  const isDesktop = useMediaQuery(desktop);
  const DrawerModalClose = isDesktop ? DialogClose : DrawerClose;

  return (
    <DrawerModalClose className={className} {...props}>
      {children}
    </DrawerModalClose>
  );
};

const DrawerModalContent = ({
  className,
  children,
  ...props
}: DrawerModalProps) => {
  const isDesktop = useMediaQuery(desktop);
  const DrawerModalContent = isDesktop ? DialogContent : DrawerContent;

  return (
    <DrawerModalContent className={className} {...props}>
      {children}
    </DrawerModalContent>
  );
};

const DrawerModalDescription = ({
  className,
  children,
  ...props
}: DrawerModalProps) => {
  const isDesktop = useMediaQuery(desktop);
  const DrawerModalDescription = isDesktop
    ? DialogDescription
    : DrawerDescription;

  return (
    <DrawerModalDescription className={className} {...props}>
      {children}
    </DrawerModalDescription>
  );
};

const DrawerModalHeader = ({
  className,
  children,
  ...props
}: DrawerModalProps) => {
  const isDesktop = useMediaQuery(desktop);
  const DrawerModalHeader = isDesktop ? DialogHeader : DrawerHeader;

  return (
    <DrawerModalHeader className={className} {...props}>
      {children}
    </DrawerModalHeader>
  );
};

const DrawerModalTitle = ({
  className,
  children,
  ...props
}: DrawerModalProps) => {
  const isDesktop = useMediaQuery(desktop);
  const DrawerModalTitle = isDesktop ? DialogTitle : DrawerTitle;

  return (
    <DrawerModalTitle className={className} {...props}>
      {children}
    </DrawerModalTitle>
  );
};

const DrawerModalBody = ({
  className,
  children,
  ...props
}: DrawerModalProps) => {
  return (
    <div className={cn('px-4 md:px-0', className)} {...props}>
      {children}
    </div>
  );
};

const DrawerModalFooter = ({
  className,
  children,
  ...props
}: DrawerModalProps) => {
  const isDesktop = useMediaQuery(desktop);
  const DrawerModalFooter = isDesktop ? DialogFooter : DrawerFooter;

  return (
    <DrawerModalFooter className={className} {...props}>
      {children}
    </DrawerModalFooter>
  );
};

export {
  DrawerModal,
  DrawerModalTrigger,
  DrawerModalClose,
  DrawerModalContent,
  DrawerModalDescription,
  DrawerModalHeader,
  DrawerModalTitle,
  DrawerModalBody,
  DrawerModalFooter,
};
