
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { tr } from "date-fns/locale";

interface DatePickerFieldProps {
  label: string;
  date?: Date;
  onSelect: (date?: Date) => void;
  className?: string;
}

export const DatePickerField = ({ label, date, onSelect, className }: DatePickerFieldProps) => {
  return (
    <div>
      <label className="text-sm text-muted-foreground">
        {label}
      </label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn("w-full justify-start text-left font-normal mt-1", className)}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "dd.MM.yyyy") : "Tarih seçin"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={date}
            onSelect={onSelect}
            locale={tr}
            className={cn("p-3 pointer-events-auto")}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};
