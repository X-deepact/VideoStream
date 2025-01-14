/**
 * A generic file upload handler that:
 *  - Reads the file as a data URL.
 *  - Calls a success callback with the file and the data URL.
 *  - Calls a fallback callback if file is null or undefined.
 */
export function FileUpload(
	file: File | null,
	onSuccess: (file: File, result: string) => void,
	onFallback: () => void
) {
	if (!file) {
		onFallback();
		return;
	}

	const reader = new FileReader();
	reader.onloadend = () => {
		onSuccess(file, reader.result as string);
	};
	reader.readAsDataURL(file);
}