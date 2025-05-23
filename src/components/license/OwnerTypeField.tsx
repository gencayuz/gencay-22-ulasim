
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface OwnerTypeFieldProps {
  ownerType: "owner" | "driver";
  setOwnerType: (value: "owner" | "driver") => void;
  active: boolean;
  setActive: (value: boolean) => void;
}

export const OwnerTypeField = ({
  ownerType,
  setOwnerType,
  active,
  setActive
}: OwnerTypeFieldProps) => {
  return (
    <div className="grid grid-cols-4 items-center gap-4">
      <label htmlFor="ownerType" className="text-right">
        Araç Sahibi / Şoför
      </label>
      <div className="col-span-3 flex items-center justify-between">
        <Select value={ownerType} onValueChange={(value) => setOwnerType(value as "owner" | "driver")}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Seçiniz" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="owner">Araç Sahibi</SelectItem>
            <SelectItem value="driver">Şoför</SelectItem>
          </SelectContent>
        </Select>
        
        <div className="flex items-center space-x-2">
          <Label htmlFor="active-status" className="text-sm">
            {active ? "Aktif" : "Pasif"}
          </Label>
          <Switch 
            id="active-status"
            checked={active} 
            onCheckedChange={setActive} 
          />
        </div>
      </div>
    </div>
  );
};
