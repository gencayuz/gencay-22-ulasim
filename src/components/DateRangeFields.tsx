
import { DatePickerField } from "./DatePickerField";

interface DateRangeFieldsProps {
  label: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
  onStartDateChange: (date: Date | undefined) => void;
  onEndDateChange: (date: Date | undefined) => void;
  hasErrors?: boolean;
}

export const DateRangeFields = ({
  label,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  hasErrors = false
}: DateRangeFieldsProps) => {
  return (
    <div className="grid grid-cols-4 items-center gap-4">
      <label className="text-right">{label}</label>
      <div className={`col-span-3 grid grid-cols-2 gap-4 ${hasErrors ? 'border-red-500' : ''}`}>
        <DatePickerField
          label="Başlangıç"
          date={startDate}
          onDateChange={onStartDateChange}
          className={hasErrors ? 'border-red-500' : ''}
        />
        <DatePickerField
          label="Bitiş"
          date={endDate}
          onDateChange={onEndDateChange}
          className={hasErrors ? 'border-red-500' : ''}
        />
      </div>
    </div>
  );
};
