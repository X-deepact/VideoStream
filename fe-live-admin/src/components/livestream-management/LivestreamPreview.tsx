import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog.tsx";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button.tsx";
import { TextSearch } from "lucide-react";
import { Textarea } from "@/components/ui/textarea.tsx";
import { Label } from "@/components/ui/label.tsx";
import FieldLabel from "@/components/ui/field-label.tsx";
import { DateTimePicker } from "@/components/ui/datetime-picker.tsx";
import {
  getStreamById,
  updateStreamDetail,
  updateStreamScheduledTimeAndVideo,
  updateStreamThumbnail,
} from "@/services/livestream-session.service.ts";
import { toast } from "@/hooks/use-toast.ts";
import MultipleCombobox from "@/components/ui/multiple-combobox.tsx";
import { useCategories } from "@/hooks/useCategories.ts";
import { VideoPlayer } from "@/components/ui/VideoPlayer.tsx";
import { Card, CardContent } from "@/components/ui/card.tsx";
import { Switch } from "@/components/ui/switch.tsx";
import ImageUpload from "@/components/ui/image-upload.tsx";
import { FileUpload } from "@/lib/FileUpload.ts";
import { AxiosError } from "axios";
import {within72Hours} from "@/components/livestream-management/utils.ts";

interface ComponentProps {
  sessionId: string;
}

type PreviewForm = {
  title: string;
  description: string;
  category: string[];
};

const LivestreamPreview = ({ sessionId }: ComponentProps) => {
  const { categories } = useCategories({});
  const [openPreviewDialog, setOpenPreviewDialog] = useState(false);
  const [abortController, setAbortController] =
    useState<AbortController | null>(null);
  const [loading, setLoading] = useState(false);
  const [video, setVideo] = useState<{
    file: string | null;
    name: string;
  }>();
  const [scheduledAt, setScheduledAt] = useState<Date | undefined>();
  const [initScheduledAt, setInitScheduledAt] = useState<Date | undefined>();

  // Replace new video
  const [uploadNewVideo, setUploadNewVideo] = useState(false);
  const videoFileRef = useRef<{ clear: () => void } | null>(null);
  const [newVideo, setNewVideo] = React.useState<{
    file: null | File;
    name: null | string;
  }>({
    file: null,
    name: null,
  });
  function onReplaceVideo(file: File | null) {
    FileUpload(
      file,
      (file, result) => {
        setNewVideo({
          file,
          name: result,
        });
      },
      () => {
        setNewVideo({
          file: null,
          name: null,
        });
      }
    );
  }

  // Replace new Thumbnail
  const [uploadNewThumbnail, setUploadNewThumbnail] = useState(false);
  const imageFileRef = useRef<{ clear: () => void } | null>(null);
  const [newThumbnailImage, setNewThumbnailImage] = React.useState<{
    file: null | File;
    preview: null | string;
  }>({
    file: null,
    preview: null,
  });

  function onReplaceThumbnail(file: File | null) {
    FileUpload(
      file,
      (file, result) => {
        setNewThumbnailImage({
          file,
          preview: result,
        });
      },
      () => {
        setNewThumbnailImage({
          file: null,
          preview: null,
        });
      }
    );
  }

  //Replace title, description and categories
  const [formData, setFormData] = useState<PreviewForm>({
    title: "",
    description: "",
    category: [],
  });
  const [initialFormData, setInitialFormData] = useState({ ...formData });
  const fetchLivestreamDetail = async () => {
    const controller = new AbortController();
    setAbortController(controller);
    setLoading(true);
    try {
      const response = await getStreamById(sessionId, {
        signal: controller.signal,
      });
      const { data } = response.data;

      const formatData = {
        title: data.title,
        description: data.description,
        category: data.categories.map((c: any) => c.id.toString()),
      };
      setFormData(formatData);
      setInitialFormData(formatData);

      setScheduledAt(new Date(data.schedule_stream.scheduled_at));
      setInitScheduledAt(new Date(data.schedule_stream.scheduled_at));

      setVideo({
        file: data.schedule_stream.video_url,
        name: data.schedule_stream.video_name,
      });
    } catch (e) {
      toast({
        variant: "destructive",
        description: "Error fetching Livestream Detail",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (openPreviewDialog) {
      fetchLivestreamDetail();
    } else {
      setUploadNewThumbnail(false);
      setUploadNewVideo(false);
      abortController?.abort();
    }

    return () => {
      // Cleanup if the dialog closes mid-fetch
      abortController?.abort();
    };
  }, [openPreviewDialog]);

  function handleInputChange<K extends keyof PreviewForm>(
    field: K,
    value: PreviewForm[K]
  ) {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  const hasChanges = () => {
    const keys = Object.keys(formData) as (keyof PreviewForm)[];
    for (const key of keys) {
      const currentVal = formData[key];
      const initialVal = initialFormData[key];
      if (Array.isArray(currentVal) && Array.isArray(initialVal)) {
        if (currentVal.length !== initialVal.length) {
          return true;
        }
        if (currentVal.some((val, idx) => val !== initialVal[idx])) {
          return true;
        }
      } else {
        if (currentVal !== initialVal) {
          return true;
        }
      }
    }
    return false;
  };

  // check on scheduled changes
  const hasScheduledChanges = useCallback(() => {
    return initScheduledAt?.getTime() !== scheduledAt?.getTime();
  }, [initScheduledAt, scheduledAt]);

  const shouldAllowUpdate = useCallback(() => {
    return (
      hasChanges() ||
      hasScheduledChanges() ||
      uploadNewThumbnail ||
      uploadNewVideo
    );
  }, [hasChanges, hasScheduledChanges, uploadNewThumbnail, uploadNewVideo]);

  async function handleUpdateStream() {
    try {
      const tasks: Promise<unknown>[] = [];

      if (hasChanges()) tasks.push(handleUpdateSessionDetails());
      if (hasScheduledChanges() || uploadNewVideo)
        tasks.push(handleUpdateScheduledTime());
      if (uploadNewThumbnail) tasks.push(handleChangeThumbnail());

      await Promise.all(tasks);

      // Close Preview Dialog
      setOpenPreviewDialog(false);
      toast({
        description: "Stream updated successfully!",
        className: "",
      });
    } catch (e) {
      handleUpdateStreamError(e);
    }
  }

  async function handleUpdateSessionDetails() {
    const body = {
      title: formData.title,
      description: formData.description,
      category_ids: formData.category.map((d) => Number(d)),
    };
    await updateStreamDetail(sessionId, body);
  }

  async function handleChangeThumbnail() {
    if (newThumbnailImage.file) {
      await updateStreamThumbnail(sessionId, newThumbnailImage.file as File);
    } else {
      handleUpdateStreamError(
        null,
        "No Thumbnail found!!! Please check again."
      );
    }
  }

  async function handleUpdateScheduledTime() {
    if (!scheduledAt) return;
    if (uploadNewVideo) {
      if (newVideo.file) {
        await updateStreamScheduledTimeAndVideo(
          sessionId,
          scheduledAt,
          newVideo.file
        );
        return;
      }
      return handleUpdateStreamError(
        null,
        "No Video found!!! Please check again."
      );
    }
    await updateStreamScheduledTimeAndVideo(sessionId, scheduledAt);
  }

  function handleUpdateStreamError(err?: unknown, msg?: string) {
    if (err && err instanceof AxiosError) {
      return toast({
        description: err.message,
        variant: "destructive",
      });
    }
    if (msg) {
      return toast({
        description: msg,
        variant: "destructive",
      });
    }
    toast({
      description: "Failed to update preview, please try again!",
      variant: "destructive",
    });
  }

  return (
    <Dialog open={openPreviewDialog} onOpenChange={setOpenPreviewDialog}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <TextSearch /> Preview
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[30rem] md:max-w-[36rem] lg:max-w-[45rem] xl:max-w-[50rem] 2xl:max-w-[60rem]">
        <DialogHeader>
          <DialogTitle className="text-xl">Livestream Details</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="grid grid-cols-5 gap-5">
            <div className="col-span-3 space-y-4">
              <div className="grid grid-cols-6">
                <FieldLabel isRequired={true} label="Title" />
                <Textarea
                  className="col-span-5"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                />
              </div>

              <div className="grid grid-cols-6">
                <FieldLabel isRequired={true} label="Description" />
                <Textarea
                  className="col-span-5"
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                />
              </div>

              <div className="flex flex-col gap-4">
                <FieldLabel isRequired={true} label="Scheduled at" />
                <div className="">
                  <DateTimePicker
                    width="w-full"
                    value={scheduledAt}
                    onDateChange={setScheduledAt}
                    disableDate={within72Hours}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <FieldLabel isRequired={true} label="Categories" />
                <div className="">
                  <MultipleCombobox
                    isPreviewing={true}
                    data={categories}
                    value={formData.category}
                    onValueChange={(e: string[]) =>
                      handleInputChange("category", e)
                    }
                  />
                </div>
              </div>

              <div className="flex flex-col rounded-lg border p-4 space-y-4">
                <div className="flex flex-row items-center justify-between">
                  <div className="space-y-0.5 flex flex-col">
                    <Label className="text-base">
                      Considering to change video?
                    </Label>
                    <span className="text-xs">
                      Switch the button to upload new video
                    </span>
                  </div>
                  <Switch
                    checked={uploadNewVideo}
                    onCheckedChange={(value) => {
                      if (!value) onReplaceVideo(null);
                      setUploadNewVideo(value);
                    }}
                  />
                </div>
                {uploadNewVideo && (
                  <div>
                    <ImageUpload
                      ref={videoFileRef}
                      mode="video"
                      width="w-full overflow-hidden"
                      height="h-[5rem]"
                      preview={newVideo.name || ""}
                      onFileChange={(file) => onReplaceVideo(file)}
                    />
                  </div>
                )}
              </div>

              <div className="flex flex-col rounded-lg border p-4 space-y-4">
                <div className="flex flex-row items-center justify-between">
                  <div className="space-y-0.5 flex flex-col">
                    <Label className="text-base">
                      Considering to change thumbnail?
                    </Label>
                    <span className="text-xs">
                      Switch the button to upload new thumbnail
                    </span>
                  </div>
                  <Switch
                    checked={uploadNewThumbnail}
                    onCheckedChange={(value) => {
                      if (!value) onReplaceThumbnail(null);
                      setUploadNewThumbnail(value);
                    }}
                  />
                </div>
                {uploadNewThumbnail && (
                  <div>
                    <ImageUpload
                      ref={imageFileRef}
                      mode="image"
                      width="w-full overflow-hidden"
                      height="h-[5rem]"
                      preview={newThumbnailImage.preview || ""}
                      onFileChange={(file) => onReplaceThumbnail(file)}
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="col-span-2">
              <Card className="w-full">
                <CardContent className="px-0 space-x-4 space-y-4">
                  <VideoPlayer videoPath={video?.file as string} />
                  <div>
                    <Label>Video Name: </Label>
                    <span className="text-sm w-64 whitespace-nowrap overflow-hidden overflow-ellipsis">
                      {video?.name}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
        <DialogFooter className="justify-end">
          <DialogClose asChild>
            <Button
              type="button"
              variant="outline"
              className={`${!shouldAllowUpdate()}` ? "" : "cursor-pointer"}
              disabled={!shouldAllowUpdate()}
            >
              Cancel Change and Close
            </Button>
          </DialogClose>
          <Button
            className={`${!shouldAllowUpdate()}` ? "" : "cursor-pointer"}
            disabled={!shouldAllowUpdate()}
            onClick={handleUpdateStream}
          >
            Update
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LivestreamPreview;
