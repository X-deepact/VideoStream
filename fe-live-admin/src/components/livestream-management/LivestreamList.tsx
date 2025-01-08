import { Separator } from "@/components/ui/separator.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { Play, FileSliders, CircleStop, Copy } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { LIVESTREAM_STATUS } from "@/lib/interface.tsx";
import { formatDate } from "@/lib/date-formated.ts";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from "@/components/ui/dialog.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Input } from "@/components/ui/input.tsx";
import { toast } from "@/hooks/use-toast.ts";
import ImageWithAuth from "@/components/ui/imagewithauth.tsx";
import { useState } from "react";
import { endLivestreamSession } from "@/services/livestream-session.service.ts";
import { TOAST_STYLES } from "@/components/ui/toast.tsx";

const LivestreamList = ({livestream}) => {
	const {
		title,
		description,
		user,
		started_at,
		ended_at,
		status,
		broadcast_url,
		thumbnail_file_name
	} = livestream;

	const [showEndDialog, setShowEndDialog] = useState(false);

	const handleCopyURL = () => {
		if (navigator.clipboard) {
			navigator.clipboard.writeText(broadcast_url)
			.then(() => {
				toast({
					description: "URL successfully copied to clipboard!"
				})
			})
			.catch((error) => {
				toast({
					description: "Failed to copy URL. Please try again!",
					variant: "destructive"
				})
			})
		}
	}

	const handleEndLive = async () => {
		try {
			const response = await endLivestreamSession(livestream.id);
			
			if (response.status === 200) {
				toast({
					description: "Stream ended successfully",
					variant: "default",
					className: TOAST_STYLES.SUCCESS
				});
			} else if (response.status === 202) {
				toast({
					description: "Stream is already being ended, please wait",
					variant: "default",
					className: TOAST_STYLES.SUCCESS
				});
			}
		} catch (error) {
			toast({
				description: "Failed to end stream. Please try again!",
				variant: "destructive",
			});
		} finally {
			setShowEndDialog(false);
		}
	};

	return (
		<div className="w-full mt-5">
			<Separator />
			<div className="grid grid-cols-3 xl:grid-cols-6 mt-4">
				<div className="w-[80%] relative pt-[56.25%]">
					<ImageWithAuth
						className="absolute top-0 left-0 w-full h-full object-cover"
						url={thumbnail_file_name}
					/>
				</div>
				<div className="col-span-1 xl:col-span-4 flex flex-col text-left">
					<div className="font-semibold text-2xl">{title}</div>
					<div className="text-gray-500 text-sm">
						{started_at && `Started at ${formatDate(started_at, true)} -`} {ended_at && `Ended at ${formatDate(ended_at, true)}`}
					</div>
					<div className="text-sm py-2">{user && user.display_name}</div>
					<div className="text-sm">{description}</div>

					<div className="pt-2 flex flex-row gap-2">
						<Dialog>
							<DialogTrigger asChild>
								<Button variant="outline">View URL</Button>
							</DialogTrigger>
							<DialogContent className="sm:max-w-md">
								<DialogHeader>
									<DialogTitle>Livestream Link</DialogTitle>
									<DialogDescription>
										Link directly to the stream
									</DialogDescription>
								</DialogHeader>
								<div className="flex items-center space-x-2">
									<div className="grid flex-1 gap-2">
										<Label htmlFor="link" className="sr-only">
											Link
										</Label>
										<Input
											id="link"
											defaultValue={broadcast_url}
											readOnly
										/>
									</div>
									<Button
										size="sm"
										className="px-3"
										onClick={handleCopyURL}
									>
										<span className="sr-only">Copy</span>
										<Copy />
									</Button>
								</div>
							</DialogContent>
						</Dialog>
						{
							status === LIVESTREAM_STATUS.STREAMING && (
								<>
									<Button variant="destructive">
										<CircleStop /> End Stream
									</Button>
								</>
							)
						}
						{
							status === LIVESTREAM_STATUS.NOT_STARTED && (
								<>
									<Button variant="outline">
										<FileSliders /> Configuration
									</Button>
								</>
							)
						}
						<Button>
							<Play /> Preview
						</Button>
						<Dialog open={showEndDialog} onOpenChange={setShowEndDialog}>
							<DialogTrigger asChild>
								<Button variant="destructive">
									<CircleStop /> End Live
								</Button>
							</DialogTrigger>
							<DialogContent className="sm:max-md">
								<DialogHeader>
									<DialogTitle className="text-red-500">End Live Stream: Are You Sure?</DialogTitle>
									<DialogDescription className="text-gray-600">
									Ending this live stream will immediately stop the broadcast. The viewer count and live status will reset, and the streamer will be notified. Ensure this action is intentional, as it cannot be undone.
									</DialogDescription>
								</DialogHeader>
								<div className="flex justify-end gap-3 mt-4">
									<Button variant="outline" onClick={() => setShowEndDialog(false)}>
										Cancel
									</Button>
									<Button variant="destructive" onClick={handleEndLive}>
										Confirm to End
									</Button>
								</div>
							</DialogContent>
						</Dialog>
					</div>
				</div>
				<div className="ml-auto mr-0">
					<Badge className="text-sm">{status && status.toString().toUpperCase()}</Badge>
				</div>
			</div>
		</div>
	);
}

export default LivestreamList;