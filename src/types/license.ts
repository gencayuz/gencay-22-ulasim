
export interface DateRange {
  startDate: Date;
  endDate: Date;
}

export interface LicenseData {
  id: string;
  name: string;
  phone: string;
  licensePlate: string;
  vehicleAge: number;
  startDate: Date;
  endDate: Date;
  healthReport: DateRange;
  seatInsurance: DateRange;
  psychotechnic: DateRange;
  srcCertificate?: DateRange;
  licenseDocument?: string | null;
  ownerType?: "owner" | "driver";
  criminalRecord?: "yes" | "no";
  type?: string;
  taxCertificate?: "yes" | "no"; // New field for tax certificate
  chamberRegistration?: "yes" | "no"; // New field for chamber registration
  active: boolean; // New field for active status
}
