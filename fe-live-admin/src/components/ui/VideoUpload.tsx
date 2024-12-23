import { useRef, useState } from "react";

interface ComponentProps {
	isDisabled?: boolean;
	Icon?: JSX.Element;
	width?: string;
	height?: string;
	preview?: string;
	isError?: boolean;
	onFileChange?: (file: File | null) => void;
}

const ALLOWED_VIDEO_TYPES = ['mp4'];

export const VideoUpload = (props: ComponentProps) => {
	const {
		Icon,
		width = "w-32",
		height = "w-32",
		isError = false,
		preview: initialPreview,
		onFileChange,
		isDisabled = false,
	} = props;

	const [videoSrc, setVideoSrc] = useState<string | null>(initialPreview || null);
	const fileInputRef = useRef<HTMLElement | null>(null);
	return (
		<></>
	);
};