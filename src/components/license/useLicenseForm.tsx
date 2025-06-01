import { useState, useEffect } from "react";
import { LicenseData } from "@/types/license";
import { toast } from "sonner";
import { getInitialFormState, getFormStateFromLicenseData } from "./formInitialization";

export const useLicenseForm = (currentItem: LicenseData | null, plateType: string) => {
  // Initialize form state using helper function
  const initialState = getInitialFormState();
  
  // Basic form state
  const [name, setName] = useState(initialState.name);
  const [sicilNo, setSicilNo] = useState(initialState.sicilNo);
  const [phone, setPhone] = useState(initialState.phone);
  const [licensePlatePrefix, setLicensePlatePrefix] = useState(initialState.licensePlatePrefix);
  const [licensePlateNumber, setLicensePlateNumber] = useState(initialState.licensePlateNumber);
  const [vehicleAge, setVehicleAge] = useState<number>(initialState.vehicleAge);
  const [startDate, setStartDate] = useState<Date | undefined>(initialState.startDate);
  const [endDate, setEndDate] = useState<Date | undefined>(initialState.endDate);
  const [ownerType, setOwnerType] = useState<"owner" | "driver">(initialState.ownerType);
  const [criminalRecord, setCriminalRecord] = useState<"yes" | "no">(initialState.criminalRecord);
  const [taxCertificate, setTaxCertificate] = useState<"yes" | "no">(initialState.taxCertificate);
  const [chamberRegistration, setChamberRegistration] = useState<"yes" | "no">(initialState.chamberRegistration);
  const [sgkServiceList, setSgkServiceList] = useState<"yes" | "no">(initialState.sgkServiceList);
  const [penaltyPoints, setPenaltyPoints] = useState<"yes" | "no">(initialState.penaltyPoints);
  const [active, setActive] = useState<boolean>(initialState.active);
  
  // State for additional fields
  const [healthStartDate, setHealthStartDate] = useState<Date | undefined>(initialState.healthStartDate);
  const [healthEndDate, setHealthEndDate] = useState<Date | undefined>(initialState.healthEndDate);
  const [seatStartDate, setSeatStartDate] = useState<Date | undefined>(initialState.seatStartDate);
  const [seatEndDate, setSeatEndDate] = useState<Date | undefined>(initialState.seatEndDate);
  const [psychoStartDate, setPsychoStartDate] = useState<Date | undefined>(initialState.psychoStartDate);
  const [psychoEndDate, setPsychoEndDate] = useState<Date | undefined>(initialState.psychoEndDate);

  // Form validation
  const [formErrors, setFormErrors] = useState<{[key: string]: boolean}>({});

  useEffect(() => {
    if (currentItem) {
      const formState = getFormStateFromLicenseData(currentItem);
      
      setName(formState.name);
      setSicilNo(formState.sicilNo);
      setPhone(formState.phone);
      setLicensePlatePrefix(formState.licensePlatePrefix);
      setLicensePlateNumber(formState.licensePlateNumber);
      setVehicleAge(formState.vehicleAge);
      setStartDate(formState.startDate);
      setEndDate(formState.endDate);
      setOwnerType(formState.ownerType);
      setCriminalRecord(formState.criminalRecord);
      setTaxCertificate(formState.taxCertificate);
      setChamberRegistration(formState.chamberRegistration);
      setSgkServiceList(formState.sgkServiceList);
      setPenaltyPoints(formState.penaltyPoints);
      setActive(formState.active);
      setHealthStartDate(formState.healthStartDate);
      setHealthEndDate(formState.healthEndDate);
      setSeatStartDate(formState.seatStartDate);
      setSeatEndDate(formState.seatEndDate);
      setPsychoStartDate(formState.psychoStartDate);
      setPsychoEndDate(formState.psychoEndDate);
    } else {
      // Reset form for new entries using helper function
      const resetState = getInitialFormState();
      
      setName(resetState.name);
      setSicilNo(resetState.sicilNo);
      setPhone(resetState.phone);
      setLicensePlatePrefix(resetState.licensePlatePrefix);
      setLicensePlateNumber(resetState.licensePlateNumber);
      setVehicleAge(resetState.vehicleAge);
      setStartDate(resetState.startDate);
      setEndDate(resetState.endDate);
      setOwnerType(resetState.ownerType);
      setCriminalRecord(resetState.criminalRecord);
      setTaxCertificate(resetState.taxCertificate);
      setChamberRegistration(resetState.chamberRegistration);
      setSgkServiceList(resetState.sgkServiceList);
      setPenaltyPoints(resetState.penaltyPoints);
      setActive(resetState.active);
      setHealthStartDate(resetState.healthStartDate);
      setHealthEndDate(resetState.healthEndDate);
      setSeatStartDate(resetState.seatStartDate);
      setSeatEndDate(resetState.seatEndDate);
      setPsychoStartDate(resetState.psychoStartDate);
      setPsychoEndDate(resetState.psychoEndDate);
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
