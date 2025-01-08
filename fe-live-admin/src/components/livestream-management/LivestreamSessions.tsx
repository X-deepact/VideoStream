import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList, BreadcrumbPage,
	BreadcrumbSeparator
} from "@/components/ui/breadcrumb.tsx";
import { Slash, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import {
	Dialog,
	DialogContent, DialogHeader, DialogTitle,
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
import { AccountProps, Catalogue, LIVESTREAM_STATUS, LivestreamSession } from "@/lib/interface.tsx";
import { getCategories } from "@/services/category.service.ts";
import { getAccountListWithRole } from "@/services/user.service.ts";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area.tsx";

const LivestreamSessions = () => {
	const [openFilterDialog, setOpenFilterDialog] = useState(false);
	
	//Filters
	const [streamType, setStreamType] = useState("");
	const [status, setStatus] = useState<string[]>(["started", "upcoming"]);
	const [startDate, setStartDate] = useState<Date | undefined>(undefined);
	const [endDate, setEndDate] = useState<Date | undefined>(undefined);
	const [categories, setCategories] = useState<{
		label: string,
		value: string
	}[]>([]);
	const [users, setUsers] = useState<{
		label: string,
		value: string
	}[]>([]);

	//Livestream Data
	const [isLoading, setIsLoading] = useState(false);
	const [data, setData] = useState<LivestreamSession[]>([]);

	//Pagination
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [totalItems, setTotalItems] = useState(0);
	const [itemLength, setItemLength] = useState(0);

	//Search
	const [title, setTitle] = useState("");

	useEffect(() => {
		fetchLivestream();
	}, [currentPage, streamType, status, startDate, endDate]);

	useEffect(() => {
		fetchCategories();
		fetchUsers();
	}, []);

	const fetchLivestream = async () => {
		if (isLoading) {
			return;
		}
		setIsLoading(true);
		try {
			const options = [];
			if (streamType) options.push(`catalog=${streamType}`);
			if (status) status.map((s) => options.push(`status=${s}`));
			if (title) options.push(`keyword=${title}`);
			const response = await getLivestreamSessionList(currentPage, options);
			const { data } = response.data;

			setData(data.page ?? []);
			setItemLength(data.page?.length ?? 0);
			setTotalPages(data.total_items ? Math.ceil(data.total_items / data.page_size) : 0);
			setTotalItems(data.total_items ?? 0);
		} catch (e) {
			toast({
				description: e.message,
				variant: "destructive"
			})
		} finally {
			setIsLoading(false);
		}
	}

	const fetchCategories = async () => {
		try {
			const response = await getCategories();
			const { data } = response.data;
			const transformData = data.map((category: Catalogue) => {
				return {
					label: category.name,
					value: String(category.id)
				}
			});

			setCategories(transformData);
		} catch (e) {
			toast({
				description: e.message,
				variant: "destructive"
			})
		}
	}

	const fetchUsers = async () => {
		try {
			const response = await getAccountListWithRole("streamer");
			const { data } = response.data;
			const transformData = data.page.map((user: AccountProps) => {
				return {
					label: user.username,
					value: String(user.id)
				}
			})

			setUsers(transformData);
		} catch (e) {
			toast({
				description: e.message,
				variant: "destructive"
			})
		}
	}
	
	const handleSearchStream = async (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			e.preventDefault();
			setCurrentPage(1); // Reset to first page every time you do a new search
			await fetchLivestream();
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
					<LivestreamCreateNew
						categories={categories}
						users={users}
						onReset={fetchLivestream}
					/>

					<Input
						className="w-[40rem]"
						placeholder="Search Livestream"
						value={title}
						onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value) }
						onKeyDown={handleSearchStream}
					/>
				</div>

				{/*Filter Stream Dialog*/}
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
									<Select
										id="status"
										value={status.length === 2 ? "" : status[0]}
										onValueChange={(value) => {
											const newValue = value.split(",").filter(Boolean);
											setStatus(newValue)
											setCurrentPage(1)
											setOpenFilterDialog(false)
										}}
									>
										<SelectTrigger className="col-span-2">
											<SelectValue placeholder="Select Status" />
										</SelectTrigger>
										<SelectContent>
											<SelectGroup>
												<SelectLabel>Status</SelectLabel>
												<SelectItem value={LIVESTREAM_STATUS.STARTED}>Started</SelectItem>
												<SelectItem value={LIVESTREAM_STATUS.UPCOMING}>Upcoming</SelectItem>
											</SelectGroup>
										</SelectContent>
									</Select>
								</div>
								<div className="grid grid-cols-3 items-center gap-4">
									<Label htmlFor="category" className="text-left">Category</Label>
									<Select
										id="category"
										value={streamType}
										onValueChange={(value) => {
											setStreamType(value)
											setCurrentPage(1)
											setOpenFilterDialog(false)
										}}
									>
										<SelectTrigger className="col-span-2">
											<SelectValue placeholder="Select Category" />
										</SelectTrigger>
										<SelectContent>
											<SelectGroup>
												<SelectLabel>Category</SelectLabel>
												{categories.map((category) => {
													return (
														<SelectItem key={category.label} value={category.label}>
															{category.label}
														</SelectItem>
													)
												})}
											</SelectGroup>
										</SelectContent>
									</Select>
								</div>
							</div>
						</DialogContent>
					</Dialog>
				</div>
			</div>

			<div className="mt-10 mb-4 w-full m-auto items-center flex justify-between">
				<div className="flex flex-row">
					<Label htmlFor="page-input" className="mr-2 text-lg font-bold">
						Page
					</Label>
					<Input
						className="text-center w-auto bg-white text-black"
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
			<ScrollArea className="w-auto h-[60rem]">
				{
					data.length > 0
						?
						data.map((livestream: LivestreamSession) => (
							<div className="pr-5">
								<LivestreamList
									key={livestream.id}
									livestream={livestream}
								/>
							</div>
						)) : (<div>No Result</div>)
				}
				<ScrollBar orientation="vertical" />
			</ScrollArea>
		</div>
	);
};

export default LivestreamSessions;