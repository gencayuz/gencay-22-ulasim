
import { useState } from "react";
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

interface SMSDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  record: LicenseData | null;
}

export const SMSDialog = ({ open, onOpenChange, record }: SMSDialogProps) => {
  const [smsMessage, setSmsMessage] = useState("");

  // Set default message when record changes
  useState(() => {
    if (record) {
      setSmsMessage(`Sayın ${record.name}, ${record.licensePlate} plakalı aracınızın belgelerinden biri yakında süresi dolacaktır. Lütfen en kısa sürede yenileme işlemlerini yapınız.`);
    }
  });

  const sendSMS = () => {
    if (!record) return;
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
