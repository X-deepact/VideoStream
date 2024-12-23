import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button.tsx";
import { Upload, X, Image } from "lucide-react";
import { toast } from "@/hooks/use-toast.ts";

interface ComponentProps {
	isDisabled?: boolean;
	Icon?: JSX.Element;
	width?: string;
	height?: string;
	preview?: string;
	isError?: boolean;
	isUploadVideo?: boolean;
	onFileChange?: (file: File | null) => void;
}

const ALLOWED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/jpg'];
const ALLOWED_VIDEO_TYPES = ['mp4', 'video/mp4'];

const ImageUpload = (props: ComponentProps) => {
	const {
		Icon,
		width = "w-32",
		height = "w-32",
		isError = false,
		preview: initialPreview,
		onFileChange,
		isDisabled = false,
		isUploadVideo = false,
	} = props;

	const [imagePreview, setImagePreview] = useState<string | null>(initialPreview || null);
	const [videoPreview, setVideoPreview] = useState<string | null>();
	const fileInputRef = useRef<HTMLElement | null>(null);
	const handleFileChange =  (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0] || null;

		if (!file) {
			// Reset previews if no file is selected
			setVideoPreview(null);
			setImagePreview(null);
			onFileChange && onFileChange(null);
			return;
		}

		console.log(file.type);

		const allowedTypes = isUploadVideo ? ALLOWED_VIDEO_TYPES : ALLOWED_IMAGE_TYPES;
		const errorMessage = isUploadVideo
			? "Please upload a video in a supported format (e.g., MP4)."
			: "Please upload an image in a supported format (e.g., PNG, JPG, JPEG).";

		if (!allowedTypes.includes(file.type)) {
			toast({
				description: errorMessage
			});
			setVideoPreview(null);
			onFileChange && onFileChange(null);
			return;
		}

		const reader =  new FileReader();
		reader.onloadend = () => setVideoPreview(reader.result as string);
		reader.readAsDataURL(file);
		onFileChange && onFileChange(file);
	}

	useEffect(() => {
		if (initialPreview) setImagePreview(initialPreview)
	}, [initialPreview]);

	const handleImageSelect = () => {
		fileInputRef.current?.click();
	}

	const handleClear = () => {
		setImagePreview(null);
		onFileChange && onFileChange(null);
		if (fileInputRef.current) {
			fileInputRef.current = null;
		}
	}

	return (
		<div>
			<div
				className={
				`relative ${width} ${height} flex justify-center items-center overflow-hidden border rounded-sm
				${imagePreview ? "cursor-default" : onFileChange ? "cursor-pointer" : "cursor-default"}
				${onFileChange ? 'border-dashed' : 'border-b-slate-200'}
				${isError && "border-red-500"}`
			}
				onClick={
					onFileChange && !isDisabled && !imagePreview
						? handleImageSelect
						: undefined
				}
			>
				{
					imagePreview
					? (
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
					)
					: (
						<div className="p-3 flex flex-col justify-center items-center rounded-md border">
							{
								onFileChange ? (
									Icon ? (
										Icon
									) : (
										<Upload size={18} color="gray"/>
									)
								) : (
									<Image size={18} color="gray" />
								)
							}
						</div>
					)
				}

				{

				}
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

export default ImageUpload
