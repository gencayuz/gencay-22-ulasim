
import { useState } from "react";
import { DataTable, LicenseData } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { MessageSquare, FileUp, Phone } from "lucide-react";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";

interface EnhancedDataTableProps {
  data: LicenseData[];
  plateType: string;
  onSave: (data: LicenseData) => void;
}

export const EnhancedDataTable = ({ data, plateType, onSave }: EnhancedDataTableProps) => {
  const [smsDialogOpen, setSmsDialogOpen] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<LicenseData | null>(null);
  const [smsMessage, setSmsMessage] = useState("");

  const handleSendSMS = (record: LicenseData) => {
    setCurrentRecord(record);
    setSmsMessage(`Sayın ${record.name}, ${record.licensePlate} plakalı aracınızın belgelerinden biri yakında süresi dolacaktır. Lütfen en kısa sürede yenileme işlemlerini yapınız.`);
    setSmsDialogOpen(true);
  };

  const sendSMS = () => {
    if (!currentRecord) return;
    // In a real application, this would connect to an SMS API
    toast.success(`${currentRecord.phone} numarasına SMS gönderildi.`);
    setSmsDialogOpen(false);
  };

  const handleUploadPdf = (event: React.ChangeEvent<HTMLInputElement>, record: LicenseData) => {
    const file = event.target.files?.[0];
    if (file) {
      // In a real application, you would upload this file to a server
      // For now, we'll just store the file name to indicate a document is uploaded
      const updatedRecord = { 
        ...record, 
        licenseDocument: file.name 
      };
      
      onSave(updatedRecord);
      toast.success(`"${file.name}" belgesi başarıyla yüklendi.`);
    }
  };

  const renderActionButtons = (record: LicenseData) => {
    return (
      <div className="flex space-x-2">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => handleSendSMS(record)}
          className="flex items-center"
        >
          <Phone className="mr-1 h-4 w-4" />
          SMS
        </Button>
        
        <label className="cursor-pointer">
          <input
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={(e) => handleUploadPdf(e, record)}
          />
          <Button 
            variant="outline" 
            size="sm"
            className="flex items-center"
            asChild
          >
            <span>
              <FileUp className="mr-1 h-4 w-4" />
              Düzenle
            </span>
          </Button>
        </label>
      </div>
    );
  };

  return (
    <>
      <DataTable 
        data={data} 
        plateType={plateType} 
        onSave={onSave} 
        renderActionButtons={renderActionButtons}
      />
      
      <Dialog open={smsDialogOpen} onOpenChange={setSmsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>SMS Gönder</DialogTitle>
            <DialogDescription>
              {currentRecord?.name} ({currentRecord?.phone}) kişisine SMS gönder
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <textarea
              value={smsMessage}
              onChange={(e) => setSmsMessage(e.target.value)}
              className="w-full min-h-[100px] p-3 border rounded-md"
              placeholder="SMS mesajınızı yazın"
            />
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setSmsDialogOpen(false)}>İptal</Button>
            <Button onClick={sendSMS}>Gönder</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
