import { useState } from "react";
import {
  Popover,
  PopoverContentLayout,
  PopoverTrigger,
} from "@/components/ui/popover-content.tsx";
import { Button } from "@/components/ui/button.tsx";
import { CheckIcon, ChevronsUpDown, XCircle } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command.tsx";
import { cn } from "@/lib/utils.ts";
import { Badge } from "@/components/ui/badge.tsx";
import { Separator } from "@/components/ui/separator.tsx";

interface ComponentProps {
  disabled?: boolean;
  placeholder?: string;
  emptyMsg?: string;
  data: {
    label: string;
    value: string;
  }[];
  onValueChange: (value: string[]) => void;
  allowAllSelection?: boolean;
  maxSelection?: number;
  popOverClass?: string;
  value?: string[];
  isPreviewing?: boolean;
}

const MultipleCombobox = (props: ComponentProps) => {
  const {
    disabled = false,
    placeholder = "Select Item",
    emptyMsg = "No Item Found",
    onValueChange,
    data = [],
    allowAllSelection = false,
    maxSelection = 3,
    popOverClass,
    value,
    isPreviewing = false,
  } = props;

  const [selectedValues, setSelectedValues] = useState<string[]>(value ?? []);
  const [openPopover, setOpenPopover] = useState(false);

  const handleClear = () => {
    setSelectedValues([]);
    onValueChange([]);
  };

  const toggleOption = (option: string) => {
    if (
      selectedValues.length === maxSelection &&
      !selectedValues?.includes(option)
    ) {
      return;
    }

    const newSelectedValues = selectedValues.includes(option)
      ? selectedValues.filter((value) => value !== option)
      : [...selectedValues, option];
    setSelectedValues(newSelectedValues);
    onValueChange(newSelectedValues);
  };

  const toggleAll = () => {
    if (selectedValues.length === data.length) {
      handleClear();
      return;
    }
    const allValues = data.map((option) => option.value);
    setSelectedValues(allValues);
    onValueChange(allValues);
  };

  return (
    <div>
      <Popover open={openPopover} onOpenChange={setOpenPopover}>
        <PopoverTrigger asChild>
          <Button
            role="combobox"
            disabled={disabled}
            variant="outline"
            className="flex w-full rounded-md border min-h-10 h-auto items-center justify-between bg-inherit hover:bg-inherit [&_svg]:pointer-events-auto shadow-none"
          >
            {selectedValues.length > 0 ? (
              <div className="flex justify-between items-center w-full">
                <div className="flex flex-wrap items-center gap-1">
                  {selectedValues.slice(0, maxSelection).map((value) => {
                    const option = data.find((d) => d.value === value);
                    return (
                      <Badge variant="outline" key={option?.label}>
                        {option?.label}
                        <XCircle
                          className="ml-2 h-4 w-4 cursor-pointer"
                          onClick={(event) => {
                            event.stopPropagation();
                            toggleOption(value);
                          }}
                        />
                      </Badge>
                    );
                  })}
                  {!isPreviewing && selectedValues.length < maxSelection && (
                    <Badge>
                      {`+ ${maxSelection - selectedValues.length} more`}
                    </Badge>
                  )}
                </div>
              </div>
            ) : (
              <div>{placeholder}</div>
            )}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContentLayout className={popOverClass}>
          <Command>
            <CommandInput placeholder={placeholder} />
            <CommandList>
              <CommandEmpty>{emptyMsg}</CommandEmpty>
              <CommandGroup>
                {allowAllSelection && !maxSelection && (
                  <CommandItem
                    key="all"
                    className="cursor-pointer"
                    onSelect={toggleAll}
                  >
                    <div
                      className={cn(
                        "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                        selectedValues.length === data.length
                          ? "bg-primary text-primary-foreground"
                          : "opacity-50 [&_svg]:invisible"
                      )}
                    >
                      <CheckIcon className="h-4 w-4" />
                    </div>
                    <span>(Select All)</span>
                  </CommandItem>
                )}
                {data.map((data) => {
                  const isSelected = selectedValues.includes(data.value);
                  return (
                    <CommandItem
                      key={data.value}
                      value={data.label}
                      onSelect={() => toggleOption(data.value)}
                      className="cursor-pointer"
                    >
                      <div
                        className={cn(
                          "mr-2 flex h-4 w-4 items-center justify-center rounded-[4px] border border-primary",
                          isSelected
                            ? "bg-primary text-primary-foreground"
                            : "opacity-50 [&_svg]:invisible"
                        )}
                      >
                        <CheckIcon className="h-4 w-4" />
                      </div>
                      <span>{data.label}</span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup>
                <div className="flex items-center justify-between">
                  {selectedValues.length > 0 && (
                    <>
                      <CommandItem
                        onSelect={handleClear}
                        className="flex-1 justify-center cursor-pointer"
                      >
                        Clear All
                      </CommandItem>
                      <Separator
                        orientation="vertical"
                        className="flex min-h-6 h-full"
                      />
                    </>
                  )}
                </div>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContentLayout>
      </Popover>
    </div>
  );
};

export default MultipleCombobox;
