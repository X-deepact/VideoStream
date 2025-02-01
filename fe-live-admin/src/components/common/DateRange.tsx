import { format } from 'date-fns';
import { useState, useEffect } from 'react';
import { DateRange } from 'react-day-picker';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';

interface DatePickerWithRangeProps {
  disabled?: boolean;
  dateRange?: { from: Date; to: Date };
  onChange?: (dateRange: { from: Date; to: Date } | undefined) => void;
}

export function DatePickerWithRange({
  disabled,
  dateRange,
  onChange,
}: DatePickerWithRangeProps) {
  const [date, setDate] = useState<{ from: Date; to: Date } | undefined>(
    dateRange
  );

  useEffect(() => {
    if (dateRange) setDate(dateRange);
  }, [dateRange]);

  const handleDateChange = (dateRange: DateRange | undefined) => {
    const newDateRange =
      dateRange?.from && dateRange?.to
        ? { from: dateRange?.from, to: dateRange?.to }
        : undefined;
    setDate(newDateRange);
    onChange?.(newDateRange);
  };

  return (
    <div className="grid gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            disabled={disabled}
            id="date"
            variant="outline"
            className={cn(
              'w-[250px] justify-start text-left font-normal opacity-80',
              !date && 'opacity-80'
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, 'LLL dd, y')} -{' '}
                  {format(date.to, 'LLL dd, y')}
                </>
              ) : (
                format(date.from, 'LLL dd, y')
              )
            ) : (
              <span>Pick a date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleDateChange}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
