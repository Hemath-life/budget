import { GraduationCap } from 'lucide-react';
import { DateField } from '../date-field';
import { FormField } from '../form-field';
import { FormSection } from '../form-section';
import { SelectField } from '../select-field';

export interface AcademicInfoData {
  class: string;
  section: string;
  rollNumber: string;
  admissionDate: string;
  previousSchool?: string;
  previousClass?: string;
}

export interface AcademicInfoSectionProps {
  data: AcademicInfoData;
  onChange: (field: keyof AcademicInfoData, value: string) => void;
  className?: string;
  title?: string;
  showIcon?: boolean;
  classOptions?: string[];
  sectionOptions?: string[];
}

export const AcademicInfoSection = ({
  data,
  onChange,
  className = 'p-6 bg-card border rounded',
  title = 'Academic Information',
  showIcon = true,
  classOptions = [
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '10',
    '11',
    '12',
  ],
  sectionOptions = ['A', 'B', 'C', 'D'],
}: AcademicInfoSectionProps) => {
  return (
    <FormSection
      title={title}
      icon={showIcon ? <GraduationCap className="w-5 h-5" /> : undefined}
      className={className}
      fields={[
        <SelectField
          key="class"
          id="class"
          label="Class"
          value={data.class}
          onChange={(value: string) => onChange('class', value)}
          options={classOptions}
          placeholder="Select class"
        />,
        <SelectField
          key="section"
          id="section"
          label="Section"
          value={data.section}
          onChange={(value: string) => onChange('section', value)}
          options={sectionOptions}
          placeholder="Select section"
        />,
        <FormField
          key="rollNumber"
          id="rollNumber"
          label="Roll Number"
          value={data.rollNumber}
          onChange={(value: string) => onChange('rollNumber', value)}
          placeholder="Enter roll number"
          required
        />,
        <DateField
          key="admissionDate"
          id="admissionDate"
          label="Admission Date"
          value={data.admissionDate ? new Date(data.admissionDate) : undefined}
          onChange={(date) =>
            onChange('admissionDate', date?.toISOString() || '')
          }
          placeholder="Select admission date"
          required
        />,
        <FormField
          key="previousSchool"
          id="previousSchool"
          label="Previous School"
          value={data.previousSchool || ''}
          onChange={(value: string) => onChange('previousSchool', value)}
          placeholder="Enter previous school name"
        />,
        <FormField
          key="previousClass"
          id="previousClass"
          label="Previous Class"
          value={data.previousClass || ''}
          onChange={(value: string) => onChange('previousClass', value)}
          placeholder="Enter previous class"
        />,
      ]}
    />
  );
};

AcademicInfoSection.displayName = 'AcademicInfoSection';
