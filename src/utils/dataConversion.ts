
import { LicenseData } from "@/types/license";
import { ApiLicenseData } from "./apiService";

export const convertLicenseDataToApi = (data: LicenseData): ApiLicenseData => {
  return {
    id: data.id,
    name: data.name,
    sicilNo: data.sicilNo,
    phone: data.phone,
    licensePlate: data.licensePlate,
    vehicleAge: data.vehicleAge,
    startDate: data.startDate.toISOString(),
    endDate: data.endDate.toISOString(),
    healthReport: {
      startDate: data.healthReport.startDate.toISOString(),
      endDate: data.healthReport.endDate.toISOString(),
    },
    seatInsurance: data.seatInsurance ? {
      startDate: data.seatInsurance.startDate.toISOString(),
      endDate: data.seatInsurance.endDate.toISOString(),
    } : undefined,
    psychotechnic: {
      startDate: data.psychotechnic.startDate.toISOString(),
      endDate: data.psychotechnic.endDate.toISOString(),
    },
    ownerType: data.ownerType,
    criminalRecord: data.criminalRecord,
    taxCertificate: data.taxCertificate,
    chamberRegistration: data.chamberRegistration,
    sgkServiceList: data.sgkServiceList,
    penaltyPoints: data.penaltyPoints,
    active: data.active,
  };
};

export const convertApiDataToLicense = (data: ApiLicenseData): LicenseData => {
  return {
    id: data.id,
    name: data.name,
    sicilNo: data.sicilNo,
    phone: data.phone,
    licensePlate: data.licensePlate,
    vehicleAge: data.vehicleAge,
    startDate: new Date(data.startDate),
    endDate: new Date(data.endDate),
    healthReport: {
      startDate: new Date(data.healthReport.startDate),
      endDate: new Date(data.healthReport.endDate),
    },
    seatInsurance: data.seatInsurance ? {
      startDate: new Date(data.seatInsurance.startDate),
      endDate: new Date(data.seatInsurance.endDate),
    } : undefined,
    psychotechnic: {
      startDate: new Date(data.psychotechnic.startDate),
      endDate: new Date(data.psychotechnic.endDate),
    },
    ownerType: data.ownerType || "owner",
    criminalRecord: data.criminalRecord || "no",
    taxCertificate: data.taxCertificate || "no",
    chamberRegistration: data.chamberRegistration || "no",
    sgkServiceList: data.sgkServiceList || "no",
    penaltyPoints: data.penaltyPoints || "no",
    active: data.active,
  };
};
