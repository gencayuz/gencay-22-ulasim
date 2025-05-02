
import { useState } from "react";
import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { MessageSquare, FileUp, Phone, FileText, FileCog } from "lucide-react";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { LicenseData } from "@/types/license";
import * as XLSX from 'xlsx';
import { format } from "date-fns";

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

  const exportToExcel = () => {
    // Format dates for Excel export
    const formattedData = data.map(item => ({
      "Adı Soyadı": item.name,
      "Araç Plakası": item.licensePlate,
      "Telefon": item.phone || "-",
      "Araç Yaşı": item.vehicleAge,
      "Sabıka Kaydı": item.criminalRecord === "yes" ? "Var" : "Yok",
      "Vergi Levhası": item.taxCertificate === "yes" ? "Var" : "Yok",
      "Oda Kaydı": item.chamberRegistration === "yes" ? "Var" : "Yok",
      "Araç Sahibi / Şoför": item.ownerType === "owner" ? "Araç Sahibi" : "Şoför",
      "Ruhsat Başlangıç": format(item.startDate, "dd.MM.yyyy"),
      "Ruhsat Bitiş": format(item.endDate, "dd.MM.yyyy"),
      "Sağlık Raporu Başlangıç": item.healthReport ? format(item.healthReport.startDate, "dd.MM.yyyy") : "-",
      "Sağlık Raporu Bitiş": item.healthReport ? format(item.healthReport.endDate, "dd.MM.yyyy") : "-",
      "Koltuk Sigortası Başlangıç": item.seatInsurance ? format(item.seatInsurance.startDate, "dd.MM.yyyy") : "-",
      "Koltuk Sigortası Bitiş": item.seatInsurance ? format(item.seatInsurance.endDate, "dd.MM.yyyy") : "-",
      "Psikoteknik Başlangıç": item.psychotechnic ? format(item.psychotechnic.startDate, "dd.MM.yyyy") : "-",
      "Psikoteknik Bitiş": item.psychotechnic ? format(item.psychotechnic.endDate, "dd.MM.yyyy") : "-",
    }));

    // Create worksheet and workbook
    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, `${plateType}_Plaka`);
    
    // Generate Excel file
    XLSX.writeFile(workbook, `${plateType}_Plaka_Kayitlari.xlsx`);
    toast.success("Excel dosyası indirildi.");
  };

  const exportToWord = () => {
    // Create a formatted HTML string for Word document
    let html = `
      <html>
      <head>
        <meta charset="UTF-8">
        <title>${plateType} Plaka Kayıtları</title>
        <style>
          table {border-collapse: collapse; width: 100%; margin-bottom: 20px;}
          th, td {border: 1px solid #ddd; padding: 8px; text-align: left;}
          th {background-color: #f2f2f2;}
          h1 {text-align: center;}
        </style>
      </head>
      <body>
        <h1>${plateType} Plaka Kayıtları</h1>
        <table>
          <tr>
            <th>Adı Soyadı</th>
            <th>Araç Plakası</th>
            <th>Telefon</th>
            <th>Araç Yaşı</th>
            <th>Sabıka Kaydı</th>
            <th>Vergi Levhası</th>
            <th>Oda Kaydı</th>
            <th>Araç Sahibi / Şoför</th>
            <th>Ruhsat Tarihleri</th>
            <th>Sağlık Raporu</th>
            <th>Koltuk Sigortası</th>
            <th>Psikoteknik</th>
          </tr>
    `;

    // Add data rows
    data.forEach(item => {
      html += `
        <tr>
          <td>${item.name}</td>
          <td>${item.licensePlate}</td>
          <td>${item.phone || "-"}</td>
          <td>${item.vehicleAge}</td>
          <td>${item.criminalRecord === "yes" ? "Var" : "Yok"}</td>
          <td>${item.taxCertificate === "yes" ? "Var" : "Yok"}</td>
          <td>${item.chamberRegistration === "yes" ? "Var" : "Yok"}</td>
          <td>${item.ownerType === "owner" ? "Araç Sahibi" : "Şoför"}</td>
          <td>
            Başlangıç: ${format(item.startDate, "dd.MM.yyyy")}<br>
            Bitiş: ${format(item.endDate, "dd.MM.yyyy")}
          </td>
          <td>
            Başlangıç: ${item.healthReport ? format(item.healthReport.startDate, "dd.MM.yyyy") : "-"}<br>
            Bitiş: ${item.healthReport ? format(item.healthReport.endDate, "dd.MM.yyyy") : "-"}
          </td>
          <td>
            Başlangıç: ${item.seatInsurance ? format(item.seatInsurance.startDate, "dd.MM.yyyy") : "-"}<br>
            Bitiş: ${item.seatInsurance ? format(item.seatInsurance.endDate, "dd.MM.yyyy") : "-"}
          </td>
          <td>
            Başlangıç: ${item.psychotechnic ? format(item.psychotechnic.startDate, "dd.MM.yyyy") : "-"}<br>
            Bitiş: ${item.psychotechnic ? format(item.psychotechnic.endDate, "dd.MM.yyyy") : "-"}
          </td>
        </tr>
      `;
    });

    html += `
        </table>
      </body>
      </html>
    `;

    // Create a Blob containing the HTML content
    const blob = new Blob([html], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    
    // Create a link to download the file and trigger it
    const link = document.createElement('a');
    link.href = url;
    link.download = `${plateType}_Plaka_Kayitlari.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("Word dosyası indirildi.");
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
      <div className="flex justify-end mb-4 space-x-2">
        <Button 
          variant="outline" 
          onClick={exportToExcel}
          className="flex items-center"
        >
          <FileCog className="mr-1 h-4 w-4" />
          Excel'e Aktar
        </Button>
        <Button 
          variant="outline"
          onClick={exportToWord}
          className="flex items-center"
        >
          <FileText className="mr-1 h-4 w-4" />
          Word'e Aktar
        </Button>
      </div>

      <DataTable 
        data={data} 
        plateType={plateType} 
        onSave={onSave}
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
