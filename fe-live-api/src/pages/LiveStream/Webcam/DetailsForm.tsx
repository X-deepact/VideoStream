import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useEffect, useRef, useState } from 'react';
import { Label } from '@/components/ui/label';
import RequiredInput from '@/components/RequiredInput';
import FormErrorMessage from '@/components/FormErrorMsg';
import { Textarea } from '@/components/ui/textarea';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Blocks, Camera, Podcast } from 'lucide-react';
import ImageUpload from '@/components/ImageUpload';
import { Separator } from '@/components/ui/separator';
import { DialogClose } from '@radix-ui/react-dialog';
import { initializeStream, StreamInitializeError } from '@/services/stream';
import { STREAM_TYPE } from '@/types/stream';
import AppAlert from '@/components/AppAlert';
import { useSidebar } from '@/components/ui/sidebar';
import { StreamInitializeResponse } from '@/data/dto/stream';

interface ComponentProps {
  isOpen: boolean;
  onSuccess: (data: StreamInitializeResponse) => void;
  onClose: () => void;
}

const inputPlaceholders = {
  title: 'Add a title that describes your stream',
  description: 'Tell viewers more about your stream',
};

const validationRules = {
  title: 'Title is required, max 100 characters',
  description: 'Description is required',
  thumbnail: 'Thumbnail is required',
  common: 'Something went wrong. Please try again.',
};

type StreamInitializeFormError = {
  titleFailure: boolean;
  descriptionFailure: boolean;
  thumbnailImageFailure: boolean;
  actionFailure: boolean;
};

const DetailsForm = (props: ComponentProps) => {
  const { toggleSidebar } = useSidebar();

  const { isOpen, onSuccess, onClose } = props;

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const titleInput = useRef<HTMLInputElement>(null);
  const descriptionInput = useRef<HTMLTextAreaElement>(null);
  const [thumbnailImage, setThumbnailImage] = useState<{
    file: null | File;
    preview: null | string;
  }>({
    file: null,
    preview: null,
  });
  const [formError, setFormError] = useState<StreamInitializeFormError>({
    titleFailure: false,
    descriptionFailure: false,
    thumbnailImageFailure: false,
    actionFailure: false,
  });

  const handleFormSubmit = async (
    event: React.SyntheticEvent
  ): Promise<void> => {
    event.preventDefault();

    setIsLoading(true);
    const title = titleInput.current?.value || '';
    const description = descriptionInput.current?.value || '';

    const { data, errors: _errors } = await initializeStream({
      title,
      description,
      streamType: STREAM_TYPE.CAMERA,
      thumbnailImage: thumbnailImage?.file,
    });

    if (!!data && !_errors) {
      onSuccess(data);
      toggleSidebar();
    } else {
      if (_errors) {
        const formError: StreamInitializeFormError = {
          titleFailure: _errors?.[StreamInitializeError.INVALID_TITLE] || false,
          descriptionFailure:
            _errors?.[StreamInitializeError.INVALID_TITLE] || false,
          thumbnailImageFailure:
            _errors?.[StreamInitializeError.INVALID_THUMBNAIL_IMAGE] || false,
          actionFailure:
            _errors?.[StreamInitializeError.ACTION_FAILURE] || false,
        };

        const { titleFailure, descriptionFailure, thumbnailImageFailure } =
          formError;
        setFormError((prevError: StreamInitializeFormError) => ({
          ...prevError,
          titleFailure,
          descriptionFailure,
          thumbnailImageFailure,
        }));
      }
    }
    setIsLoading(false);
  };

  const handleTitleChange = (): void => {
    const error = {
      titleFailure: false,
      actionFailure: false,
    };

    setFormError((prevState: StreamInitializeFormError) => ({
      ...prevState,
      ...error,
    }));
  };

  const handleDescriptionChange = (): void => {
    const error = {
      descriptionFailure: false,
      actionFailure: false,
    };

    setFormError((prevState: StreamInitializeFormError) => ({
      ...prevState,
      ...error,
    }));
  };

  const handleImagesChange = (file: File) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailImage({ file, preview: reader.result as string });
      };
      reader.readAsDataURL(file);
      setFormError((prevError: StreamInitializeFormError) => ({
        ...prevError,
        actionFailure: false,
        thumbnailImageFailure: false,
      }));
    } else {
      setThumbnailImage({ file: null, preview: null });
      setFormError((prevError: StreamInitializeFormError) => ({
        ...prevError,
        thumbnailImageFailure: true,
      }));
    }
  };

  useEffect(() => {
    return function clean() {
      setFormError({
        actionFailure: false,
        titleFailure: false,
        descriptionFailure: false,
        thumbnailImageFailure: false,
      });
    };
  }, []);

  const {
    actionFailure,
    titleFailure,
    descriptionFailure,
    thumbnailImageFailure,
  } = formError;
  let invalidTitleError = null,
    invalidDescriptionError = null,
    invalidThumbnailImageError = null,
    somethingWrongError = null;
  if (titleFailure) invalidTitleError = validationRules.title;
  if (descriptionFailure) invalidDescriptionError = validationRules.description;
  if (thumbnailImageFailure)
    invalidThumbnailImageError = validationRules.thumbnail;
  if (actionFailure) {
    somethingWrongError = validationRules.common;
    invalidTitleError = '';
    invalidThumbnailImageError = '';
  }

  const titleInputInvalid = titleFailure || actionFailure;
  const descriptionInputInvalid = descriptionFailure || actionFailure;
  const thumbnailImageInputInvalid = thumbnailImageFailure || actionFailure;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] p-0">
        <DialogHeader className="p-5 px-7 pb-0">
          <DialogTitle>Create Stream</DialogTitle>
          <DialogDescription>
            Fill the following information to start streaming.
          </DialogDescription>
        </DialogHeader>
        <Separator />
        <form className="grid gap-1 p-5 px-7 pt-2" onSubmit={handleFormSubmit}>
          <div className="grid gap-3">
            {somethingWrongError && (
              <AppAlert
                variant="destructive"
                title="Error"
                description={validationRules.common}
              />
            )}

            {/* stream type */}
            <div className="flex flex-col items-start gap-3">
              <Label htmlFor="title">
                Stream Type <RequiredInput />
              </Label>
              <div className="inline cursor-not-allowed">
                <ToggleGroup type="single" value="webcam" disabled>
                  <ToggleGroupItem value="webcam">
                    <Camera /> Webcam
                  </ToggleGroupItem>
                  <ToggleGroupItem value="software">
                    <Blocks /> Software
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>
            </div>

            {/* title */}
            <div className="grid gap-3 mt-3">
              <Label htmlFor="title">
                Title <RequiredInput />
              </Label>
              <Input
                ref={titleInput}
                onChange={handleTitleChange}
                id="title"
                type="text"
                placeholder={inputPlaceholders.title}
                disabled={isLoading}
                className={`${
                  titleInputInvalid ? 'ring-red-500 border-red-500' : ''
                } w-full`}
              />
              {invalidTitleError && (
                <FormErrorMessage classes="-mt-2" message={invalidTitleError} />
              )}
            </div>

            {/* description */}
            <div className="grid gap-3 mt-3">
              <Label htmlFor="description">
                Description <RequiredInput />
              </Label>
              <Textarea
                ref={descriptionInput}
                onChange={handleDescriptionChange}
                id="description"
                className={`${
                  descriptionInputInvalid ? 'ring-red-500 border-red-500' : ''
                } w-full resize-none`}
                rows={4}
                placeholder={inputPlaceholders.description}
                disabled={isLoading}
              />
              {invalidDescriptionError && (
                <FormErrorMessage
                  classes="-mt-2"
                  message={invalidDescriptionError}
                />
              )}
            </div>

            {/* thumbnail image */}
            <div className="grid gap-3 mt-3">
              <Label htmlFor="description">
                Thumbnail Image <RequiredInput />
              </Label>
              <ImageUpload
                isDanger={thumbnailImageInputInvalid}
                isDisabled={isLoading}
                width="w-[200px]"
                height="h-24"
                preview={thumbnailImage.preview || ''}
                onFileChange={(file) => {
                  if (file) handleImagesChange(file);
                }}
              />
              {invalidThumbnailImageError && (
                <FormErrorMessage
                  classes="-mt-2"
                  message={invalidThumbnailImageError}
                />
              )}
            </div>
          </div>
          <DialogFooter className="p-5 pr-0">
            <DialogClose asChild>
              <Button variant="destructive" onClick={onClose}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" className="bg-green-600 hover:bg-green-800">
              <Podcast /> Start Stream
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DetailsForm;
