
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";

interface SMSHistoryEntry {
  id: string;
  phoneNumber: string;
  licensePlate: string;
  message: string;
  sentDate: Date;
  recipientName: string;
}

export const SMSHistoryTable = () => {
  const [filterPlate, setFilterPlate] = useState("");
  
  // Get SMS history from localStorage
  const getSMSHistory = (): SMSHistoryEntry[] => {
    try {
      const history = localStorage.getItem("smsHistory");
      if (!history) return [];
      return JSON.parse(history).map((item: any) => ({
        ...item,
        sentDate: new Date(item.sentDate)
      }));
    } catch (error) {
      console.error("Error loading SMS history:", error);
      return [];
    }
  };

  const smsHistory = getSMSHistory();
  
  // Filter SMS history based on license plate
  const filteredHistory = filterPlate 
    ? smsHistory.filter(item => 
        item.licensePlate.toLowerCase().includes(filterPlate.toLowerCase())
      )
    : smsHistory;

  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <Input
          placeholder="Araç plakası ile filtrele"
          value={filterPlate}
          onChange={(e) => setFilterPlate(e.target.value)}
          className="max-w-sm"
        />
      </div>
      
      {filteredHistory.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Plaka</TableHead>
              <TableHead>Alıcı</TableHead>
              <TableHead>Telefon</TableHead>
              <TableHead>Mesaj</TableHead>
              <TableHead>Gönderim Tarihi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredHistory.map((sms) => (
              <TableRow key={sms.id}>
                <TableCell className="font-medium">{sms.licensePlate}</TableCell>
                <TableCell>{sms.recipientName}</TableCell>
                <TableCell>{sms.phoneNumber}</TableCell>
                <TableCell className="max-w-xs truncate">{sms.message}</TableCell>
                <TableCell>{format(sms.sentDate, "dd.MM.yyyy HH:mm")}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="text-center py-4">
          <p className="text-muted-foreground">
            {filterPlate ? "Filtreye uygun SMS kaydı bulunamadı." : "Henüz gönderilmiş SMS bulunmamaktadır."}
          </p>
        </div>
      )}
    </div>
  );
};
