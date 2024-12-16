import React from 'react';
import { Button } from '@/components/ui/button';
import {
  CommandDialog,
  CommandEmpty,
  CommandInput,
  CommandList,
} from '@/components/ui/command';
import { type DialogProps } from '@radix-ui/react-dialog';
import { DialogTitle } from '@/components/ui/dialog';
import { Search } from 'lucide-react';

export function SearchBox({ ...props }: DialogProps) {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Button
        className="hover:bg-secondary"
        variant="secondary"
        size="sm"
        onClick={() => setOpen(true)}
        {...props}
      >
        <Search /> Search...
      </Button>
      <CommandDialog
        open={open}
        onOpenChange={(isOpen) => {
          setOpen(isOpen);
        }}
      >
        <DialogTitle></DialogTitle>
        <CommandInput placeholder="Search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {/* Trending Search/Content can be here */}
        </CommandList>
      </CommandDialog>
    </>
  );
}
