import * as React from "react";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContentLayout,
	PopoverTrigger,
} from "@/components/ui/popover-content.tsx";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface ComponentProps {
	placeholder?: string;
	width?: string;
	isError?: boolean;
	onDateChange?: (date: Date) => void;
	disabled?: boolean;
	value?: Date;
	disableHourAndMinuteSelection?: boolean,
	disableDate?: (date: Date) => boolean; // For adding any custom date disable function
}

export const DateTimePicker = (props: ComponentProps) => {
	const {
		disabled = false,
		placeholder,
		width = "w-full",
		onDateChange,
		value,
		disableHourAndMinuteSelection = false,
		disableDate,
	} = props;
	const [date, setDate] = React.useState<Date | undefined>(value);
	const [isOpen, setIsOpen] = React.useState(false);

	const hours = Array.from({ length: 12 }, (_, i) => i + 1);
	const minutes = Array.from({ length: 60 }, (_, i) => i);

	const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
	const handleDateSelect = (selectedDate: Date | undefined) => {
		if (selectedDate) {
			setDate(selectedDate);
			onDateChange?.(selectedDate);
		}
	};
	const isDateDisabled = (theDate: Date) => {
		if (disableDate?.(theDate)) {
			return true;
		}
		return false;
	};

	const handleTimeChange = (
		type: "hour" | "minute" | "ampm",
		value: string
	) => {
		if (!date) setDate(new Date()); // Initialize if undefined

		const newDate = new Date(date ?? Date.now());

		if (type === "hour") {
			const currentHours = newDate.getHours();
			const isPM = currentHours >= 12;
			newDate.setHours((parseInt(value) % 12) + (isPM ? 12 : 0));
		} else if (type === "minute") {
			newDate.setMinutes(parseInt(value));
		} else if (type === "ampm") {
			const currentHours = newDate.getHours();
			if (value === "PM" && currentHours < 12) {
				newDate.setHours(currentHours + 12);
			} else if (value === "AM" && currentHours >= 12) {
				newDate.setHours(currentHours - 12);
			}
		}
		
		setDate(newDate);		
		onDateChange?.(newDate);
	};

	return (
		<Popover open={isOpen} onOpenChange={setIsOpen}>
			<PopoverTrigger asChild>
				<Button
					disabled={disabled}
					variant="outline"
					className={cn(
						`${width} justify-start text-left font-normal`,
						!date && "text-muted-foreground"
					)}
				>
					<CalendarIcon className="mr-2 h-4 w-4" />
					{date ? (
						new Intl.DateTimeFormat("en-US", {
							timeZone: userTimeZone,
							month: "2-digit",
							day: "2-digit",
							year: "numeric",
							...(disableHourAndMinuteSelection
								? {} // Exclude time if disableTimeSelection is true
								: {
									hour: "2-digit",
									minute: "2-digit",
									hour12: true,
								}),
						}).format(date)
					) : (
						<span>{placeholder}</span>
					)}
				</Button>
			</PopoverTrigger>
			<PopoverContentLayout className="w-auto p-0">
				<div className="sm:flex">
					<Calendar
						mode="single"
						selected={date}
						onSelect={handleDateSelect}
						initialFocus
						disabled={isDateDisabled}
					/>
					{
						!disableHourAndMinuteSelection && (
							<div className="flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x">
								<ScrollArea className="w-64 sm:w-auto">
									<div className="flex sm:flex-col p-2">
										{hours.reverse().map((hour) => (
											<Button
												disabled={!date}
												type="button"
												key={hour}
												size="icon"
												variant={
													date && date.getHours() % 12 === hour % 12
														? "default"
														: "ghost"
												}
												className="sm:w-full shrink-0 aspect-square"
												onClick={() => handleTimeChange("hour", hour.toString())}
											>
												{hour}
											</Button>
										))}
									</div>
									<ScrollBar orientation="horizontal" className="sm:hidden" />
								</ScrollArea>
								<ScrollArea className="w-64 sm:w-auto">
									<div className="flex sm:flex-col p-2">
										{minutes.map((minute) => (
											<Button
												disabled={!date}
												type="button"
												key={minute}
												size="icon"
												variant={
													date && date.getMinutes() === minute
														? "default"
														: "ghost"
												}
												className="sm:w-full shrink-0 aspect-square"
												onClick={() =>
													handleTimeChange("minute", minute.toString())
												}
											>
												{minute}
											</Button>
										))}
									</div>
									<ScrollBar orientation="horizontal" className="sm:hidden" />
								</ScrollArea>
								<ScrollArea className="">
									<div className="flex sm:flex-col p-2">
										{["AM", "PM"].map((ampm) => (
											<Button
												disabled={!date}
												type="button"
												key={ampm}
												size="icon"
												variant={
													date &&
													((ampm === "AM" && date.getHours() < 12) ||
														(ampm === "PM" && date.getHours() >= 12))
														? "default"
														: "ghost"
												}
												className="sm:w-full shrink-0 aspect-square"
												onClick={() => handleTimeChange("ampm", ampm)}
											>
												{ampm}
											</Button>
										))}
									</div>
								</ScrollArea>
							</div>
						)
					}
				</div>
			</PopoverContentLayout>
		</Popover>
	);
}
