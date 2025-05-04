
import { TableCell, TableRow } from "@/components/ui/table";
import { format, differenceInDays } from "date-fns";
import { LicenseData } from "@/types/license";
import { StatusIndicator } from "./StatusIndicator";
import { DateRangeCell } from "./DateRangeCell";
import { Button } from "./ui/button";
import { getOwnerTypeLabel } from "@/utils/ownerTypeUtils";
import { Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface LicenseTableRowProps {
  item: LicenseData;
  onEdit: (item: LicenseData) => void;
  renderActionButtons?: (record: LicenseData) => React.ReactNode;
  plateType?: string; // Add plateType prop
}

export const LicenseTableRow = ({ item, onEdit, renderActionButtons, plateType }: LicenseTableRowProps) => {
  const getRowStatus = (endDate: Date) => {
    // If record is inactive, return normal status regardless of dates
    if (item.active === false) {
      return "normal";
    }
    
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
        item.active === false ? "" :
        worstStatus === "danger" ? "bg-danger/10" : 
        worstStatus === "warning" ? "bg-warning/30" : ""
      }
    >
      <TableCell>{item.name}</TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          {getOwnerTypeLabel(item.ownerType)}
          {item.active === false && (
            <Badge variant="outline" className="text-xs bg-gray-100">
              Pasif
            </Badge>
          )}
        </div>
      </TableCell>
      <TableCell>{item.licensePlate}</TableCell>
      <TableCell>{item.phone || "-"}</TableCell>
      <TableCell>{item.vehicleAge}</TableCell>
      <TableCell>{item.criminalRecord === "yes" ? "Var" : "Yok"}</TableCell>
      <TableCell>{item.taxCertificate === "yes" ? "Var" : "Yok"}</TableCell>
      <TableCell>{item.penaltyPoints === "yes" ? "Var" : "Yok"}</TableCell>
      <TableCell>{item.chamberRegistration === "yes" ? "Var" : "Yok"}</TableCell>
      <TableCell>{item.sgkServiceList === "yes" ? "Var" : "Yok"}</TableCell>
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
      {/* Only show seat insurance column if NOT T Plaka */}
      {plateType !== "J" && (
        <TableCell>
          <DateRangeCell 
            dateRange={item.seatInsurance} 
            status={seatStatus} 
          />
        </TableCell>
      )}
      <TableCell>
        <DateRangeCell 
          dateRange={item.psychotechnic} 
          status={psychoStatus} 
        />
      </TableCell>
      <TableCell>
        <StatusIndicator status={item.active === false ? "normal" : worstStatus} />
      </TableCell>
      <TableCell className="text-right">
        {renderActionButtons ? (
          renderActionButtons(item)
        ) : (
          <Button variant="outline" size="sm" onClick={() => onEdit(item)}>
            <Pencil className="h-4 w-4 mr-1" />
            Düzenle
          </Button>
        )}
      </TableCell>
    </TableRow>
  );
};
