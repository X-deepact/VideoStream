/* eslint-disable @typescript-eslint/no-unused-expressions */
import { Image, Upload, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { Button } from './ui/button';

interface ComponentProps {
  isDisabled?: boolean;
  Icon?: JSX.Element;
  width?: string;
  height?: string;
  preview?: string;
  isDanger?: boolean;
  onFileChange?: (file: File | null) => void;
}

const ALLOWED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/jpg'];

const ImageUpload = (props: ComponentProps): JSX.Element => {
  const {
    Icon,
    width = 'w-32',
    height = 'h-32',
    isDanger = false,
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

    if (file && ALLOWED_IMAGE_TYPES.includes(file.type)) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
      onFileChange && onFileChange(file);
    } else {
      alert('Please upload a file in PNG, JPG, or JPEG format.');
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
          isDanger && 'border-red-500'
        }`}
        onClick={
          onFileChange && !isDisabled && !imagePreview
            ? handleImageSelect
            : undefined
        }
      >
        {imagePreview ? (
          <>
            <img
              src={imagePreview}
              alt="Preview"
              className="w-full h-full object-cover"
            />
            {onFileChange && (
              <Button
                type="button"
                onClick={!!onFileChange && !isDisabled ? handleClear : () => {}}
                className="absolute w-6 h-6 top-1 right-1 bg-red-500 p-1 rounded-full border shadow-md hover:shadow-none hover:bg-red-600"
              >
                <X size={14} />
              </Button>
            )}
          </>
        ) : (
          <div className="p-3 flex flex-col justify-center items-center rounded-md border">
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
