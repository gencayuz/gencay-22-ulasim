
import { DatePickerField } from "./DatePickerField";

interface DateRangeFieldsProps {
  label: string;
  startDate?: Date;
  endDate?: Date;
  onStartDateChange: (date?: Date) => void;
  onEndDateChange: (date?: Date) => void;
}

export const DateRangeFields = ({
  label,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange
}: DateRangeFieldsProps) => {
  return (
    <div className="grid grid-cols-4 items-center gap-4">
      <label className="text-right font-medium">
        {label}
      </label>
      <div className="col-span-3 grid grid-cols-2 gap-4">
        <DatePickerField
          label="Başlangıç"
          date={startDate}
          onSelect={onStartDateChange}
        />
        <DatePickerField
          label="Bitiş"
          date={endDate}
          onSelect={onEndDateChange}
        />
      </div>
    </div>
  );
};
