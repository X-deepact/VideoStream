import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CircleStop } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { endLivestreamSession } from "@/services/livestream-session.service";

interface EndLiveDialogProps {
  livestreamId: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const EndLiveDialog = ({
  livestreamId,
  isOpen,
  onOpenChange,
  onSuccess,
}: EndLiveDialogProps) => {
  const handleEndLive = async () => {
    try {
      const response = await endLivestreamSession(livestreamId);

      if (response.status === 200) {
        onSuccess();
        toast({
          description: "Stream ended successfully",
          className: "bg-toast-success text-white border-toast-success-border",
        });
      } else if (response.status === 202) {
        toast({
          description: "Stream is already being ended, please wait",
          className: "bg-toast-success text-white border-toast-success-border",
        });
      }
    } catch (error) {
      toast({
        description: "Failed to end stream. Please try again!",
        className: "bg-toast-error text-white border-toast-error-border",
      });
    } finally {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="destructive">
          <CircleStop /> End Live
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-md">
        <DialogHeader>
          <DialogTitle className="text-red-500">
            End Live Stream: Are You Sure?
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Ending this live stream will immediately stop the broadcast. The
            viewer count and live status will reset, and the streamer will be
            notified. Ensure this action is intentional, as it cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-3 mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleEndLive}>
            Confirm to End
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EndLiveDialog;
