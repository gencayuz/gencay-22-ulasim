
import { LicenseData } from "@/types/license";
import { FormState } from "./formInitialization";

export const prepareLicenseFormData = (
  formState: FormState,
  plateType: string,
  currentItemId?: string
): LicenseData => {
  const licensePlate = `${formState.licensePlatePrefix} ${plateType} ${formState.licensePlateNumber}`;
  
  return {
    id: currentItemId || crypto.randomUUID(),
    name: formState.name,
    sicilNo: formState.sicilNo,
    phone: formState.phone,
    licensePlate,
    vehicleAge: formState.vehicleAge,
    startDate: formState.startDate!,
    endDate: formState.endDate!,
    healthReport: {
      startDate: formState.healthStartDate!,
      endDate: formState.healthEndDate!
    },
    seatInsurance: {
      startDate: formState.seatStartDate!,
      endDate: formState.seatEndDate!
    },
    psychotechnic: {
      startDate: formState.psychoStartDate!,
      endDate: formState.psychoEndDate!
    },
    ownerType: formState.ownerType,
    criminalRecord: formState.criminalRecord,
    taxCertificate: formState.taxCertificate,
    chamberRegistration: formState.chamberRegistration,
    sgkServiceList: formState.sgkServiceList,
    penaltyPoints: formState.penaltyPoints,
    active: formState.active
  };
};
