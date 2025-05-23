
import { Input } from "@/components/ui/input";

interface FormFieldProps {
  id: string;
  label: string;
  value: string | number;
  onChange: (value: any) => void;
  placeholder?: string;
  hasError?: boolean;
  type?: "text" | "number";
  required?: boolean;
}

export const FormField = ({
  id,
  label,
  value,
  onChange,
  placeholder = "",
  hasError = false,
  type = "text",
  required = false
}: FormFieldProps) => {
  return (
    <div className="grid grid-cols-4 items-center gap-4">
      <label htmlFor={id} className="text-right">
        {label}
      </label>
      <Input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(type === "number" ? parseInt(e.target.value) : e.target.value)}
        placeholder={placeholder}
        className={`col-span-3 ${hasError ? 'border-red-500' : ''}`}
        required={required}
      />
    </div>
  );
};
