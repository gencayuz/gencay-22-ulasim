
import { Input } from "@/components/ui/input";

interface LicensePlateFieldProps {
  licensePlatePrefix: string;
  setLicensePlatePrefix: (value: string) => void;
  licensePlateNumber: string;
  setLicensePlateNumber: (value: string) => void;
  plateType: string;
  formErrors: {[key: string]: boolean};
}

export const LicensePlateField = ({
  licensePlatePrefix,
  setLicensePlatePrefix,
  licensePlateNumber,
  setLicensePlateNumber,
  plateType,
  formErrors
}: LicensePlateFieldProps) => {
  return (
    <div className="grid grid-cols-4 items-center gap-4">
      <label htmlFor="licensePlate" className="text-right">
        Araç Plakası
      </label>
      <div className="col-span-3 flex gap-2">
        <Input
          id="licensePlatePrefix"
          value={licensePlatePrefix}
          onChange={(e) => {
            // Only allow numbers and max 2 digits
            const value = e.target.value.replace(/\D/g, '').slice(0, 2);
            setLicensePlatePrefix(value);
          }}
          className={`w-20 text-center ${formErrors.licensePlatePrefix ? 'border-red-500' : ''}`}
          placeholder="34"
          maxLength={2}
          required
        />
        <div className="flex items-center justify-center w-10 text-center bg-gray-100 rounded-md border">
          {plateType}
        </div>
        <Input
          id="licensePlateNumber"
          value={licensePlateNumber}
          onChange={(e) => {
            // Only allow numbers and max 5 digits
            const value = e.target.value.replace(/\D/g, '').slice(0, 5);
            setLicensePlateNumber(value);
          }}
          className={`flex-1 ${formErrors.licensePlateNumber ? 'border-red-500' : ''}`}
          placeholder="12345"
          maxLength={5}
          required
        />
      </div>
    </div>
  );
};
