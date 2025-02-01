import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface _FormData {
  id: string;
  name: string;
}

const CreateCategory = ({
  isOpen,
  data,
  setOpen,
  onCreate,
  onInputChange,
}: {
  isOpen: boolean;
  data: _FormData;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onCreate: () => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Category</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-3 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={data.name}
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

export default CreateCategory;
