
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
}
