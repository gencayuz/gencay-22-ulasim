
import { useState } from "react";
import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { FileCog, FileText } from "lucide-react";
import { LicenseData } from "@/types/license";
import { SMSDialog } from "./SMSDialog";
import { RecordActionButtons } from "./RecordActionButtons";
import { exportToExcel, exportToWord } from "@/utils/exportUtils";

interface EnhancedDataTableProps {
  data: LicenseData[];
  plateType: string;
  onSave: (data: LicenseData) => void;
}

export const EnhancedDataTable = ({ data, plateType, onSave }: EnhancedDataTableProps) => {
  const [smsDialogOpen, setSmsDialogOpen] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<LicenseData | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editRecord, setEditRecord] = useState<LicenseData | null>(null);

  // Sort data by ownerType, owners first, then drivers
  const sortedData = [...data].sort((a, b) => {
    if (a.ownerType === "owner" && b.ownerType === "driver") return -1;
    if (a.ownerType === "driver" && b.ownerType === "owner") return 1;
    return 0;
  });

  const handleSendSMS = (record: LicenseData) => {
    setCurrentRecord(record);
    setSmsDialogOpen(true);
  };
  
  const handleEdit = (record: LicenseData) => {
    setEditRecord(record);
    setIsDialogOpen(true);
  };

  const renderActionButtons = (record: LicenseData) => {
    return (
      <RecordActionButtons 
        record={record} 
        onSendSMS={handleSendSMS} 
        onSave={onSave}
        onEdit={handleEdit}
      />
    );
  };

  return (
    <div className="w-full">
      <div className="flex justify-end mb-1 gap-1">
        <Button 
          variant="outline" 
          onClick={() => exportToExcel(sortedData, plateType)}
          className="flex items-center"
          size="sm"
        >
          <FileCog className="mr-1 h-3 w-3" />
          Excel'e Aktar
        </Button>
        <Button 
          variant="outline"
          onClick={() => exportToWord(sortedData, plateType)}
          className="flex items-center"
          size="sm"
        >
          <FileText className="mr-1 h-3 w-3" />
          Word'e Aktar
        </Button>
      </div>

      <DataTable 
        data={sortedData} 
        plateType={plateType} 
        onSave={onSave}
        renderActionButtons={renderActionButtons}
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
        editRecord={editRecord}
      />
      
      <SMSDialog 
        open={smsDialogOpen} 
        onOpenChange={setSmsDialogOpen} 
        record={currentRecord} 
      />
    </div>
  );
};
