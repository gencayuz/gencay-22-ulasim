
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DateRangeFields } from "./DateRangeFields";
import { LicenseData } from "@/types/license";
import { addDays } from "date-fns";

interface LicenseFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentItem: LicenseData | null;
  onSave: (data: LicenseData) => void;
}

export const LicenseFormDialog = ({ 
  open, 
  onOpenChange, 
  currentItem, 
  onSave 
}: LicenseFormDialogProps) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [licensePlate, setLicensePlate] = useState("");
  const [vehicleAge, setVehicleAge] = useState<number>(0);
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(addDays(new Date(), 365));
  const [ownerType, setOwnerType] = useState<"owner" | "driver">("owner");
  const [criminalRecord, setCriminalRecord] = useState<"yes" | "no">("no");
  const [taxCertificate, setTaxCertificate] = useState<"yes" | "no">("no");
  const [chamberRegistration, setChamberRegistration] = useState<"yes" | "no">("no");
  
  // State for additional fields
  const [healthStartDate, setHealthStartDate] = useState<Date | undefined>(new Date());
  const [healthEndDate, setHealthEndDate] = useState<Date | undefined>(addDays(new Date(), 365));
  const [seatStartDate, setSeatStartDate] = useState<Date | undefined>(new Date());
  const [seatEndDate, setSeatEndDate] = useState<Date | undefined>(addDays(new Date(), 365));
  const [psychoStartDate, setPsychoStartDate] = useState<Date | undefined>(new Date());
  const [psychoEndDate, setPsychoEndDate] = useState<Date | undefined>(addDays(new Date(), 365));

  // Reset form or populate with currentItem data when dialog opens/closes or currentItem changes
  useEffect(() => {
    if (currentItem) {
      setName(currentItem.name);
      setPhone(currentItem.phone || "");
      setLicensePlate(currentItem.licensePlate);
      setVehicleAge(currentItem.vehicleAge);
      setStartDate(currentItem.startDate);
      setEndDate(currentItem.endDate);
      setOwnerType(currentItem.ownerType || "owner");
      setCriminalRecord(currentItem.criminalRecord || "no");
      setTaxCertificate(currentItem.taxCertificate || "no");
      setChamberRegistration(currentItem.chamberRegistration || "no");
      
      // Set additional fields if they exist
      setHealthStartDate(currentItem.healthReport?.startDate || new Date());
      setHealthEndDate(currentItem.healthReport?.endDate || addDays(new Date(), 365));
      setSeatStartDate(currentItem.seatInsurance?.startDate || new Date());
      setSeatEndDate(currentItem.seatInsurance?.endDate || addDays(new Date(), 365));
      setPsychoStartDate(currentItem.psychotechnic?.startDate || new Date());
      setPsychoEndDate(currentItem.psychotechnic?.endDate || addDays(new Date(), 365));
    } else {
      // Reset form for new entries
      setName("");
      setPhone("");
      setLicensePlate("");
      setVehicleAge(0);
      setStartDate(new Date());
      setEndDate(addDays(new Date(), 365));
      setOwnerType("owner");
      setCriminalRecord("no");
      setTaxCertificate("no");
      setChamberRegistration("no");
      // Reset additional fields
      setHealthStartDate(new Date());
      setHealthEndDate(addDays(new Date(), 365));
      setSeatStartDate(new Date());
      setSeatEndDate(addDays(new Date(), 365));
      setPsychoStartDate(new Date());
      setPsychoEndDate(addDays(new Date(), 365));
    }
  }, [currentItem, open]);

  const handleSave = () => {
    if (!startDate || !endDate || !healthStartDate || !healthEndDate || 
        !seatStartDate || !seatEndDate || !psychoStartDate || !psychoEndDate) return;
    
    const newItem: LicenseData = {
      id: currentItem?.id || crypto.randomUUID(),
      name,
      phone,
      licensePlate,
      vehicleAge,
      startDate,
      endDate,
      healthReport: {
        startDate: healthStartDate,
        endDate: healthEndDate
      },
      seatInsurance: {
        startDate: seatStartDate,
        endDate: seatEndDate
      },
      psychotechnic: {
        startDate: psychoStartDate,
        endDate: psychoEndDate
      },
      ownerType,
      criminalRecord,
      taxCertificate,
      chamberRegistration
    };
    
    onSave(newItem);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{currentItem ? 'Kaydı Düzenle' : 'Yeni Kayıt Ekle'}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="name" className="text-right">
              Adı Soyadı
            </label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="ownerType" className="text-right">
              Araç Sahibi / Şoför
            </label>
            <Select value={ownerType} onValueChange={(value) => setOwnerType(value as "owner" | "driver")}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Seçiniz" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="owner">Araç Sahibi</SelectItem>
                <SelectItem value="driver">Şoför</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="licensePlate" className="text-right">
              Araç Plakası
            </label>
            <Input
              id="licensePlate"
              value={licensePlate}
              onChange={(e) => setLicensePlate(e.target.value)}
              className="col-span-3"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="phone" className="text-right">
              Telefon
            </label>
            <Input
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="05xx xxx xx xx"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="vehicleAge" className="text-right">
              Araç Yaşı
            </label>
            <Input
              id="vehicleAge"
              type="number"
              value={vehicleAge}
              onChange={(e) => setVehicleAge(parseInt(e.target.value))}
              className="col-span-3"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="criminalRecord" className="text-right">
              Sabıka Kaydı
            </label>
            <Select value={criminalRecord} onValueChange={(value) => setCriminalRecord(value as "yes" | "no")}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Seçiniz" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Var</SelectItem>
                <SelectItem value="no">Yok</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="taxCertificate" className="text-right">
              Vergi Levhası
            </label>
            <Select value={taxCertificate} onValueChange={(value) => setTaxCertificate(value as "yes" | "no")}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Seçiniz" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Var</SelectItem>
                <SelectItem value="no">Yok</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="chamberRegistration" className="text-right">
              Oda Kaydı
            </label>
            <Select value={chamberRegistration} onValueChange={(value) => setChamberRegistration(value as "yes" | "no")}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Seçiniz" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Var</SelectItem>
                <SelectItem value="no">Yok</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Ruhsat tarihleri */}
          <DateRangeFields 
            label="Ruhsat Tarihleri"
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
          />
          
          {/* Sağlık Raporu */}
          <DateRangeFields 
            label="Sağlık Raporu"
            startDate={healthStartDate}
            endDate={healthEndDate}
            onStartDateChange={setHealthStartDate}
            onEndDateChange={setHealthEndDate}
          />
          
          {/* Koltuk Sigortası */}
          <DateRangeFields 
            label="Koltuk Sigortası"
            startDate={seatStartDate}
            endDate={seatEndDate}
            onStartDateChange={setSeatStartDate}
            onEndDateChange={setSeatEndDate}
          />
          
          {/* Psikoteknik Belgesi */}
          <DateRangeFields 
            label="Psikoteknik Belgesi"
            startDate={psychoStartDate}
            endDate={psychoEndDate}
            onStartDateChange={setPsychoStartDate}
            onEndDateChange={setPsychoEndDate}
          />
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSave}>Kaydet</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
