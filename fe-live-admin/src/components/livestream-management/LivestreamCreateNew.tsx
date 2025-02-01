import { z } from "zod";
import { Input } from "@/components/ui/input.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import React, { useRef, useState } from "react";
import { Label } from "@/components/ui/label.tsx";
import ImageUpload from "@/components/ui/image-upload.tsx";
import { DateTimePicker } from "@/components/ui/datetime-picker.tsx";
import DataCombobox from "@/components/ui/data-combobox.tsx";
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
import { Button } from "@/components/ui/button.tsx";
import { Rss } from "lucide-react";
import ErrorMessage from "@/components/ui/error-message.tsx";
import { toast } from "@/hooks/use-toast.ts";
import { createNewLivestreamSession } from "@/services/livestream-session.service.ts";
import {
  formatDateToCustomFormat,
  getTimezoneOffsetAsHoursAndMinutes,
  validateTimestampWithinThreeDays,
} from "@/lib/date-formated.ts";
import MultipleCombobox from "@/components/ui/multiple-combobox.tsx";
import FieldLabel from "@/components/ui/field-label.tsx";
import { FileUpload } from "@/lib/FileUpload.ts";
import { within72Hours } from "@/components/livestream-management/utils.ts";
import AppAlert from "../common/AppAlert";
import { Link } from "react-router-dom";
import { APP_LIVE_CATEGORY_PATH } from "@/router";

const FormSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  description: z
    .string()
    .min(2, {
      message: "Description must be at least 2 characters.",
    })
    .max(250, {
      message: "Description must not longer than 250 characters.",
    }),
  assignedUser: z.string().min(1, {
    message: "User is required",
  }),
  category: z.array(z.string()).min(1, {
    message: "Category is required",
  }),
  startDate: z
    .date({
      required_error: "Schedule time is required.",
      invalid_type_error: "Invalid date selected.",
    })
    .refine((date) => validateTimestampWithinThreeDays(date), {
      message: "Date must be within three days from current time",
    }),
});

interface ComponentProps {
  categories: { label: string; value: string }[];
  users: { label: string; value: string }[];
  onReset: () => void;
  isDisabled: boolean;
}

const LivestreamCreateNew = (props: ComponentProps) => {
  const { categories, users, onReset, isDisabled } = props;

  const videoFileRef = useRef<{ clear: () => void } | null>(null);
  const imageFileRef = useRef<{ clear: () => void } | null>(null);
  const triggerClear = () => {
    videoFileRef.current?.clear(); // Call the `clear` method of ImageUpload
    imageFileRef.current?.clear(); // Call the `clear` method of VideoUpload
  };

  const [openCreateNewDialog, setOpenCreateNewDialog] = useState(false);
  const [isLoading, setLoading] = useState(false);

  //Form Fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedUser, setAssignedUser] = React.useState("");
  const [category, setCategory] = React.useState<string[]>([]);
  const [startDate, setStartDate] = React.useState<Date>();
  const [thumbnailImage, setThumbnailImage] = React.useState<{
    file: null | File;
    preview: null | string;
  }>({
    file: null,
    preview: null,
  });
  const [videoFile, setVideoFile] = React.useState<{
    file: null | File;
    name: null | string;
  }>({
    file: null,
    name: null,
  });

  //Form Errors
  const [errors, setErrors] = React.useState<{
    [field: string]: string;
  }>({});

  function handleThumbnailChanges(file: File) {
    FileUpload(
      file,
      (file, result) => {
        setThumbnailImage({
          file,
          preview: result,
        });
      },
      () => {
        setThumbnailImage({
          file: null,
          preview: null,
        });
      }
    );
  }

  function handleVideoUpload(file: File) {
    FileUpload(
      file,
      (file) => {
        setVideoFile({
          file,
          name: file.name,
        });
      },
      () => {
        setVideoFile({
          file: null,
          name: null,
        });
      }
    );
  }

  async function handleCreateNewStream(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const data = {
      title,
      description,
      assignedUser,
      category,
      startDate,
    };

    const result = FormSchema.safeParse(data);

    if (!result.success) {
      // gather errors
      const formErrors: { [key: string]: string } = {};
      for (const issue of result.error.issues) {
        const fieldName = issue.path[0];
        formErrors[fieldName] = issue.message;
      }

      setErrors(formErrors);
      return;
    }

    // clear errors if validation succeeded
    setErrors({});

    //create body
    const body = {
      title: title,
      description: description,
      category_ids: category.map((c) => Number(c)),
      scheduled_at: formatDateToCustomFormat(
        startDate as Date,
        getTimezoneOffsetAsHoursAndMinutes()
      ),
      thumbnail: thumbnailImage.file,
      video: videoFile.file,
      user_id: assignedUser,
    };

    try {
      setLoading(true);
      toast({
        description:
          "Please don't turn off the creating form and wait for completion",
      });

      await createNewLivestreamSession(body).then(() => {
        toast({
          description: "Successfully created new session",
        });
        onReset();
        setOpenCreateNewDialog(false);
        handleCancel();
      });
    } catch (e) {
      if (e instanceof Error) {
        toast({
          description: e.message,
          variant: "destructive",
        });
      } else {
        toast({
          description: "An unexpected error occurred",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  }

  function handleCancel() {
    setErrors({});
    setTitle("");
    setDescription("");
    setCategory([]);
    setAssignedUser("");
    setStartDate(undefined);
    setThumbnailImage({
      file: null,
      preview: null,
    });
    setVideoFile({
      file: null,
      name: null,
    });
    triggerClear();
  }

  return (
    <Dialog open={openCreateNewDialog} onOpenChange={setOpenCreateNewDialog}>
      <DialogTrigger asChild>
        <Button variant="outline" disabled={isDisabled}>
          <Rss />
          New Stream
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[30rem] md:max-w-[36rem] lg:max-w-[45rem] xl:max-w-[50rem] 2xl:max-w-[60rem]">
        <DialogHeader>
          <DialogTitle className="text-xl">Create Stream</DialogTitle>
          <DialogDescription>
            Fill following information to start creating new stream
          </DialogDescription>
          {categories?.length === 0 && (
            <AppAlert
              varient="destructive"
              title={
                <p>
                  You have to create at least one stream category before
                  creating a new stream.{" "}
                  <Link
                    to={APP_LIVE_CATEGORY_PATH}
                    className="text-black/70 hover:text-black hover:underline hover:underline-offset-2"
                  >
                    Create new category
                  </Link>
                  .
                </p>
              }
            />
          )}
        </DialogHeader>
        <div>
          <form className="space-y-4" onSubmit={handleCreateNewStream}>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
              <div className="xl:col-span-1">
                {/*title*/}
                <div className="pb-2 xl:pb-4">
                  <Label htmlFor="title">
                    Title <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="title"
                    placeholder="Livestream Title"
                    value={title}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setTitle(e.target.value);
                    }}
                    disabled={isLoading}
                  />
                  {errors.title && <ErrorMessage msg={errors.title} />}
                </div>

                {/*description*/}
                <div className="pb-2 xl:pb-4">
                  <Label htmlFor="description">
                    Description <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    className="h-20 xl:h-56"
                    id="description"
                    placeholder="Livestream Description"
                    value={description}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                      setDescription(e.target.value);
                    }}
                    disabled={isLoading}
                  />
                  {errors.description && (
                    <ErrorMessage msg={errors.description} />
                  )}
                </div>

                <div className="grid grid-cols-2 xl:grid-cols-1 pb-2 xl:pb-4 gap-2 xl:gap-4">
                  {/*Users*/}
                  <div>
                    <FieldLabel isRequired={true} label="Streamer" />
                    <DataCombobox
                      placeholder="Select User"
                      emptyMsg="No user found"
                      data={users}
                      onDataChange={setAssignedUser}
                      disabled={isLoading}
                      popOverClass={"w-auto xl:w-[22rem] p-0"}
                    />
                    {errors.assignedUser && (
                      <ErrorMessage msg={errors.assignedUser} />
                    )}
                  </div>

                  {/*Categories*/}
                  <div>
                    <FieldLabel isRequired={true} label="Categories" />
                    <MultipleCombobox
                      placeholder="Select Categories"
                      emptyMsg="No category found"
                      data={categories}
                      disabled={isLoading}
                      onValueChange={setCategory}
                      allowAllSelection={true}
                      maxSelection={3}
                      popOverClass={"w-auto xl:w-[22rem] p-0"}
                    />
                    {errors.category && <ErrorMessage msg={errors.category} />}
                  </div>
                </div>

                {/*Schedule Time*/}
                <div className="pb-2">
                  <Label htmlFor="scheduleTime">
                    Schedule Time <span className="text-red-500">*</span>
                  </Label>
                  <div>
                    <DateTimePicker
                      width="w-full"
                      onDateChange={setStartDate}
                      placeholder="Start Date"
                      disabled={isLoading}
                      disableDate={within72Hours}
                    />
                    {errors.startDate && (
                      <ErrorMessage msg={errors.startDate} />
                    )}
                  </div>
                </div>
              </div>
              <div className="xl:col-span-1">
                <div className="pb-4">
                  <Label htmlFor="thumbnail">
                    Thumbnail <span className="text-red-500">*</span>
                  </Label>
                  <p className="text-sm text-neutral-500 mb-4">
                    To ensure compatibility and consistent rendering, thumbnails
                    only accept formats like image/png, image/jpeg, and
                    image/jpg.
                  </p>
                  <ImageUpload
                    ref={imageFileRef}
                    width="w-full overflow-hidden"
                    height="h-24 lg:h-[12rem] xl:h-[15rem]"
                    onFileChange={(file) => {
                      if (file) handleThumbnailChanges(file);
                    }}
                    preview={thumbnailImage.preview || ""}
                    mode="image"
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <Label htmlFor="thumbnail">
                    Playback Video <span className="text-red-500">*</span>
                  </Label>
                  <p className="text-sm text-neutral-500 mb-4">
                    To ensure broad compatibility, efficient streaming, videos
                    only accept formats like video/mp4 and video/x-flv.
                  </p>
                  <ImageUpload
                    ref={videoFileRef}
                    width="w-full overflow-hidden"
                    height="h-24 lg:h-[12rem] xl:h-[15rem]"
                    onFileChange={(file) => {
                      if (file) handleVideoUpload(file);
                    }}
                    preview={videoFile.name || ""}
                    mode="video"
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>
            <DialogFooter className="justify-end">
              <DialogClose asChild>
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Close
                </Button>
              </DialogClose>
              <Button disabled={categories?.length === 0} type="submit">
                Create
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LivestreamCreateNew;
