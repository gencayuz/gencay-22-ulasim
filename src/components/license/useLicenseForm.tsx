
import { useState, useEffect } from "react";
import { LicenseData } from "@/types/license";
import { addDays } from "date-fns";
import { toast } from "sonner";

export const useLicenseForm = (currentItem: LicenseData | null, plateType: string) => {
  // Basic form state
  const [name, setName] = useState("");
  const [sicilNo, setSicilNo] = useState("");
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
  const [sgkServiceList, setSgkServiceList] = useState<"yes" | "no">("no");
  const [penaltyPoints, setPenaltyPoints] = useState<"yes" | "no">("no");
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

  useEffect(() => {
    if (currentItem) {
      setName(currentItem.name);
      setSicilNo(currentItem.sicilNo || "");
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
      setSgkServiceList(currentItem.sgkServiceList || "no");
      setPenaltyPoints(currentItem.penaltyPoints || "no");
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
      setSicilNo("");
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
      setSgkServiceList("no");
      setPenaltyPoints("no");
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
  }, [currentItem]);

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

  const prepareFormData = () => {
    if (!validateForm()) {
      toast.error("Lütfen tüm alanları doldurun");
      return null;
    }
    
    if (!startDate || !endDate || !healthStartDate || !healthEndDate || 
        !psychoStartDate || !psychoEndDate) {
      toast.error("Tarih alanları geçerli değil");
      return null;
    }
    
    // Format license plate
    const licensePlate = `${licensePlatePrefix} ${plateType} ${licensePlateNumber}`;
    
    const formData: LicenseData = {
      id: currentItem?.id || crypto.randomUUID(),
      name,
      sicilNo,
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
      sgkServiceList,
      penaltyPoints,
      active
    };
    
    return formData;
  };

  return {
    // Form state
    name, setName,
    sicilNo, setSicilNo,
    phone, setPhone,
    licensePlatePrefix, setLicensePlatePrefix,
    licensePlateNumber, setLicensePlateNumber,
    vehicleAge, setVehicleAge,
    startDate, setStartDate,
    endDate, setEndDate,
    ownerType, setOwnerType,
    criminalRecord, setCriminalRecord,
    taxCertificate, setTaxCertificate,
    chamberRegistration, setChamberRegistration,
    sgkServiceList, setSgkServiceList,
    penaltyPoints, setPenaltyPoints,
    active, setActive,
    
    // Date ranges
    healthStartDate, setHealthStartDate,
    healthEndDate, setHealthEndDate,
    seatStartDate, setSeatStartDate,
    seatEndDate, setSeatEndDate,
    psychoStartDate, setPsychoStartDate,
    psychoEndDate, setPsychoEndDate,
    
    // Validation
    formErrors,
    validateForm,
    prepareFormData
  };
};
