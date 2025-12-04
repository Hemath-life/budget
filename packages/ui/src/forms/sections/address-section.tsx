import { MapPin } from 'lucide-react';
import { FormField } from '../form-field';
import { FormSection } from '../form-section';

export interface AddressData {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

export interface AddressSectionProps {
  data: AddressData;
  onChange: (field: keyof AddressData, value: string) => void;
  className?: string;
  title?: string;
  showIcon?: boolean;
}

export const AddressSection = ({
  data,
  onChange,
  className = 'p-6 bg-card border rounded',
  title = 'Address Information',
  showIcon = true,
}: AddressSectionProps) => {
  return (
    <FormSection
      title={title}
      icon={showIcon ? <MapPin className="w-5 h-5" /> : undefined}
      className={className}
      fields={[
        <FormField
          key="line1"
          id="line1"
          label="Address Line 1"
          value={data.line1}
          onChange={(value: string) => onChange('line1', value)}
          placeholder="Enter address line 1"
          required
        />,
        <FormField
          key="line2"
          id="line2"
          label="Address Line 2"
          value={data.line2 || ''}
          onChange={(value: string) => onChange('line2', value)}
          placeholder="Enter address line 2 (optional)"
        />,
        <FormField
          key="city"
          id="city"
          label="City"
          value={data.city}
          onChange={(value: string) => onChange('city', value)}
          placeholder="Enter city"
          required
        />,
        <FormField
          key="state"
          id="state"
          label="State"
          value={data.state}
          onChange={(value: string) => onChange('state', value)}
          placeholder="Enter state"
          required
        />,
        <FormField
          key="pincode"
          id="pincode"
          label="Pincode"
          value={data.pincode}
          onChange={(value: string) => onChange('pincode', value)}
          placeholder="Enter pincode"
          required
        />,
        <FormField
          key="country"
          id="country"
          label="Country"
          value={data.country}
          onChange={(value: string) => onChange('country', value)}
          placeholder="Enter country"
          required
        />,
      ]}
    />
  );
};

AddressSection.displayName = 'AddressSection';
