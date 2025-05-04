
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { LicenseData } from "@/types/license";
import { v4 as uuidv4 } from "uuid";

interface SMSDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  record: LicenseData | null;
}

interface SMSHistoryEntry {
  id: string;
  phoneNumber: string;
  licensePlate: string;
  message: string;
  sentDate: Date;
  recipientName: string;
}

export const SMSDialog = ({ open, onOpenChange, record }: SMSDialogProps) => {
  const [smsMessage, setSmsMessage] = useState("");

  // Set default message when record changes
  useEffect(() => {
    if (record) {
      setSmsMessage(`Sayın ${record.name}, ${record.licensePlate} plakalı aracınızın belgelerinden biri yakında süresi dolacaktır. Lütfen en kısa sürede yenileme işlemlerini yapınız.`);
    }
  }, [record]);

  const sendSMS = () => {
    if (!record) return;
    
    // Save SMS to history
    const smsEntry: SMSHistoryEntry = {
      id: uuidv4(),
      phoneNumber: record.phone,
      licensePlate: record.licensePlate,
      message: smsMessage,
      sentDate: new Date(),
      recipientName: record.name
    };
    
    // Get existing history
    const existingHistory = localStorage.getItem("smsHistory");
    let history: SMSHistoryEntry[] = [];
    
    if (existingHistory) {
      try {
        history = JSON.parse(existingHistory);
      } catch (error) {
        console.error("Error parsing SMS history", error);
      }
    }
    
    // Add new entry and save
    history.push(smsEntry);
    localStorage.setItem("smsHistory", JSON.stringify(history));
    
    // In a real application, this would connect to an SMS API
    toast.success(`${record.phone} numarasına SMS gönderildi.`);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>SMS Gönder</DialogTitle>
          <DialogDescription>
            {record?.name} ({record?.phone}) kişisine SMS gönder
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
          <Button variant="outline" onClick={() => onOpenChange(false)}>İptal</Button>
          <Button onClick={sendSMS}>Gönder</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
