
import { LicenseData } from "@/types/license";
import { addDays } from "date-fns";

export interface FormState {
  name: string;
  sicilNo: string;
  phone: string;
  licensePlatePrefix: string;
  licensePlateNumber: string;
  vehicleAge: number;
  startDate: Date | undefined;
  endDate: Date | undefined;
  ownerType: "owner" | "driver";
  criminalRecord: "yes" | "no";
  taxCertificate: "yes" | "no";
  chamberRegistration: "yes" | "no";
  sgkServiceList: "yes" | "no";
  penaltyPoints: "yes" | "no";
  active: boolean;
  healthStartDate: Date | undefined;
  healthEndDate: Date | undefined;
  seatStartDate: Date | undefined;
  seatEndDate: Date | undefined;
  psychoStartDate: Date | undefined;
  psychoEndDate: Date | undefined;
}

export const getInitialFormState = (): FormState => ({
  name: "",
  sicilNo: "",
  phone: "",
  licensePlatePrefix: "",
  licensePlateNumber: "",
  vehicleAge: 0,
  startDate: new Date(),
  endDate: addDays(new Date(), 365),
  ownerType: "owner",
  criminalRecord: "no",
  taxCertificate: "no",
  chamberRegistration: "no",
  sgkServiceList: "no",
  penaltyPoints: "no",
  active: true,
  healthStartDate: new Date(),
  healthEndDate: addDays(new Date(), 365),
  seatStartDate: new Date(),
  seatEndDate: addDays(new Date(), 365),
  psychoStartDate: new Date(),
  psychoEndDate: addDays(new Date(), 365),
});

export const getFormStateFromLicenseData = (currentItem: LicenseData): FormState => {
  // Split license plate into prefix and number
  const plateMatch = currentItem.licensePlate.match(/(\d{2})\s*([A-Z])\s*(\d+)/);
  const licensePlatePrefix = plateMatch ? plateMatch[1] : "";
  const licensePlateNumber = plateMatch ? plateMatch[3] : "";

  return {
    name: currentItem.name,
    sicilNo: currentItem.sicilNo || "",
    phone: currentItem.phone || "",
    licensePlatePrefix,
    licensePlateNumber,
    vehicleAge: currentItem.vehicleAge,
    startDate: currentItem.startDate,
    endDate: currentItem.endDate,
    ownerType: currentItem.ownerType || "owner",
    criminalRecord: currentItem.criminalRecord || "no",
    taxCertificate: currentItem.taxCertificate || "no",
    chamberRegistration: currentItem.chamberRegistration || "no",
    sgkServiceList: currentItem.sgkServiceList || "no",
    penaltyPoints: currentItem.penaltyPoints || "no",
    active: currentItem.active !== undefined ? currentItem.active : true,
    healthStartDate: currentItem.healthReport?.startDate || new Date(),
    healthEndDate: currentItem.healthReport?.endDate || addDays(new Date(), 365),
    seatStartDate: currentItem.seatInsurance?.startDate || new Date(),
    seatEndDate: currentItem.seatInsurance?.endDate || addDays(new Date(), 365),
    psychoStartDate: currentItem.psychotechnic?.startDate || new Date(),
    psychoEndDate: currentItem.psychotechnic?.endDate || addDays(new Date(), 365),
  };
};
