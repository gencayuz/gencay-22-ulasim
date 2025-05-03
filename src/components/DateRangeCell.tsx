
import { format } from "date-fns";
import { DateRange } from "@/types/license";

interface DateRangeCellProps {
  dateRange?: DateRange;
  status: "danger" | "warning" | "normal";
}

export const DateRangeCell = ({ dateRange, status }: DateRangeCellProps) => {
  if (!dateRange) {
    return (
      <div className="flex flex-col">
        <span className="text-xs text-gray-500">Başlangıç:</span>
        <span>-</span>
        <span className="text-xs text-gray-500 mt-1">Bitiş:</span>
        <span>-</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <span className="text-xs text-gray-500">Başlangıç:</span>
      <span>{format(dateRange.startDate, "dd.MM.yyyy")}</span>
      <span className="text-xs text-gray-500 mt-1">Bitiş:</span>
      <span className={status === "danger" ? "text-danger" : status === "warning" ? "text-amber-500" : ""}>
        {format(dateRange.endDate, "dd.MM.yyyy")}
      </span>
    </div>
  );
};
