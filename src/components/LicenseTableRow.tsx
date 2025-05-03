
import { TableCell, TableRow } from "@/components/ui/table";
import { format, differenceInDays } from "date-fns";
import { LicenseData } from "@/types/license";
import { StatusIndicator } from "./StatusIndicator";
import { DateRangeCell } from "./DateRangeCell";
import { Button } from "./ui/button";
import { getOwnerTypeLabel } from "@/utils/ownerTypeUtils";

interface LicenseTableRowProps {
  item: LicenseData;
  onEdit: (item: LicenseData) => void;
  renderActionButtons?: (record: LicenseData) => React.ReactNode;
}

export const LicenseTableRow = ({ item, onEdit, renderActionButtons }: LicenseTableRowProps) => {
  const getRowStatus = (endDate: Date) => {
    const today = new Date();
    const daysUntilExpiry = differenceInDays(endDate, today);
    
    if (daysUntilExpiry < 0) {
      return "danger"; // Expired
    } else if (daysUntilExpiry <= 7) {
      return "warning"; // Expiring soon
    }
    return "normal"; // Valid
  };
  
  const licenseStatus = getRowStatus(item.endDate);
  const healthStatus = item.healthReport ? getRowStatus(item.healthReport.endDate) : "normal";
  const seatStatus = item.seatInsurance ? getRowStatus(item.seatInsurance.endDate) : "normal";
  const psychoStatus = item.psychotechnic ? getRowStatus(item.psychotechnic.endDate) : "normal";
  
  // Get the most severe status among all documents
  const worstStatus = [licenseStatus, healthStatus, seatStatus, psychoStatus].includes("danger") 
    ? "danger" 
    : [licenseStatus, healthStatus, seatStatus, psychoStatus].includes("warning") 
      ? "warning" 
      : "normal";
      
  return (
    <TableRow 
      key={item.id} 
      className={
        worstStatus === "danger" ? "bg-danger/10" : 
        worstStatus === "warning" ? "bg-warning/30" : ""
      }
    >
      <TableCell>{item.name}</TableCell>
      <TableCell>{getOwnerTypeLabel(item.ownerType)}</TableCell>
      <TableCell>{item.licensePlate}</TableCell>
      <TableCell>{item.phone || "-"}</TableCell>
      <TableCell>{item.vehicleAge}</TableCell>
      <TableCell>{item.criminalRecord === "yes" ? "Var" : "Yok"}</TableCell>
      <TableCell>{item.taxCertificate === "yes" ? "Var" : "Yok"}</TableCell>
      <TableCell>{item.chamberRegistration === "yes" ? "Var" : "Yok"}</TableCell>
      <TableCell>
        <DateRangeCell 
          dateRange={{ 
            startDate: item.startDate, 
            endDate: item.endDate 
          }} 
          status={licenseStatus} 
        />
      </TableCell>
      <TableCell>
        <DateRangeCell 
          dateRange={item.healthReport} 
          status={healthStatus} 
        />
      </TableCell>
      <TableCell>
        <DateRangeCell 
          dateRange={item.seatInsurance} 
          status={seatStatus} 
        />
      </TableCell>
      <TableCell>
        <DateRangeCell 
          dateRange={item.psychotechnic} 
          status={psychoStatus} 
        />
      </TableCell>
      <TableCell>
        <StatusIndicator status={worstStatus} />
      </TableCell>
      <TableCell className="text-right">
        {renderActionButtons ? (
          renderActionButtons(item)
        ) : (
          <Button variant="outline" size="sm" onClick={() => onEdit(item)}>
            Düzenle
          </Button>
        )}
      </TableCell>
    </TableRow>
  );
};
