
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DateRangeFields } from "./DateRangeFields";
import { LicenseData } from "@/types/license";
import { addDays } from "date-fns";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useLocation } from "react-router-dom";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";

interface LicenseFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentItem: LicenseData | null;
  onSave: (data: LicenseData) => void;
  plateType: string; // Added plateType prop
}

export const LicenseFormDialog = ({ 
  open, 
  onOpenChange, 
  currentItem, 
  onSave,
  plateType 
}: LicenseFormDialogProps) => {
  const location = useLocation();
  
  // Get current plate type based on route
  const getCurrentPlateType = () => {
    if (location.pathname.includes("m-plaka")) return "M";
    if (location.pathname.includes("s-plaka")) return "S";
    if (location.pathname.includes("t-plaka")) return "T";
    if (location.pathname.includes("j-plaka")) return "J";
    return "M"; // Default
  };

  // Use the passed plateType prop instead of determining it from the route
  // const plateType = getCurrentPlateType();
  
  // Basic form state
  const [name, setName] = useState("");
  const [sicilNo, setSicilNo] = useState(""); // Add sicilNo state
  const [phone, setPhone] = useState("");
  const [licensePlatePrefix, setLicensePlatePrefix] = useState("");
  const [licensePlateNumber, setLicensePlateNumber] = useState("");
  const [vehicleAge, setVehicleAge] = useState<number>(0);
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(addDays(new Date(), 365));
  const [ownerType, setOwnerType] = useState<"owner" | "driver">("owner");
  const [criminalRecord, setCriminalRecord] = useState<"yes" | "no">("no");
  const [taxCertificate, setTaxCertificate] = useState<"yes" | "no">("no");
  const [chamberRegistration, setChamberRegistration] = useState<"yes" | "no">("no");
  const [active, setActive] = useState<boolean>(true);
  
  // State for additional fields
  const [healthStartDate, setHealthStartDate] = useState<Date | undefined>(new Date());
  const [healthEndDate, setHealthEndDate] = useState<Date | undefined>(addDays(new Date(), 365));
  const [seatStartDate, setSeatStartDate] = useState<Date | undefined>(new Date());
  const [seatEndDate, setSeatEndDate] = useState<Date | undefined>(addDays(new Date(), 365));
  const [psychoStartDate, setPsychoStartDate] = useState<Date | undefined>(new Date());
  const [psychoEndDate, setPsychoEndDate] = useState<Date | undefined>(addDays(new Date(), 365));

  // Form validation
  const [formErrors, setFormErrors] = useState<{[key: string]: boolean}>({});

  // Reset form or populate with currentItem data when dialog opens/closes or currentItem changes
  useEffect(() => {
    if (currentItem) {
      setName(currentItem.name);
      setSicilNo(currentItem.sicilNo || ""); // Set sicilNo from currentItem
      setPhone(currentItem.phone || "");
      
      // Split license plate into prefix and number
      const plateMatch = currentItem.licensePlate.match(/(\d{2})\s*([A-Z])\s*(\d+)/);
      if (plateMatch) {
        setLicensePlatePrefix(plateMatch[1]);
        setLicensePlateNumber(plateMatch[3]);
      } else {
        setLicensePlatePrefix("");
        setLicensePlateNumber("");
      }
      
      setVehicleAge(currentItem.vehicleAge);
      setStartDate(currentItem.startDate);
      setEndDate(currentItem.endDate);
      setOwnerType(currentItem.ownerType || "owner");
      setCriminalRecord(currentItem.criminalRecord || "no");
      setTaxCertificate(currentItem.taxCertificate || "no");
      setChamberRegistration(currentItem.chamberRegistration || "no");
      setActive(currentItem.active !== undefined ? currentItem.active : true);
      
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
      setSicilNo(""); // Reset sicilNo
      setPhone("");
      setLicensePlatePrefix("");
      setLicensePlateNumber("");
      setVehicleAge(0);
      setStartDate(new Date());
      setEndDate(addDays(new Date(), 365));
      setOwnerType("owner");
      setCriminalRecord("no");
      setTaxCertificate("no");
      setChamberRegistration("no");
      setActive(true);
      // Reset additional fields
      setHealthStartDate(new Date());
      setHealthEndDate(addDays(new Date(), 365));
      setSeatStartDate(new Date());
      setSeatEndDate(addDays(new Date(), 365));
      setPsychoStartDate(new Date());
      setPsychoEndDate(addDays(new Date(), 365));
    }
    
    // Reset form errors
    setFormErrors({});
  }, [currentItem, open]);

  const validateForm = () => {
    const errors: {[key: string]: boolean} = {};
    
    if (!name) errors.name = true;
    if (!phone) errors.phone = true;
    if (!licensePlatePrefix) errors.licensePlatePrefix = true;
    if (!licensePlateNumber) errors.licensePlateNumber = true;
    if (vehicleAge < 0) errors.vehicleAge = true;
    if (!startDate) errors.startDate = true;
    if (!endDate) errors.endDate = true;
    if (!healthStartDate) errors.healthStartDate = true;
    if (!healthEndDate) errors.healthEndDate = true;
    if (!seatStartDate) errors.seatStartDate = true;
    if (!seatEndDate) errors.seatEndDate = true;
    if (!psychoStartDate) errors.psychoStartDate = true;
    if (!psychoEndDate) errors.psychoEndDate = true;
    
    // Validate license plate prefix is numeric and 2 digits
    if (!/^\d{1,2}$/.test(licensePlatePrefix)) {
      errors.licensePlatePrefix = true;
    }
    
    // Validate license plate number is numeric and max 5 digits
    if (!/^\d{1,5}$/.test(licensePlateNumber)) {
      errors.licensePlateNumber = true;
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) {
      toast.error("Lütfen tüm alanları doldurun");
      return;
    }
    
    if (!startDate || !endDate || !healthStartDate || !healthEndDate || 
        !seatStartDate || !seatEndDate || !psychoStartDate || !psychoEndDate) {
      toast.error("Tarih alanları geçerli değil");
      return;
    }
    
    // Format license plate
    const licensePlate = `${licensePlatePrefix} ${plateType} ${licensePlateNumber}`;
    
    const newItem: LicenseData = {
      id: currentItem?.id || crypto.randomUUID(),
      name,
      sicilNo, // Include sicilNo in the saved data
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
      chamberRegistration,
      active // Include active status in the saved data
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
              className={`col-span-3 ${formErrors.name ? 'border-red-500' : ''}`}
              required
            />
          </div>
          
          {/* Add Sicil Num. field right below name */}
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="sicilNo" className="text-right">
              Sicil Num.
            </label>
            <Input
              id="sicilNo"
              value={sicilNo}
              onChange={(e) => setSicilNo(e.target.value)}
              className="col-span-3"
            />
          </div>
          
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
          
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="licensePlate" className="text-right">
              Araç Plakası
            </label>
            <div className="col-span-3 flex gap-2">
              <Input
                id="licensePlatePrefix"
                value={licensePlatePrefix}
                onChange={(e) => {
                  // Only allow numbers and max 2 digits
                  const value = e.target.value.replace(/\D/g, '').slice(0, 2);
                  setLicensePlatePrefix(value);
                }}
                className={`w-20 text-center ${formErrors.licensePlatePrefix ? 'border-red-500' : ''}`}
                placeholder="34"
                maxLength={2}
                required
              />
              <div className="flex items-center justify-center w-10 text-center bg-gray-100 rounded-md border">
                {plateType}
              </div>
              <Input
                id="licensePlateNumber"
                value={licensePlateNumber}
                onChange={(e) => {
                  // Only allow numbers and max 5 digits
                  const value = e.target.value.replace(/\D/g, '').slice(0, 5);
                  setLicensePlateNumber(value);
                }}
                className={`flex-1 ${formErrors.licensePlateNumber ? 'border-red-500' : ''}`}
                placeholder="12345"
                maxLength={5}
                required
              />
            </div>
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
              className={`col-span-3 ${formErrors.phone ? 'border-red-500' : ''}`}
              required
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
              className={`col-span-3 ${formErrors.vehicleAge ? 'border-red-500' : ''}`}
              required
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
            hasErrors={!!formErrors.startDate || !!formErrors.endDate}
          />
          
          {/* Sağlık Raporu */}
          <DateRangeFields 
            label="Sağlık Raporu"
            startDate={healthStartDate}
            endDate={healthEndDate}
            onStartDateChange={setHealthStartDate}
            onEndDateChange={setHealthEndDate}
            hasErrors={!!formErrors.healthStartDate || !!formErrors.healthEndDate}
          />
          
          {/* Koltuk Sigortası */}
          <DateRangeFields 
            label="Koltuk Sigortası"
            startDate={seatStartDate}
            endDate={seatEndDate}
            onStartDateChange={setSeatStartDate}
            onEndDateChange={setSeatEndDate}
            hasErrors={!!formErrors.seatStartDate || !!formErrors.seatEndDate}
          />
          
          {/* Psikoteknik Belgesi */}
          <DateRangeFields 
            label="Psikoteknik Belgesi"
            startDate={psychoStartDate}
            endDate={psychoEndDate}
            onStartDateChange={setPsychoStartDate}
            onEndDateChange={setPsychoEndDate}
            hasErrors={!!formErrors.psychoStartDate || !!formErrors.psychoEndDate}
          />
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSave}>Kaydet</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
