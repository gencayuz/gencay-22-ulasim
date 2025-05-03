
import { LicenseData } from "@/types/license";
import { differenceInDays } from "date-fns";

export const getRowStatus = (endDate: Date) => {
  const today = new Date();
  const daysUntilExpiry = differenceInDays(endDate, today);
  
  if (daysUntilExpiry < 0) {
    return "danger"; // Expired
  } else if (daysUntilExpiry <= 7) {
    return "warning"; // Expiring soon
  }
  return "normal"; // Valid
};

export const getWorstStatus = (statuses: string[]) => {
  if (statuses.includes("danger")) return "danger";
  if (statuses.includes("warning")) return "warning";
  return "normal";
};

export const sortByOwnerType = (data: LicenseData[]) => {
  return [...data].sort((a, b) => {
    if (a.ownerType === "owner" && b.ownerType === "driver") return -1;
    if (a.ownerType === "driver" && b.ownerType === "owner") return 1;
    return 0;
  });
};

export const filterLicenseData = (data: LicenseData[], searchTerm: string) => {
  const filtered = data.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.licensePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.phone?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Always sort filtered data so owners come first
  return sortByOwnerType(filtered);
};
