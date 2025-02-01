import AppAvatar from '@/components/common/AppAvatar';
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
import { ROLE } from '@/type/role';
import { UserResponse } from '@/type/users';

const ReactivateAccount = ({
  isOpen,
  data,
  setOpen,
  onReactivate,
}: {
  isOpen: boolean;
  data: UserResponse | null;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onReactivate: () => void;
}) => {
  if (!data) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reactivate Account</DialogTitle>
        </DialogHeader>
        <div className="grid gap-1">
          <span className="font-medium">User</span>
          <div className="gap-2 bg-gray-100 border border-zinc-400 rounded-lg p-2 flex items-center">
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
                <span className="text-green-600">@{data?.username}</span>
              </p>
              <RoleBadge
                role={data?.role.type as unknown as ROLE}
                style="badge-soft"
              />
            </div>
          </div>
        </div>
        <DialogFooter className="sm:justify-end">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
          <Button onClick={onReactivate}>Reactivate</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReactivateAccount;
