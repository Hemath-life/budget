// Core Form Fields
export { AreaField, type AreaFieldProps } from './area-field';
export { FormField, type FormFieldProps } from './form-field';
export { FormSection, type FormSectionProps } from './form-section';

// Selection Fields
export {
  RadioGroupField,
  type RadioGroupFieldProps,
} from './radio-group-field';
export { SelectDropdown } from './select-dropdown';
export {
  SelectField,
  type SelectFieldProps,
  type SelectOption,
} from './select-field';

// Toggle Fields
export { CheckboxField, type CheckboxFieldProps } from './checkbox-field';
export { SwitchField, type SwitchFieldProps } from './switch-field';

// Date & Time Fields
export { DateField, type DateFieldProps } from './date-field';

// Input Variants
export { PasswordInput } from './password-input';

// Profile & User
export { ProfileDropdown } from './profile-dropdown';

// Form Sections - Reusable grouped form fields
export {
  AcademicInfoSection,
  type AcademicInfoData,
  type AcademicInfoSectionProps,
} from './sections/academic-info-section';
export {
  AddressSection,
  type AddressData,
  type AddressSectionProps,
} from './sections/address-section';
export {
  GuardianInfoSection,
  type GuardianInfoData,
  type GuardianInfoSectionProps,
} from './sections/guardian-info-section';
export {
  GuardiansListSection,
  type GuardianInfo,
  type GuardiansListSectionProps,
} from './sections/guardians-list-section';
export {
  MedicalInfoSection,
  type MedicalInfoData,
  type MedicalInfoSectionProps,
} from './sections/medical-info-section';
export {
  PersonalInfoSection,
  type PersonalInfoData,
  type PersonalInfoSectionProps,
} from './sections/personal-info-section';
