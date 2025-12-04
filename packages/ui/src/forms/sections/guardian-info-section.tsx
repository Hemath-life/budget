import { Users } from 'lucide-react';
import { FormField } from '../form-field';
import { FormSection } from '../form-section';
import { SelectField } from '../select-field';

export interface GuardianInfoData {
  guardianName: string;
  guardianRelation: string;
  guardianPhone: string;
  guardianEmail?: string;
  guardianOccupation?: string;
}

export interface GuardianInfoSectionProps {
  data: GuardianInfoData;
  onChange: (field: keyof GuardianInfoData, value: string) => void;
  className?: string;
  title?: string;
  showIcon?: boolean;
  relationOptions?: string[];
}

export const GuardianInfoSection = ({
  data,
  onChange,
  className = 'p-6 bg-card border rounded',
  title = 'Guardian Information',
  showIcon = true,
  relationOptions = ['Father', 'Mother', 'Guardian', 'Other'],
}: GuardianInfoSectionProps) => {
  return (
    <FormSection
      title={title}
      icon={showIcon ? <Users className="w-5 h-5" /> : undefined}
      className={className}
      fields={[
        <FormField
          key="guardianName"
          id="guardianName"
          label="Guardian Name"
          value={data.guardianName}
          onChange={(value: string) => onChange('guardianName', value)}
          placeholder="Enter guardian name"
          required
        />,
        <SelectField
          key="guardianRelation"
          id="guardianRelation"
          label="Relation"
          required
          value={data.guardianRelation}
          onChange={(value: string) => onChange('guardianRelation', value)}
          options={relationOptions}
          placeholder="Select relation"
        />,
        <FormField
          key="guardianPhone"
          id="guardianPhone"
          label="Guardian Phone"
          type="tel"
          value={data.guardianPhone}
          onChange={(value: string) => onChange('guardianPhone', value)}
          placeholder="+91 98765 43210"
          required
        />,
        <FormField
          key="guardianEmail"
          id="guardianEmail"
          label="Guardian Email"
          type="email"
          value={data.guardianEmail || ''}
          onChange={(value: string) => onChange('guardianEmail', value)}
          placeholder="guardian@example.com"
        />,
        <FormField
          key="guardianOccupation"
          id="guardianOccupation"
          label="Guardian Occupation"
          value={data.guardianOccupation || ''}
          onChange={(value: string) => onChange('guardianOccupation', value)}
          placeholder="Enter occupation"
        />,
      ]}
    />
  );
};

GuardianInfoSection.displayName = 'GuardianInfoSection';
