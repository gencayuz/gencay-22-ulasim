
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { LicenseData } from "@/types/license";
import { LicenseForm } from "./license/LicenseForm";
import { useLicenseForm } from "./license/useLicenseForm";

interface LicenseFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentItem: LicenseData | null;
  onSave: (data: LicenseData) => void;
  plateType: string;
}

export const LicenseFormDialog = ({ 
  open, 
  onOpenChange, 
  currentItem, 
  onSave,
  plateType 
}: LicenseFormDialogProps) => {
  // Use our custom hook to manage form state
  const formState = useLicenseForm(currentItem, plateType);
  
  const handleSave = () => {
    const formData = formState.prepareFormData();
    if (formData) {
      onSave(formData);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{currentItem ? 'Kaydı Düzenle' : 'Yeni Kayıt Ekle'}</DialogTitle>
        </DialogHeader>
        
        <LicenseForm formState={formState} plateType={plateType} />
        
        <DialogFooter>
          <Button type="submit" onClick={handleSave}>Kaydet</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
