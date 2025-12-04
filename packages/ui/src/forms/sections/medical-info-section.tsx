import { FileText } from 'lucide-react';
import { AreaField } from '../area-field';
import { FormSection } from '../form-section';

export interface MedicalInfoData {
  medicalConditions?: string;
  allergies?: string;
}

export interface MedicalInfoSectionProps {
  data: MedicalInfoData;
  onChange: (field: keyof MedicalInfoData, value: string) => void;
  className?: string;
  title?: string;
  showIcon?: boolean;
  medicalConditionsLabel?: string;
  medicalConditionsPlaceholder?: string;
  allergiesLabel?: string;
  allergiesPlaceholder?: string;
}

export const MedicalInfoSection = ({
  data,
  onChange,
  className = 'p-6 bg-card border rounded',
  title = 'Medical Information',
  showIcon = true,
  medicalConditionsLabel = 'Medical Conditions',
  medicalConditionsPlaceholder = 'Enter any medical conditions or chronic illnesses',
  allergiesLabel = 'Allergies',
  allergiesPlaceholder = 'Enter any known allergies',
}: MedicalInfoSectionProps) => {
  return (
    <FormSection
      title={title}
      icon={showIcon ? <FileText className="w-5 h-5" /> : undefined}
      className={className}
      fields={[
        <AreaField
          key="medicalConditions"
          id="medicalConditions"
          label={medicalConditionsLabel}
          value={data.medicalConditions || ''}
          onChange={(value: string) => onChange('medicalConditions', value)}
          placeholder={medicalConditionsPlaceholder}
        />,
        <AreaField
          key="allergies"
          id="allergies"
          label={allergiesLabel}
          value={data.allergies || ''}
          onChange={(value: string) => onChange('allergies', value)}
          placeholder={allergiesPlaceholder}
        />,
      ]}
    />
  );
};

MedicalInfoSection.displayName = 'MedicalInfoSection';
