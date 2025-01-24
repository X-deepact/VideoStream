import { Label } from "@/components/ui/label.tsx";
interface FieldLabelProps {
  label: string;
  isRequired?: boolean;
}
const FieldLabel: React.FC<FieldLabelProps> = ({ label, isRequired }) => {
  if (!label) {
    return null; // or return a default value
  }
  if (isRequired) {
    return (
      <Label>
        {label} <span className="text-red-500">*</span>
      </Label>
    );
  }
  return <Label>{label}</Label>;
};

export default FieldLabel;
