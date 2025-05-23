
import { FormField } from "./FormField";
import { SelectField } from "./SelectField";
import { OwnerTypeField } from "./OwnerTypeField";
import { LicensePlateField } from "./LicensePlateField";
import { DateRangeFields } from "@/components/DateRangeFields";

interface LicenseFormProps {
  formState: ReturnType<typeof import("./useLicenseForm").useLicenseForm>;
  plateType: string;
}

export const LicenseForm = ({ formState, plateType }: LicenseFormProps) => {
  const {
    name, setName,
    sicilNo, setSicilNo,
    phone, setPhone,
    licensePlatePrefix, setLicensePlatePrefix,
    licensePlateNumber, setLicensePlateNumber,
    vehicleAge, setVehicleAge,
    startDate, setStartDate,
    endDate, setEndDate,
    ownerType, setOwnerType,
    criminalRecord, setCriminalRecord,
    taxCertificate, setTaxCertificate,
    chamberRegistration, setChamberRegistration,
    active, setActive,
    
    // Date ranges
    healthStartDate, setHealthStartDate,
    healthEndDate, setHealthEndDate,
    seatStartDate, setSeatStartDate,
    seatEndDate, setSeatEndDate,
    psychoStartDate, setPsychoStartDate,
    psychoEndDate, setPsychoEndDate,
    
    formErrors
  } = formState;

  return (
    <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto">
      <FormField
        id="name"
        label="Adı Soyadı"
        value={name}
        onChange={setName}
        hasError={!!formErrors.name}
        required={true}
      />
      
      <FormField
        id="sicilNo"
        label="Sicil Num."
        value={sicilNo}
        onChange={setSicilNo}
      />
      
      <OwnerTypeField 
        ownerType={ownerType}
        setOwnerType={setOwnerType}
        active={active}
        setActive={setActive}
      />
      
      <LicensePlateField
        licensePlatePrefix={licensePlatePrefix}
        setLicensePlatePrefix={setLicensePlatePrefix}
        licensePlateNumber={licensePlateNumber}
        setLicensePlateNumber={setLicensePlateNumber}
        plateType={plateType}
        formErrors={formErrors}
      />

      <FormField
        id="phone"
        label="Telefon"
        value={phone}
        onChange={setPhone}
        placeholder="05xx xxx xx xx"
        hasError={!!formErrors.phone}
        required={true}
      />
      
      <FormField
        id="vehicleAge"
        label="Araç Yaşı"
        value={vehicleAge}
        onChange={setVehicleAge}
        type="number"
        hasError={!!formErrors.vehicleAge}
        required={true}
      />

      <SelectField
        id="criminalRecord"
        label="Sabıka Kaydı"
        value={criminalRecord}
        onValueChange={(value) => setCriminalRecord(value as "yes" | "no")}
        options={[
          { value: "yes", label: "Var" },
          { value: "no", label: "Yok" }
        ]}
      />
      
      <SelectField
        id="taxCertificate"
        label="Vergi Levhası"
        value={taxCertificate}
        onValueChange={(value) => setTaxCertificate(value as "yes" | "no")}
        options={[
          { value: "yes", label: "Var" },
          { value: "no", label: "Yok" }
        ]}
      />
      
      <SelectField
        id="chamberRegistration"
        label="Oda Kaydı"
        value={chamberRegistration}
        onValueChange={(value) => setChamberRegistration(value as "yes" | "no")}
        options={[
          { value: "yes", label: "Var" },
          { value: "no", label: "Yok" }
        ]}
      />
      
      <DateRangeFields 
        label="Ruhsat Tarihleri"
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
        hasErrors={!!formErrors.startDate || !!formErrors.endDate}
      />
      
      <DateRangeFields 
        label="Sağlık Raporu"
        startDate={healthStartDate}
        endDate={healthEndDate}
        onStartDateChange={setHealthStartDate}
        onEndDateChange={setHealthEndDate}
        hasErrors={!!formErrors.healthStartDate || !!formErrors.healthEndDate}
      />
      
      <DateRangeFields 
        label="Koltuk Sigortası"
        startDate={seatStartDate}
        endDate={seatEndDate}
        onStartDateChange={setSeatStartDate}
        onEndDateChange={setSeatEndDate}
        hasErrors={!!formErrors.seatStartDate || !!formErrors.seatEndDate}
      />
      
      <DateRangeFields 
        label="Psikoteknik Belgesi"
        startDate={psychoStartDate}
        endDate={psychoEndDate}
        onStartDateChange={setPsychoStartDate}
        onEndDateChange={setPsychoEndDate}
        hasErrors={!!formErrors.psychoStartDate || !!formErrors.psychoEndDate}
      />
    </div>
  );
};
