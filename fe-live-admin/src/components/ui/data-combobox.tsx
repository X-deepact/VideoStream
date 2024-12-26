import React, { useState } from "react";
import { Label } from "@/components/ui/label.tsx";
import {
	Popover,
	PopoverContentLayout,
	PopoverTrigger
} from "@/components/ui/popover-content.tsx";
import { Button } from "@/components/ui/button.tsx";
import { CheckIcon, ChevronsUpDown } from "lucide-react";
import {
	Command, CommandEmpty, CommandGroup,
	CommandInput, CommandItem,
	CommandList
} from "@/components/ui/command.tsx";
import { cn } from "@/lib/utils.ts";

interface ComponentProps {
	isDisabled?: boolean;
	isRequired?: boolean;
	placeholder?: string;
	emptyMsg?: string;
	label?: string;
	data?: {label: string; value: string}[];
	onDataChange?: (value: string) => void;
}


const DataCombobox = (props: ComponentProps) => {
	const {
		isDisabled = false,
		isRequired = false,
		placeholder = "Select Item",
		label = "Combobox Generic Component",
		data = [],
		emptyMsg = "No Item found",
		onDataChange
	} = props;


	const [selectedValue, setSelectedValue] = useState("");
	const [openPopover, setOpenPopover] = useState(false);

	const handleDataChange = (value: string) => {
		setSelectedValue(value);
		onDataChange && onDataChange(value);
	}

	function ComboboxLabel({label, isRequired}) {
		if (isRequired) {
			return (
				<Label>
					{label} <span className="text-red-500" >*</span>
				</Label>
			)
		}
		return (
			<Label>{label}</Label>
		)
	}

	return (
		<div>
			<ComboboxLabel isRequired={isRequired} label={label} />
			<Popover open={openPopover} onOpenChange={setOpenPopover}>
				<PopoverTrigger asChild>
					<Button
						disabled={isDisabled}
						variant="outline"
						role="combobox"
						aria-expanded={openPopover}
						className="w-full justify-between"
					>
						{
							selectedValue
								? data.find((d) => d.value === selectedValue)?.label
								: placeholder
						}
						<ChevronsUpDown className="opacity-50" />
					</Button>
				</PopoverTrigger>
				<PopoverContentLayout className="w-[250px] p-0">
					<Command>
						<CommandInput placeholder={placeholder} />
						<CommandList>
							<CommandEmpty>{emptyMsg}</CommandEmpty>
							<CommandGroup>
								{
									data.map((d) => (
										<CommandItem
											key={d.value}
											value={d.value}
											onSelect={(currentValue) => {
												handleDataChange(currentValue === selectedValue ? "" : currentValue);
												setOpenPopover(false);
											}}
										>
											{d.label}
											<CheckIcon
												className={cn(
													"mr-2 h-4 w-4",
													selectedValue === d.value ? "opacity-100" : "opacity-0",
												)}
											/>
										</CommandItem>
									))
								}
							</CommandGroup>
						</CommandList>
					</Command>
				</PopoverContentLayout>
			</Popover>
		</div>
	);
};

export default DataCombobox;