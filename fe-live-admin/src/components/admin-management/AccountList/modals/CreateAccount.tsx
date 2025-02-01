import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export interface _FormData {
  id: string;
  avatar: File | null;
  username: string;
  display_name: string;
  email: string;
  role: string;
  password: string;
  confirmPassword: string;
}

const CreateAccount = ({
  isOpen,
  data,
  setOpen,
  setFormData,
  onCreate,
  onInputChange,
}: {
  isOpen: boolean;
  data: _FormData;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setFormData: React.Dispatch<React.SetStateAction<_FormData>>;
  onCreate: () => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Account</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {data.avatar && (
            <div className="flex items-center justify-center">
              <img
                src={data.avatar ? URL.createObjectURL(data.avatar) : undefined}
                className="h-36 w-36 object-cover rounded-full"
              />
            </div>
          )}
          <div className="grid grid-cols-3 items-center gap-4">
            <Label htmlFor="avatar" className="text-right">
              Avatar
            </Label>
            <Input
              id="avatar"
              type="file"
              accept="image/*"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const file = e.target.files?.[0];
                if (file) {
                  setFormData({ ...data, avatar: file });
                }
              }}
              className="col-span-2"
            />
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Username
            </Label>
            <Input
              id="username"
              value={data.username}
              onChange={onInputChange}
              className="col-span-2"
            />
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <Label htmlFor="display_name" className="text-right">
              Display Name
            </Label>
            <Input
              id="display_name"
              value={data.display_name}
              onChange={onInputChange}
              className="col-span-2"
            />
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={data.email}
              onChange={onInputChange}
              className="col-span-2"
            />
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <Label htmlFor="role" className="text-right">
              Role
            </Label>
            <Select
              value={data.role}
              onValueChange={(value) => setFormData({ ...data, role: value })}
            >
              <SelectTrigger className="col-span-2">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="streamer">Streamer</SelectItem>
                <SelectItem value="user">User</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <Label htmlFor="password" className="text-right">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              value={data.password}
              onChange={onInputChange}
              className="col-span-2"
            />
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <Label htmlFor="confirmpassword" className="text-right">
              Confirm Password
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              value={data.confirmPassword}
              onChange={onInputChange}
              className="col-span-2"
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
          <Button onClick={onCreate} type="submit">
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateAccount;
