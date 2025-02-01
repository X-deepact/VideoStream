import { Separator } from "@/components/ui/separator.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { LIVESTREAM_STATUS, LivestreamSession } from "@/lib/interface.tsx";
import { formatDate } from "@/lib/date-formated.ts";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Input } from "@/components/ui/input.tsx";
import ImageWithAuth from "@/components/ui/imagewithauth.tsx";
import LivestreamPreview from "@/components/livestream-management/LivestreamPreview.tsx";
import copyToClipBoard from "@/lib/copy.ts";
import { useState } from "react";
import EndLiveDialog from "./EndLiveDialog";

interface ComponentProps {
  livestream: LivestreamSession;
  onSuccessEndLive: (id: string) => void;
}

const LivestreamList = ({ livestream, onSuccessEndLive }: ComponentProps) => {
  const {
    id,
    title,
    description,
    user,
    started_at,
    ended_at,
    status,
    broadcast_url,
    thumbnail_file_name,
  } = livestream;

  const [showEndDialog, setShowEndDialog] = useState(false);
  return (
    <div className="w-full mt-5">
      <Separator />
      <div className="grid grid-cols-3 xl:grid-cols-6 mt-4">
        <div className="w-[80%] relative pt-[56.25%]">
          <ImageWithAuth
            className="absolute top-0 left-0 w-full h-full object-cover"
            url={thumbnail_file_name}
          />
        </div>
        <div className="col-span-1 xl:col-span-4 flex flex-col text-left">
          <div className="font-semibold text-2xl">{title}</div>
          <div className="text-gray-500 text-sm">
            {started_at && `Started at ${formatDate(started_at, true)} -`}{" "}
            {ended_at && `Ended at ${formatDate(ended_at, true)}`}
          </div>
          <div className="text-sm py-2">{user && user.display_name}</div>
          <div className="max-w-full max-h-10 text-sm whitespace-pre-wrap break-words overflow-hidden text-ellipsis">
            {description}
          </div>

          <div className="pt-2 flex flex-row gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">View URL</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Livestream Link</DialogTitle>
                  <DialogDescription>
                    Link directly to the stream
                  </DialogDescription>
                </DialogHeader>
                <div className="flex items-center space-x-2">
                  <div className="grid flex-1 gap-2">
                    <Label htmlFor="link" className="sr-only">
                      Link
                    </Label>
                    <Input id="link" defaultValue={broadcast_url} readOnly />
                  </div>
                  <Button
                    size="sm"
                    className="px-3"
                    onClick={() => copyToClipBoard(broadcast_url)}
                  >
                    <span className="sr-only">Copy</span>
                    <Copy />
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            {status === LIVESTREAM_STATUS.UPCOMING && (
              <>
                <LivestreamPreview sessionId={id} />
              </>
            )}
            {status === LIVESTREAM_STATUS.STARTED && (
              <>
                <EndLiveDialog
                  livestreamId={livestream.id}
                  isOpen={showEndDialog}
                  onOpenChange={setShowEndDialog}
                  onSuccess={() => onSuccessEndLive(id)}
                />
              </>
            )}
          </div>
        </div>
        <div className="ml-auto mr-0">
          <Badge className="text-sm">
            {status && status.toString().toUpperCase()}
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default LivestreamList;
