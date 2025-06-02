
import { Button } from "@/components/ui/button";
import { FileUp, Phone, Pencil } from "lucide-react";
import { LicenseData } from "@/types/license";
import { toast } from "sonner";
import { documentApi } from "@/utils/apiService";

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
  
  const handleUploadPdf = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        // Upload to server
        const uploadedDoc = await documentApi.uploadDocument(
          file, 
          record.licensePlate, 
          "Araç Belgesi"
        );
        
        // Update record with document reference
        const updatedRecord = { 
          ...record, 
          licenseDocument: uploadedDoc.fileName 
        };
        
        onSave(updatedRecord);
        
        // Also save to sessionStorage for backward compatibility
        saveToArchives(file, record.licensePlate);
        
        toast.success(`"${file.name}" belgesi başarıyla yüklendi ve sunucuya kaydedildi.`);
      } catch (error) {
        console.error('Failed to upload document:', error);
        toast.error('Belge yüklenirken hata oluştu');
      }
    }
  };
  
  const saveToArchives = (file: File, licensePlate: string) => {
    // Get existing archives from sessionStorage
    const savedDocs = sessionStorage.getItem("archiveDocuments");
    let documents = [];
    
    if (savedDocs) {
      try {
        documents = JSON.parse(savedDocs).map((doc: any) => ({
          ...doc,
          uploadDate: new Date(doc.uploadDate)
        }));
      } catch (error) {
        console.error("Error parsing saved documents", error);
      }
    }
    
    // Create new document entry
    const newDocument = {
      id: Date.now().toString(),
      licensePlate: licensePlate,
      documentType: "Araç Belgesi",
      fileName: file.name,
      uploadDate: new Date()
    };
    
    // Add to archives
    const updatedDocuments = [...documents, newDocument];
    sessionStorage.setItem("archiveDocuments", JSON.stringify(updatedDocuments));
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
