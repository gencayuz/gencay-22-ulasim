
import { useState, useEffect } from "react";
import { LicenseData } from "@/types/license";
import { toast } from "sonner";
import { getInitialFormState, getFormStateFromLicenseData } from "./formInitialization";
import { useFormState } from "./useFormState";
import { validateLicenseForm, FormErrors } from "./formValidation";
import { prepareLicenseFormData } from "./formDataPreparation";

export const useLicenseForm = (currentItem: LicenseData | null, plateType: string) => {
  const formState = useFormState();
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (currentItem) {
      const formStateData = getFormStateFromLicenseData(currentItem);
      formState.setFormState(formStateData);
    } else {
      const resetState = getInitialFormState();
      formState.setFormState(resetState);
    }
    
    // Reset form errors
    setFormErrors({});
  }, [currentItem]);

  const validateForm = () => {
    const currentFormState = formState.getFormState();
    const errors = validateLicenseForm(currentFormState);
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const prepareFormData = () => {
    if (!validateForm()) {
      toast.error("Lütfen tüm alanları doldurun");
      return null;
    }
    
    const currentFormState = formState.getFormState();
    
    if (!currentFormState.startDate || !currentFormState.endDate || 
        !currentFormState.healthStartDate || !currentFormState.healthEndDate || 
        !currentFormState.psychoStartDate || !currentFormState.psychoEndDate) {
      toast.error("Tarih alanları geçerli değil");
      return null;
    }
    
    return prepareLicenseFormData(currentFormState, plateType, currentItem?.id);
  };

  return {
    // Spread all form state
    ...formState,
    
    // Validation
    formErrors,
    validateForm,
    prepareFormData
  };
};
