import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { Button } from "@/components/ui/button.tsx";
import { X, Video, ImageUp } from "lucide-react";
import { toast } from "@/hooks/use-toast.ts";

type UploadMode = "image" | "video" | "both";

interface ComponentProps {
	disabled?: boolean;
	width?: string;
	height?: string;
	preview?: string;
	isError?: boolean;
	isUploadVideo?: boolean;
	mode?: UploadMode
	onFileChange?: (file: File | null) => void;
}

export interface ImageUploadRef {
	clear: () => void;
}

const ALLOWED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/jpg'];
const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/x-flv"];

const getAllowedTypes = (mode: UploadMode) => {
	switch (mode) {
		case "image":
			return ALLOWED_IMAGE_TYPES;
		case "video":
			return ALLOWED_VIDEO_TYPES;
		case "both":
			return [...ALLOWED_IMAGE_TYPES, ...ALLOWED_VIDEO_TYPES];
	}
}

const getAcceptString = (mode: UploadMode) => {
	switch (mode) {
		case "image":
			return "image/png, image/jpeg, image/jpg";
		case "video":
			return "video/mp4, video/x-flv";
		case "both":
			return "image/png, image/jpeg, image/jpg, video/mp4, video/x-flv";
	}
};

const ImageUpload = forwardRef<ImageUploadRef, ComponentProps>((props, ref) => {
	const {
		width = "w-32",
		height = "w-32",
		isError = false,
		preview: initialPreview,
		onFileChange,
		disabled = false,
		mode = "image", // Default to image-only
	} = props;

	const [preview, setPreview] = useState<string | null>(initialPreview || null);
	const [fileType, setFileType] = useState<string | null>(null);

	const fileInputRef = useRef<HTMLInputElement | null>(null);

	const handleFileChange =  (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0] || null;

		if (!file) {
			// Reset previews if no file is selected
			setPreview(null);
			setFileType(null);
			onFileChange?.(null);
			return;
		}

		const allowedTypes = getAllowedTypes(mode as UploadMode);

		if (!allowedTypes.includes(file.type)) {
			toast({
				description: `Please upload a valid file type: ${allowedTypes.join(", ")}.`,
				variant: "destructive"
			});
			onFileChange?.(null);
			return;
		}

		setFileType(file.type);

		if (ALLOWED_IMAGE_TYPES.includes(file.type)) {
			const reader = new FileReader();
			reader.onloadend = () => setPreview(reader.result as string);
			reader.readAsDataURL(file);
		} else {
			const videoURL = URL.createObjectURL(file);
			setPreview(videoURL);
		}

		onFileChange?.(file);
	}

	useEffect(() => {
		if (initialPreview) setPreview(initialPreview)
	}, [initialPreview]);

	useImperativeHandle(ref, () => ({
		clear: handleClear,
	}));

	const handleImageSelect = () => {
		fileInputRef.current?.click();
	}

	const handleClear = () => {
		setPreview(null);
		setFileType(null);
		onFileChange?.(null);
		if (fileInputRef.current && "value" in fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	}

	const DefaultIcon = mode === "video"
		? <Video size={20} color="gray" />
		: <ImageUp size={20} color="gray" />;

	const showImagePreview = preview && fileType && ALLOWED_IMAGE_TYPES.includes(fileType);
	const showVideoPreview = preview && fileType && ALLOWED_VIDEO_TYPES.includes(fileType);

	return (
		<div>
			<div
				className={
					`relative flex justify-center items-center overflow-hidden border rounded-sm ${width} ${height}
				${preview ? "cursor-default" : onFileChange ? "cursor-pointer" : "cursor-default"}
				${onFileChange ? 'border-dashed' : 'border-b-slate-200'}
				${isError && "border-red-500"}`
				}
				onClick={
					onFileChange && !disabled && !preview
						? handleImageSelect
						: undefined
				}
			>
				{
					preview
						? (
							<>
								{/*Image Preview*/}
								{ showImagePreview && (
									<img
										src={preview}
										alt="Preview"
										className="w-full h-full object-cover"
									/>
								)}

								{/*Video Preview*/}
								{ showVideoPreview && (
									<video
										src={preview}
										className="w-full h-full object-cover"
										controls
									>
										Your browser does not support the video tag.
									</video>
								)}

								{/* Clear button */}
								{onFileChange && (
									<Button
										type="button"
										onClick={!!onFileChange && !disabled ? handleClear : undefined}
										className="border shadow-md hover:shadow-none hover:bg-red-600 absolute w-6 h-6 top-1 right-1 bg-red-500 p-1 rounded-full"
									>
										<X size={14} />
									</Button>
								)}
							</>
						)
						: (
							<div className="p-3 flex flex-col justify-center items-center rounded-md border">
								{DefaultIcon}
							</div>
						)
				}
				<input
					type="file"
					accept={getAcceptString(mode as UploadMode)}
					onChange={onFileChange && !disabled ? handleFileChange : undefined}
					ref={fileInputRef}
					className="hidden"
				/>
			</div>
		</div>
	);
})

ImageUpload.displayName = "ImageUpload";
export default ImageUpload;
