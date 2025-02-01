import AppAvatar from '@/components/common/AppAvatar';
import InputRequiredSymbol from '@/components/common/InputRequiredSymbol';
import RoleBadge from '@/components/common/RoleBadge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ROLE } from '@/type/role';
import { UserResponse } from '@/type/users';

const BlockAccount = ({
  isOpen,
  reason,
  data,
  setOpen,
  setBlockingReason,
  onBlock,
}: {
  isOpen: boolean;
  reason: string;
  data: UserResponse | null;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setBlockingReason: React.Dispatch<React.SetStateAction<string>>;
  onBlock: () => void;
}) => {
  if (!data) return;

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Block Account</DialogTitle>
        </DialogHeader>
        <div className="grid gap-1">
          <span className="font-medium">User</span>
          <div className="bg-red-50/80 border border-red-400 rounded-lg p-2 flex gap-2 items-center">
            <AppAvatar
              url={data?.avatar_file_name}
              displayName={data?.display_name}
              status={data?.status}
              classes="w-9 h-9"
            />
            <div className="text-left">
              <p
                className="font-medium text-ellipsis"
                title={data?.display_name}
              >
                {data?.display_name}{' '}
                <span className="text-red-600">@{data?.username}</span>
              </p>
              <RoleBadge
                role={data?.role.type as unknown as ROLE}
                style="badge-soft"
              />
            </div>
          </div>
          <div className="gap-4 mt-3">
            <Label htmlFor="reason" className="text-right">
              Reason <InputRequiredSymbol />
            </Label>
            <Textarea
              rows={3}
              placeholder="Enter reason..."
              id="reason"
              required
              value={reason}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setBlockingReason(e.target.value)
              }
              className="col-span-2 resize-none"
            />
          </div>
        </div>
        <DialogFooter className="sm:justify-end">
          <DialogClose asChild>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setBlockingReason('')}
            >
              Close
            </Button>
          </DialogClose>
          <Button variant="destructive" onClick={onBlock}>
            Block
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BlockAccount;
