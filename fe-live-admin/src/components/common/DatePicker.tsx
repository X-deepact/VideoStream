import * as React from 'react';
import { format } from 'date-fns';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';

interface ComponentProps {
  selectedDate: Date;
  onDateSelect: (date: Date | undefined) => void;
}

const DatePicker = React.forwardRef((props: ComponentProps) => {
  const { selectedDate, onDateSelect } = props;

  const [date, setDate] = React.useState<Date | undefined>(selectedDate);

  const handleDateSet = (date: Date | undefined): void => {
    setDate(date);
    onDateSelect(date);
  };

  const currentDate = new Date();
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn(
            'justify-start text-left font-normal',
            !date && 'text-muted-foreground'
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {/* {selectedDate ? format(selectedDate, 'PPP') : <span>Pick a date</span>} */}
          {date ? format(date, 'PPP') : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          // fromMonth={new Date(1990, 0)}
          toYear={currentYear}
          toMonth={currentDate}
          selected={selectedDate}
          onSelect={handleDateSet}
          initialFocus
          defaultMonth={new Date(currentYear, currentMonth)}
          // footer={
          //   <div className="flex justify-center mt-3">
          //     <Button size="sm" className="rounded-full" onClick={() => handleDateSet(date)}>
          //       Choose
          //     </Button>
          //   </div>
          // }
        />
      </PopoverContent>
    </Popover>
  );
});

export default DatePicker;
