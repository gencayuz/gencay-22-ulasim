
import { Button } from "@/components/ui/button";
import { FileUp, Phone, Pencil } from "lucide-react";
import { LicenseData } from "@/types/license";
import { toast } from "sonner";

interface RecordActionButtonsProps {
  record: LicenseData;
  onSendSMS: (record: LicenseData) => void;
  onSave: (data: LicenseData) => void;
  onEdit: (item: LicenseData) => void;
}

export const RecordActionButtons = ({ 
  record, 
  onSendSMS,
  onSave,
  onEdit
}: RecordActionButtonsProps) => {
  
  const handleUploadPdf = (event: React.ChangeEvent<HTMLInputElement>) => {
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

  return (
    <div className="flex space-x-2">
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => onSendSMS(record)}
        className="flex items-center"
      >
        <Phone className="mr-1 h-4 w-4" />
        SMS
      </Button>
      
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => onEdit(record)}
        className="flex items-center"
      >
        <Pencil className="mr-1 h-4 w-4" />
        Düzenle
      </Button>
      
      <label className="cursor-pointer">
        <input
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={handleUploadPdf}
        />
        <Button 
          variant="outline" 
          size="sm"
          className="flex items-center"
          asChild
        >
          <span>
            <FileUp className="mr-1 h-4 w-4" />
            Yükle
          </span>
        </Button>
      </label>
    </div>
  );
};
