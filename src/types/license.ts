
export interface DateRange {
  startDate: Date;
  endDate: Date;
}

export interface LicenseData {
  id: string;
  name: string;
  sicilNo?: string; // Added new field for registration number
  phone: string;
  licensePlate: string;
  vehicleAge: number;
  startDate: Date;
  endDate: Date;
  healthReport: DateRange;
  seatInsurance?: DateRange; // Make optional
  psychotechnic: DateRange;
  srcCertificate?: DateRange;
  licenseDocument?: string | null;
  ownerType?: "owner" | "driver";
  criminalRecord?: "yes" | "no";
  type?: string;
  taxCertificate?: "yes" | "no"; 
  chamberRegistration?: "yes" | "no"; 
  sgkServiceList?: "yes" | "no"; // Added SGK Hizmet Listesi field
  penaltyPoints?: "yes" | "no"; // Added Ceza Puan Durumu field
  active: boolean;
}
