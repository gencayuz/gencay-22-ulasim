
import { useState } from "react";
import { FormState, getInitialFormState } from "./formInitialization";

export const useFormState = () => {
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
  
  // Additional fields
  const [healthStartDate, setHealthStartDate] = useState<Date | undefined>(initialState.healthStartDate);
  const [healthEndDate, setHealthEndDate] = useState<Date | undefined>(initialState.healthEndDate);
  const [seatStartDate, setSeatStartDate] = useState<Date | undefined>(initialState.seatStartDate);
  const [seatEndDate, setSeatEndDate] = useState<Date | undefined>(initialState.seatEndDate);
  const [psychoStartDate, setPsychoStartDate] = useState<Date | undefined>(initialState.psychoStartDate);
  const [psychoEndDate, setPsychoEndDate] = useState<Date | undefined>(initialState.psychoEndDate);

  const getFormState = (): FormState => ({
    name,
    sicilNo,
    phone,
    licensePlatePrefix,
    licensePlateNumber,
    vehicleAge,
    startDate,
    endDate,
    ownerType,
    criminalRecord,
    taxCertificate,
    chamberRegistration,
    sgkServiceList,
    penaltyPoints,
    active,
    healthStartDate,
    healthEndDate,
    seatStartDate,
    seatEndDate,
    psychoStartDate,
    psychoEndDate,
  });

  const setFormState = (formState: FormState) => {
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
  };

  return {
    // Individual state values and setters
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
    healthStartDate, setHealthStartDate,
    healthEndDate, setHealthEndDate,
    seatStartDate, setSeatStartDate,
    seatEndDate, setSeatEndDate,
    psychoStartDate, setPsychoStartDate,
    psychoEndDate, setPsychoEndDate,
    
    // Helper functions
    getFormState,
    setFormState,
  };
};
