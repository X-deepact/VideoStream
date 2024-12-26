import { z } from "zod";
import { Input } from "@/components/ui/input.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import React from "react";
import { Label } from "@/components/ui/label.tsx";
import ImageUpload from "@/components/ui/image-upload.tsx";
import { DateTimePicker } from "@/components/ui/datetime-picker.tsx";
import DataCombobox from "@/components/ui/data-combobox.tsx";

const FormSchema = z.object({
	title: z.string().min(2, {
		message: "Title must be at least 2 characters.",
	}),
	description: z.string()
	.min(2, {
		message: "Description must be at least 2 characters.",
	})
	.max(1000, {
		message: "Description must not longer than 1000 characters.",
	}),
});

const LivestreamCreateNew = ({categories, users}) => {
	const [assignedUser, setAssignedUser] = React.useState("");
	const [category, setCategory] = React.useState("");
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

	function handleThumbnailChanges(file: File) {
		if (!file) {
			setThumbnailImage({ file: null, preview: null });
			return;
		}
		const reader = new FileReader();
		reader.onloadend = () => {
			setThumbnailImage({ file, preview: reader.result as string });
		};
		reader.readAsDataURL(file);
	}

	function handleVideoUpload(file: File) {
		if (!file) {
			setVideoFile({ file: null, name: null });
			return;
		}
		const reader = new FileReader();
		reader.onloadend = () => {
			setVideoFile({ file, name: file.name });
		};
	}

	return (
		<form className="space-y-4">
			{/*title*/}
			<div className="pb-2">
				<Label htmlFor="title">
					Title <span className="text-red-500">*</span>
				</Label>
				<Input id="title" placeholder="Livestream Title" />
			</div>

			{/*description*/}
			<div className="pb-2">
				<Label htmlFor="description">
					Description <span className="text-red-500">*</span>
				</Label>
				<Textarea id="description" placeholder="Livestream Description" />
			</div>

			<div className="grid grid-cols-2 pb-2 gap-2">
				{/*Users*/}
				<DataCombobox
					isRequired={true}
					placeholder="Select User"
					label="Users"
					emptyMsg="No user found"
					data={users}
					onDataChange={setAssignedUser}
				/>

				{/*Categories*/}
				<DataCombobox
					isRequired={true}
					placeholder="Select Category"
					label="Categories"
					emptyMsg="No category found"
					data={categories}
					onDataChange={setCategory}
				/>
			</div>

			{/*Schedule Time*/}
			<div className="pb-2">
				<Label htmlFor="scheduleTime">
					Schedule Time <span className="text-red-500">*</span>
				</Label>
				<DateTimePicker
					width="w-full"
					value={startDate}
					onDateChange={setStartDate}
					placeholder="Start Date"
				/>
			</div>

			<div>
				<div>
					<Label htmlFor="thumbnail">
						Thumbnail Image <span className="text-red-500">*</span>
					</Label>
					<ImageUpload
						width="w-1/2 xl:w-full overflow-hidden"
						height="h-24"
						onFileChange={(file) => {
							if (file) handleThumbnailChanges(file)
						}}
						preview={thumbnailImage.preview || ""}
					/>
				</div>
			</div>
		</form>
	);
};

export default LivestreamCreateNew;