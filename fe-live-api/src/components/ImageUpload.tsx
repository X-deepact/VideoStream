/* eslint-disable @typescript-eslint/no-unused-expressions */
import { Image, Upload, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { Button } from './ui/button';
import { ALLOWED_IMAGE_TYPES, MAX_IMAGE_SIZE_IN_MB } from '@/data/validations';
import DefaultImg from '@/assets/images/video-thumbnail.jpg';

interface ComponentProps {
  isCircle?: boolean;
  isDisabled?: boolean;
  Icon?: JSX.Element;
  width?: string;
  height?: string;
  preview?: string;
  isError?: boolean;
  onFileChange?: (file: File | null) => void;
}

const ImageUpload = (props: ComponentProps): JSX.Element => {
  const {
    Icon,
    isCircle = false,
    width = 'w-32',
    height = 'h-32',
    isError = false,
    preview: initialPreview,
    onFileChange,
    isDisabled = false,
  } = props;

  const [imagePreview, setImagePreview] = useState<string | null>(
    initialPreview || null
  );
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;

    if (file) {
      // check file size
      const fileSizeMB = file.size / (1024 * 1024); // conver to mb
      if (fileSizeMB > MAX_IMAGE_SIZE_IN_MB) {
        setImagePreview(null);
        onFileChange && onFileChange(null);
        return;
      }

      // check file type
      if (ALLOWED_IMAGE_TYPES.includes(file.type)) {
        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result as string);
        reader.readAsDataURL(file);
        onFileChange && onFileChange(file);
      }
    } else {
      setImagePreview(null);
      onFileChange && onFileChange(null);
    }
  };

  const handleImageSelect = () => {
    fileInputRef.current?.click();
  };

  const handleClear = () => {
    setImagePreview(null);
    onFileChange && onFileChange(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  useEffect(() => {
    if (initialPreview) setImagePreview(initialPreview);
  }, [initialPreview]);

  return (
    <div>
      <div
        className={`relative ${width} ${height} ${
          imagePreview
            ? 'cursor-default'
            : onFileChange
            ? 'cursor-pointer'
            : 'cursor-default'
        } border rounded-sm ${
          onFileChange ? 'border-dashed' : 'border-slate-200'
        } flex justify-center items-center overflow-hidden ${
          isError && 'border-red-500'
        } ${isCircle ? 'rounded-full' : 'rounded-sm'} `}
        onClick={
          onFileChange && !isDisabled && !imagePreview
            ? handleImageSelect
            : undefined
        }
      >
        {imagePreview ? (
          <>
            <img
              src={imagePreview || DefaultImg}
              alt="Preview"
              onError={(e) => (e.currentTarget.src = DefaultImg)}
              className={`w-full h-full object-cover ${
                isCircle ? 'rounded-full' : ''
              }`}
            />
            {onFileChange && (
              <Button
                title="Remove"
                type="button"
                onClick={!!onFileChange && !isDisabled ? handleClear : () => {}}
                className="absolute w-6 h-6 top-1 right-1 bg-red-500 p-1 rounded-full border shadow-md hover:shadow-none hover:bg-red-600"
              >
                <X size={14} />
              </Button>
            )}
          </>
        ) : (
          <div
            className={`p-3 flex flex-col justify-center items-center border ${
              isCircle ? 'rounded-full' : 'rounded-md'
            }`}
          >
            {onFileChange ? (
              Icon ? (
                Icon
              ) : (
                <Upload size={18} color="gray" />
              )
            ) : (
              <Image size={18} color="gray" />
            )}
          </div>
        )}
        <input
          type="file"
          accept="image/png, image/jpeg, image/jpg"
          onChange={!!onFileChange && !isDisabled ? handleFileChange : () => {}}
          ref={fileInputRef}
          className="hidden"
        />
      </div>
    </div>
  );
};

export default ImageUpload;
