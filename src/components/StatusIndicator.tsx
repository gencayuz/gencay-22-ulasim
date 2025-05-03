
import { AlertCircle, Bell } from "lucide-react";

type StatusType = "danger" | "warning" | "normal";

interface StatusIndicatorProps {
  status: StatusType;
}

export const StatusIndicator = ({ status }: StatusIndicatorProps) => {
  if (status === "danger") {
    return (
      <span className="flex items-center text-danger">
        <AlertCircle className="h-4 w-4 mr-1" />
        Süresi dolmuş
      </span>
    );
  }
  
  if (status === "warning") {
    return (
      <span className="flex items-center text-amber-500">
        <Bell className="h-4 w-4 mr-1" />
        Son 7 gün
      </span>
    );
  }
  
  return <span className="text-green-600">Geçerli</span>;
};
