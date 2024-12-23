import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList, BreadcrumbPage,
	BreadcrumbSeparator
} from "@/components/ui/breadcrumb.tsx";
import { Search, Slash, SlidersHorizontal, Rss } from "lucide-react";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import {
	Dialog, DialogClose,
	DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
	DialogTrigger
} from "@/components/ui/dialog.tsx";
import { Label } from "@/components/ui/label.tsx";
import {
	Select,
	SelectContent, SelectGroup, SelectItem, SelectLabel,
	SelectTrigger,
	SelectValue
} from "@/components/ui/select.tsx";
import { useEffect, useState } from "react";
import { DateTimePicker } from "@/components/ui/datetime-picker.tsx";
import LivestreamList
	from "@/components/livestream-management/LivestreamList.tsx";
import LivestreamCreateNew
	from "@/components/livestream-management/LivestreamCreateNew.tsx";
import { getLivestreamSessionList } from "@/services/livestream-session.service.ts";
import { toast } from "@/hooks/use-toast.ts";
import { LivestreamSession } from "@/lib/interface.tsx";

const LivestreamSessions = () => {
	const [openFilterDialog, setOpenFilterDialog] = useState(false);
	const [openCreateNewDialog, setOpenCreateNewDialog] = useState(false);
	const [type, setType] = useState("");
	const [status, setStatus] = useState("");
	const [startDate, setStartDate] = useState<Date | undefined>(undefined);
	const [endDate, setEndDate] = useState<Date | undefined>(undefined);
	const [isLoading, setIsLoading] = useState(false);
	const [data, setData] = useState<LivestreamSession[]>([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [totalItems, setTotalItems] = useState(0);
	const [itemLength, setItemLength] = useState(0);

	useEffect(() => {
		fetchLivestream(currentPage);
	}, [currentPage]);

	const fetchLivestream = async (
		page,
	) => {
		if (isLoading) {
			return;
		}
		setIsLoading(true);
		try {
			const response = await getLivestreamSessionList(page);
			const { data } = response.data;

			setData(data.page);
			setItemLength(data.page.length);
			setTotalPages(Math.ceil(data.total_items / data.page_size));
			setTotalItems(data.total_items);
		} catch (e) {
			alert({
				message: e.message
			})
		} finally {
			setIsLoading(false);
		}
	}


	return (
		<div className="px-8">
			<div className="py-4">
				<Breadcrumb>
					<BreadcrumbList>
						<BreadcrumbItem>
							<BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator>
							<Slash />
						</BreadcrumbSeparator>
						<BreadcrumbItem>
							<BreadcrumbPage>Livestream Sessions</BreadcrumbPage>
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>
			</div>

			{/*Filter Dialog, Create new Stream Dialog and Search Bar*/}
			<div className="mt-5 flex flex-row justify-between">
				<div className="flex flex-row gap-4">

					{/*New Stream Dialog*/}
					<Dialog open={openCreateNewDialog} onOpenChange={setOpenCreateNewDialog}>
						<DialogTrigger asChild>
							<Button variant="outline">
								<Rss />
								New Stream
							</Button>
						</DialogTrigger>
						<DialogContent className="sm:max-w-[600px]">
							<DialogHeader>
								<DialogTitle className="text-xl">
									Create Stream
								</DialogTitle>
								<DialogDescription>
									Fill following information to start creating new stream
								</DialogDescription>
							</DialogHeader>
							<div>
								<LivestreamCreateNew />
							</div>
							<DialogFooter className="justify-end">
								<DialogClose asChild>
									<Button type="button" variant="secondary">
										Close
									</Button>
								</DialogClose>
								<Button type="submit">
									Create
								</Button>
							</DialogFooter>
						</DialogContent>
					</Dialog>

					<Input
						className="w-[40rem]"
						placeholder="Search Livestream"
					/>
					<Button>
						<Search />
						Search
					</Button>
				</div>
				<div>
					<Dialog open={openFilterDialog} onOpenChange={setOpenFilterDialog}>
						<DialogTrigger asChild>
							<Button variant="outline">
								<SlidersHorizontal />
								Filter
							</Button>
						</DialogTrigger>
						<DialogContent className="sm:max-w-[425px]">
							<DialogHeader>
								<DialogTitle>Filters</DialogTitle>
							</DialogHeader>
							<div className="grid gap-4 py-4">
								<div className="grid grid-cols-3 items-center gap-4">
									<Label htmlFor="status" className="text-left">Status</Label>
									<Select id="status" value={status} onValueChange={setStatus}>
										<SelectTrigger className="col-span-2">
											<SelectValue placeholder="Livestream Type" />
										</SelectTrigger>
										<SelectContent>
											<SelectGroup>
												<SelectLabel>Status</SelectLabel>
												<SelectItem value="streaming">Streaming</SelectItem>
												<SelectItem value="schedule">Scheduled</SelectItem>
											</SelectGroup>
										</SelectContent>
									</Select>
								</div>
								<div className="grid grid-cols-3 items-center gap-4">
									<Label htmlFor="status" className="text-left">Status</Label>
									<Select id="category" value={type} onValueChange={setType}>
										<SelectTrigger className="col-span-2">
											<SelectValue placeholder="Select Status" />
										</SelectTrigger>
										<SelectContent>
											<SelectGroup>
												<SelectLabel>Category</SelectLabel>
												<SelectItem value="movie">Movie</SelectItem>
												<SelectItem value="game">Game</SelectItem>
												<SelectItem value="talkshow">Talk Show</SelectItem>
											</SelectGroup>
										</SelectContent>
									</Select>
								</div>
								<div className="grid grid-cols-3 items-center gap-4">
									<Label htmlFor="startTime" className="text-left">Start Time</Label>
									<DateTimePicker
										id="startTime"
										value={startDate}
										onDateChange={setStartDate}
										className="col-span-2"
									/>
								</div>

								<div className="grid grid-cols-3 items-center gap-4">
									<Label htmlFor="endTime" className="text-left">End Time</Label>
									<DateTimePicker
										width="w-full"
										id="endTime"
										value={endDate}
										onDateChange={setEndDate}
										className="col-span-2"
									/>
								</div>
							</div>
						</DialogContent>
					</Dialog>
				</div>
			</div>

			<div className="mt-10 mb-4 w-full m-auto items-center flex justify-between">
				<div>
					<label htmlFor="page-input" className="mr-2 text-lg font-bold">
						Page
					</label>
					<input
						id="page-input"
						type="number"
						min="1"
						max={totalPages}
						value={currentPage}
						onChange={(e) => {
							const page = Math.max(
								1,
								Math.min(totalPages, Number(e.target.value))
							);
							setCurrentPage(page);
						}}
						className="text-center border rounded"
					/>
					<span className="ml-2 text-lg font-bold">of {totalPages} on showing {itemLength} of total {totalItems} livestreams.</span>
				</div>
				<div className="space-x-2">
					<Button
						size="lg"
						variant="outline"
						className="px-4 py-2"
						onClick={() => setCurrentPage(currentPage - 1)}
						disabled={currentPage === 1}
					>
						&laquo;
					</Button>
					<Button
						size="lg"
						variant="outline"
						className="px-4 py-2"
						onClick={() => setCurrentPage(currentPage + 1)}
						disabled={currentPage === totalPages}
					>
						&raquo;
					</Button>
				</div>
			</div>

			{/*livestream session list*/}
			{
				data.length > 0
				?
				data.map((livestream: LivestreamSession) => (
					<LivestreamList
						key={livestream.id}
						livestream={livestream}
					/>
				))
				: <div>No Result</div>
			}
		</div>
	);
};

export default LivestreamSessions;