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
import { ChangeEvent, Fragment, useEffect, useState } from 'react';
import { Label } from '@/components/ui/label';
import RequiredInput from '@/components/RequiredInput';
import FormErrorMessage from '@/components/FormErrorMsg';
import { Textarea } from '@/components/ui/textarea';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Blocks, Camera, Pencil, Radio, Save } from 'lucide-react';
import ImageUpload from '@/components/ImageUpload';
import { Separator } from '@/components/ui/separator';
import { DialogClose } from '@radix-ui/react-dialog';
import { saveVideoOrStream, StreamInitializeError } from '@/services/stream';
import { STREAM_TYPE } from '@/data/types/stream';
import AppAlert from '@/components/AppAlert';
import { useSidebar } from '@/components/CustomSidebar';
import { StreamDetailsResponse } from '@/data/dto/stream';
import { MultiSelect } from '@/components/MultiSelect';
import { MAX_CATEGORY_COUNT, StreamDetailsRules } from '@/data/validations';
import { FORM_MODE } from '@/data/types/ui/form';
import AuthImage from '@/components/AuthImage';
import VideoCategory from '@/components/VideoCategory';
import { cn, convertToHashtagStyle } from '@/lib/utils';
import { fetchImageWithAuth } from '@/api/image';

interface ComponentProps {
  isOpen: boolean;
  mode: FORM_MODE;
  data?: StreamDetailsResponse;
  categories: { id: string; name: string }[];
  onSuccess: (data: StreamDetailsResponse) => void;
  onClose: () => void;
}

const inputPlaceholders = {
  title: 'Add a title that describes your stream',
  description: 'Tell viewers more about your stream',
  category: `Select ${MAX_CATEGORY_COUNT} categories at most`,
};

const validationRules = {
  title: 'Title is required, max 100 characters',
  description: 'Description is required',
  thumbnail: 'Thumbnail is required, max 1 MB size',
  category: 'Category is required',
  common: 'Something went wrong. Please try again.',
};

type StreamInitializeFormError = {
  titleFailure: boolean;
  descriptionFailure: boolean;
  categoryFailure: boolean;
  thumbnailImageFailure: boolean;
  actionFailure: boolean;
};

const DetailsForm = (props: ComponentProps) => {
  const { open: isSidebarOpen, setOpen: setSidebarOpen } = useSidebar();

  const {
    isOpen,
    mode = FORM_MODE.CREATE,
    data,
    categories,
    onSuccess,
    onClose,
  } = props;

  const [_mode, setMode] = useState<FORM_MODE>(mode);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [title, setTitle] = useState(data?.title || '');
  const [description, setDescription] = useState(data?.description || '');
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
    categoryFailure: false,
    thumbnailImageFailure: false,
    actionFailure: false,
  });

  const isViewMode = _mode === FORM_MODE.VIEW;
  const isCreateMode = mode === FORM_MODE.CREATE;
  const isEditMode = _mode === FORM_MODE.EDIT;

  /**
   *
   * @param mode
   * // mode -> create -> start initializing stream (create)
   * // mode -> edit -> update stream details (update)
   */
  const handleStreamDetailsSave = async (mode: FORM_MODE): Promise<void> => {
    setIsLoading(true);

    let responseData: StreamDetailsResponse | undefined,
      responseErrors: Record<StreamInitializeError, boolean> | undefined;

    if (mode === FORM_MODE.CREATE) {
      const { data: _data, errors: _errors } = await saveVideoOrStream(
        {
          title,
          description,
          categories: selectedCategories,
          streamType: STREAM_TYPE.CAMERA,
          thumbnailImage: thumbnailImage?.file,
          thumbnailPreview: thumbnailImage?.preview,
        },
        FORM_MODE.CREATE
      );
      responseData = _data;
      responseErrors = _errors;
    } else if (mode === FORM_MODE.EDIT) {
      const { data: _data, errors: _errors } = await saveVideoOrStream(
        {
          id: data?.id || 0,
          title,
          description,
          categories: selectedCategories,
          streamType: STREAM_TYPE.CAMERA,
          thumbnailImage: thumbnailImage?.file,
          thumbnailPreview: thumbnailImage?.preview,
        },
        FORM_MODE.EDIT
      );
      responseData = _data;
      responseErrors = _errors;
    }

    if (!!responseData && !responseErrors) {
      onSuccess(responseData);
      setMode(FORM_MODE.VIEW);
      if (isSidebarOpen) setSidebarOpen(false);
    } else {
      if (responseErrors) {
        const formError: StreamInitializeFormError = {
          titleFailure:
            responseErrors?.[StreamInitializeError.INVALID_TITLE] || false,
          descriptionFailure:
            responseErrors?.[StreamInitializeError.INVALID_TITLE] || false,
          categoryFailure:
            responseErrors?.[StreamInitializeError.INVALID_CATEGORY] || false,
          thumbnailImageFailure:
            responseErrors?.[StreamInitializeError.INVALID_THUMBNAIL_IMAGE] ||
            false,
          actionFailure:
            responseErrors?.[StreamInitializeError.ACTION_FAILURE] || false,
        };

        const {
          titleFailure,
          descriptionFailure,
          categoryFailure,
          thumbnailImageFailure,
        } = formError;
        setFormError((prevError: StreamInitializeFormError) => ({
          ...prevError,
          titleFailure,
          descriptionFailure,
          categoryFailure,
          thumbnailImageFailure,
        }));
      }
    }
    setIsLoading(false);
  };

  const handleCancelEdit = () => {
    setMode(FORM_MODE.VIEW);
    clearFormErrors();
  };

  // input handlers
  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;

    if (value.length <= StreamDetailsRules.title.max) {
      setTitle(e.target.value);

      const error = {
        titleFailure: false,
        actionFailure: false,
      };

      setFormError((prevState: StreamInitializeFormError) => ({
        ...prevState,
        ...error,
      }));
    }
  };
  const handleDescriptionChange = (
    e: ChangeEvent<HTMLTextAreaElement>
  ): void => {
    const value = e.target.value;

    if (value.length <= StreamDetailsRules.description.max) {
      setDescription(e.target.value);

      const error = {
        descriptionFailure: false,
        actionFailure: false,
      };

      setFormError((prevState: StreamInitializeFormError) => ({
        ...prevState,
        ...error,
      }));
    }
  };
  const handleCategoryChange = (value: string[]): void => {
    setSelectedCategories(value);

    const error = {
      categoryFailure: false,
      actionFailure: false,
    };

    setFormError((prevState: StreamInitializeFormError) => ({
      ...prevState,
      ...error,
    }));
  };
  const handleImagesChange = (file: File | null) => {
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

  const handleClose = () => {
    setMode(FORM_MODE.VIEW);
    if (data) {
      setSelectedCategories(() =>
        (data?.category_ids || []).map((id: number) => id.toString())
      );
      setThumbnailImage({
        file: null,
        preview: data.thumbnail_url || null,
      });
    }
    onClose();
  };

  const clearFormErrors = () =>
    setFormError({
      actionFailure: false,
      titleFailure: false,
      descriptionFailure: false,
      categoryFailure: false,
      thumbnailImageFailure: false,
    });

  useEffect(() => {
    return function clean() {
      clearFormErrors();
    };
  }, []);

  useEffect(() => {
    if (isEditMode && data) {
      setThumbnailImage((prev) => {
        return prev.preview !== data?.thumbnail_url
          ? { ...prev, preview: data?.thumbnail_url }
          : prev;
      });
    }
    setSelectedCategories(() =>
      (data?.category_ids || []).map((id: number) => id.toString())
    );
  }, [isEditMode, data, categories]);

  useEffect(() => {
    if (data && isEditMode && data?.thumbnail_url) {
      const fetchOldThumbnail = async () => {
        if (data?.thumbnail_url) {
          const oldThumbnailUrl = await fetchImageWithAuth(data?.thumbnail_url);
          setThumbnailImage((prev) => {
            return { ...prev, preview: oldThumbnailUrl };
          });
        }
      };
      fetchOldThumbnail();
    }
  }, [data, isEditMode]);

  // reset the input values whenever _mode changes to VIEW
  useEffect(() => {
    if (_mode === FORM_MODE.VIEW && data) {
      setTitle(data.title || '');
      setDescription(data.description || '');
    }
  }, [_mode, data]);

  const {
    actionFailure,
    titleFailure,
    descriptionFailure,
    categoryFailure,
    thumbnailImageFailure,
  } = formError;
  let invalidTitleError = null,
    invalidDescriptionError = null,
    invalidCategoryError = null,
    invalidThumbnailImageError = null,
    somethingWrongError = null;
  if (titleFailure) invalidTitleError = validationRules.title;
  if (descriptionFailure) invalidDescriptionError = validationRules.description;
  if (categoryFailure) invalidCategoryError = validationRules.category;
  if (thumbnailImageFailure)
    invalidThumbnailImageError = validationRules.thumbnail;
  if (actionFailure) {
    somethingWrongError = validationRules.common;
    invalidTitleError = '';
    invalidThumbnailImageError = '';
  }

  const titleInputInvalid = titleFailure || actionFailure;
  const descriptionInputInvalid = descriptionFailure || actionFailure;
  const categoryInputInvalid = categoryFailure || actionFailure;
  const thumbnailImageInputInvalid = thumbnailImageFailure || actionFailure;

  if ((_mode === FORM_MODE.VIEW || _mode === FORM_MODE.EDIT) && !data) return;

  let formDescription = '';
  let formTitle = '';
  switch (_mode) {
    case FORM_MODE.CREATE:
      formTitle = 'Create Stream';
      formDescription = 'Fill the following information to start streaming.';
      break;
    case FORM_MODE.EDIT:
      formTitle = 'Edit Stream';
      formDescription =
        'Update the following information as needed. All fields are required.';
      break;
    case FORM_MODE.VIEW:
      formTitle = 'About Stream';
      formDescription = 'Following information describes about your stream.';
      break;
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] p-0">
        <DialogHeader className="p-5 px-7 pb-0">
          <DialogTitle>{formTitle}</DialogTitle>
          <DialogDescription>{formDescription}</DialogDescription>
        </DialogHeader>
        <Separator />
        <div className="grid gap-1 p-5 px-7 pt-2">
          <div className="grid gap-3">
            {somethingWrongError && (
              <AppAlert
                variant="destructive"
                title="Error"
                description={validationRules.common}
              />
            )}

            {/* title */}
            <div className="grid gap-3">
              <div className="flex justify-between items-center">
                <Label htmlFor="title">
                  Title {!isViewMode && <RequiredInput />}
                </Label>
                <p className="text-xs text-muted-foreground">
                  {title?.length}/{StreamDetailsRules.title.max}
                </p>
              </div>
              <Input
                id="title"
                type="text"
                value={title}
                onChange={handleTitleChange}
                placeholder={inputPlaceholders.title}
                disabled={isLoading || isViewMode}
                className={cn(
                  'w-full',
                  titleInputInvalid && 'ring-red-500 border-red-500',
                  isViewMode && 'disabled:opacity-100'
                )}
              />
              {invalidTitleError && (
                <FormErrorMessage classes="-mt-2" message={invalidTitleError} />
              )}
            </div>

            {/* description */}
            <div className="grid gap-3 mt-3">
              <div className="flex justify-between items-center">
                <Label htmlFor="description">
                  Description {!isViewMode && <RequiredInput />}
                </Label>
                <p className="text-xs text-muted-foreground">
                  {description?.length}/{StreamDetailsRules.description.max}
                </p>
              </div>
              <Textarea
                value={description}
                onChange={handleDescriptionChange}
                id="description"
                className={cn(
                  'w-full resize-none',
                  descriptionInputInvalid && 'ring-red-500 border-red-500',
                  isViewMode && 'disabled:opacity-100'
                )}
                rows={4}
                placeholder={inputPlaceholders.description}
                disabled={isLoading || isViewMode}
              />
              {invalidDescriptionError && (
                <FormErrorMessage
                  classes="-mt-2"
                  message={invalidDescriptionError}
                />
              )}
            </div>

            {/* categories */}
            <div className="grid gap-3 mt-3">
              <Label htmlFor="description">
                Categories {!isViewMode && <RequiredInput />}
              </Label>
              <div className="max-w-xl">
                {isViewMode ? (
                  <div className="flex gap-2 p-3 border rounded-md flex-wrap">
                    {data &&
                      data?.category_ids?.length > 0 &&
                      categories?.map((category, index) => {
                        if (data.category_ids?.includes(Number(category.id))) {
                          return (
                            <Fragment key={category.id}>
                              <VideoCategory
                                id={Number(category.id) || index}
                                label={convertToHashtagStyle(category.name)}
                              />
                            </Fragment>
                          );
                        }
                      })}
                  </div>
                ) : (
                  <MultiSelect
                    isError={categoryInputInvalid}
                    options={categories}
                    onValueChange={handleCategoryChange}
                    defaultValue={selectedCategories}
                    placeholder={inputPlaceholders.category}
                    animation={0}
                    maxCount={MAX_CATEGORY_COUNT}
                  />
                )}
              </div>
              {invalidCategoryError && (
                <FormErrorMessage
                  classes="-mt-2"
                  message={invalidCategoryError}
                />
              )}
            </div>

            <div className="flex flex-col-reverse md:flex-row w-full gap-5 justify-start items-start mt-3">
              {/* thumbnail image */}
              <div className="w-full md:w-1/2 grid gap-3">
                <Label htmlFor="description">
                  Thumbnail Image {!isViewMode && <RequiredInput />}
                </Label>
                {isViewMode ? (
                  <AuthImage
                    src={data?.thumbnail_url || ''}
                    alt={data?.title || 'Thumbnail'}
                    className="w-full h-24 rounded-sm object-cover"
                  />
                ) : (
                  <ImageUpload
                    isError={thumbnailImageInputInvalid}
                    isDisabled={isLoading || isViewMode}
                    width="w-full overflow-hidden"
                    height="h-24"
                    preview={thumbnailImage.preview || ''}
                    onFileChange={(file) => {
                      if (file) handleImagesChange(file);
                      else handleImagesChange(null);
                    }}
                  />
                )}
                {invalidThumbnailImageError && (
                  <FormErrorMessage
                    classes="-mt-2"
                    message={invalidThumbnailImageError}
                  />
                )}
              </div>

              {/* stream type */}
              <div className="w-full md:w-1/2 flex flex-col items-start gap-3">
                <Label htmlFor="title">
                  Stream Type {!isViewMode && <RequiredInput />}
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
            </div>
          </div>
          <DialogFooter className="sm:flex gap-1 w-full px-0 py-5">
            {!isEditMode && (
              <DialogClose asChild>
                <Button size="sm" variant="destructive" onClick={handleClose}>
                  {isViewMode ? 'Close' : 'Cancel'}
                </Button>
              </DialogClose>
            )}
            {isViewMode && (
              <Button size="sm" onClick={() => setMode(FORM_MODE.EDIT)}>
                <Pencil /> Edit
              </Button>
            )}
            {isCreateMode && (
              <Button
                size="sm"
                onClick={() => handleStreamDetailsSave(FORM_MODE.CREATE)}
                className="bg-green-600 hover:bg-green-800"
              >
                <Radio /> {isLoading ? 'Starting Stream...' : 'Start Stream'}
              </Button>
            )}
            {isEditMode && (
              <Fragment>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={handleCancelEdit}
                >
                  Cancel Edit
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleStreamDetailsSave(FORM_MODE.EDIT)}
                >
                  <Save /> {isLoading ? 'Saving...' : 'Save'}
                </Button>
              </Fragment>
            )}
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DetailsForm;
