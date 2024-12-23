import { z } from "zod";
import { Input } from "@/components/ui/input.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import {
	Popover,
	PopoverContentLayout,
	PopoverTrigger
} from "@/components/ui/popover-content.tsx";
import { Button } from "@/components/ui/button.tsx";
import { CalendarIcon, CheckIcon, ChevronsUpDown } from "lucide-react";
import React from "react";
import {
	Command,
	CommandEmpty, CommandGroup,
	CommandInput, CommandItem, CommandList
} from "@/components/ui/command.tsx";
import { cn } from "@/lib/utils.ts";
import { Label } from "@/components/ui/label.tsx";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar.tsx";
import ImageUpload from "@/components/ui/image-upload.tsx";
import { DateTimePicker } from "@/components/ui/datetime-picker.tsx";

const Users = [
	{
		label: "User 1",
		value: "user1"
	},
	{
		label: "User 2",
		value: "user2"
	},
	{
		label: "User 3",
		value: "user3"
	},
	{
		label: "User 4",
		value: "user4"
	},
	{
		label: "User 5",
		value: "user5"
	},
	{
		label: "User 6",
		value: "user6"
	},
];

const Categories = [
	{
		label: "Sport",
		value: "sport"
	},
	{
		label: "Movie",
		value: "movie"
	},
	{
		label: "Podcast",
		value: "podcast"
	},
	{
		label: "Talkshow",
		value: "talkshow"
	},
	{
		label: "Game",
		value: "game"
	},
]



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

const LivestreamCreateNew = () => {
	const [assignedUser, setAssignedUser] = React.useState("");
	const [openAssignUser, setOpenAssignUser] = React.useState(false);

	const [category, setCategory] = React.useState("");
	const [openCategories, setOpenCategories] = React.useState(false);

	const [startDate, setStartDate] = React.useState<Date>();
	const [endDate, setEndDate] = React.useState<Date>();

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
		console.log(reader);
	}

	function handleVideoUpload(file: File) {
		if (!file) {
			setVideoFile({ file: null, name: null });
			return;
		}
		console.log(file)
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

			{/*Users*/}
			<div className="grid grid-cols-2 pb-2">
			<div>
				<Label htmlFor="description">
					User <span className="text-red-500">*</span>
				</Label>
				<Popover open={openAssignUser} onOpenChange={setOpenAssignUser}>
					<PopoverTrigger asChild>
						<Button
							variant="outline"
							role="combobox"
							aria-expanded={openAssignUser}
							className="w-[250px] justify-between"
						>
							{assignedUser
								? Users.find((user) => user.value === assignedUser)?.label
								: "Select user"}
							<ChevronsUpDown className="opacity-50" />
						</Button>
					</PopoverTrigger>
					<PopoverContentLayout className="w-[250px] p-0">
						<Command>
							<CommandInput placeholder="Search user" />
							<CommandList>
								<CommandEmpty>No User found.</CommandEmpty>
								<CommandGroup>
									{Users.map((user) => (
										<CommandItem
											key={user.value}
											value={user.value}
											onSelect={(currentValue) => {
												setAssignedUser(currentValue === assignedUser ? "" : currentValue);
												setOpenAssignUser(false);
											}}
										>
											{user.label}
											<CheckIcon
												className={cn(
													"mr-2 h-4 w-4",
													assignedUser === user.value ? "opacity-100" : "opacity-0",
												)}
											/>
										</CommandItem>
									))}
								</CommandGroup>
							</CommandList>
						</Command>
					</PopoverContentLayout>
				</Popover>
			</div>

			{/*Categories*/}
			<div>
				<Label htmlFor="description">
					Categories <span className="text-red-500">*</span>
				</Label>
				<Popover open={openCategories} onOpenChange={setOpenCategories}>
					<PopoverTrigger asChild>
						<Button
							variant="outline"
							role="combobox"
							aria-expanded={openAssignUser}
							className="w-[250px] justify-between"
						>
							{assignedUser
								? Users.find((user) => user.value === assignedUser)?.label
								: "Select Category"}
							<ChevronsUpDown className="opacity-50" />
						</Button>
					</PopoverTrigger>
					<PopoverContentLayout className="w-[250px] p-0">
						<Command>
							<CommandInput placeholder="Search Category" />
							<CommandList>
								<CommandEmpty>No Category found.</CommandEmpty>
								<CommandGroup>
									{Categories.map((category) => (
										<CommandItem
											key={category.value}
											value={category.value}
											onSelect={(currentValue) => {
												setCategory(currentValue === assignedUser ? "" : currentValue);
												setOpenCategories(false);
											}}
										>
											{category.label}
											<CheckIcon
												className={cn(
													"mr-2 h-4 w-4",
													assignedUser === category.value ? "opacity-100" : "opacity-0",
												)}
											/>
										</CommandItem>
									))}
								</CommandGroup>
							</CommandList>
						</Command>
					</PopoverContentLayout>
				</Popover>
			</div>
			</div>

			{/*Schedule Time*/}
			<div className="pb-2">
				<Label htmlFor="scheduleTime">
					Schedule Time <span className="text-red-500">*</span>
				</Label>
				<div className="grid grid-cols-2 gap-2">
					<div>
						<DateTimePicker width="w-full" onDateChange={setStartDate} placeholder="Start Date"/>
					</div>
					<div>
						<DateTimePicker width="w-full" onDateChange={setEndDate} placeholder="End Date"/>
					</div>
				</div>
			</div>

			<div className="">
				<div className="">
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