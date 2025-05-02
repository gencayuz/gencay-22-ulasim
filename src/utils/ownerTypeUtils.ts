
import { LicenseData } from "../types/license";

// Function to get the owner type label in Turkish
export function getOwnerTypeLabel(ownerType: string | undefined): string {
  switch (ownerType) {
    case "owner":
      return "Araç Sahibi";
    case "driver":
      return "Şoför";
    default:
      return "Araç Sahibi";
  }
}

// Check if a license data has owner type specified
export function hasOwnerType(data: LicenseData): boolean {
  return !!data.ownerType;
}
