
export interface FormErrors {
  [key: string]: boolean;
}

export const validateLicenseForm = (formData: {
  name: string;
  phone: string;
  licensePlatePrefix: string;
  licensePlateNumber: string;
  vehicleAge: number;
  startDate: Date | undefined;
  endDate: Date | undefined;
  healthStartDate: Date | undefined;
  healthEndDate: Date | undefined;
  seatStartDate: Date | undefined;
  seatEndDate: Date | undefined;
  psychoStartDate: Date | undefined;
  psychoEndDate: Date | undefined;
}): FormErrors => {
  const errors: FormErrors = {};
  
  if (!formData.name) errors.name = true;
  if (!formData.phone) errors.phone = true;
  if (!formData.licensePlatePrefix) errors.licensePlatePrefix = true;
  if (!formData.licensePlateNumber) errors.licensePlateNumber = true;
  if (formData.vehicleAge < 0) errors.vehicleAge = true;
  if (!formData.startDate) errors.startDate = true;
  if (!formData.endDate) errors.endDate = true;
  if (!formData.healthStartDate) errors.healthStartDate = true;
  if (!formData.healthEndDate) errors.healthEndDate = true;
  if (!formData.seatStartDate) errors.seatStartDate = true;
  if (!formData.seatEndDate) errors.seatEndDate = true;
  if (!formData.psychoStartDate) errors.psychoStartDate = true;
  if (!formData.psychoEndDate) errors.psychoEndDate = true;
  
  // Validate license plate prefix is numeric and 2 digits
  if (!/^\d{1,2}$/.test(formData.licensePlatePrefix)) {
    errors.licensePlatePrefix = true;
  }
  
  // Validate license plate number is numeric and max 5 digits
  if (!/^\d{1,5}$/.test(formData.licensePlateNumber)) {
    errors.licensePlateNumber = true;
  }
  
  return errors;
};
