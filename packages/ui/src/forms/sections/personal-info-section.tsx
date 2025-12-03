import { User } from 'lucide-react';
import { DateField } from '../date-field';
import { FormField } from '../form-field';
import { FormSection } from '../form-section';
import { SelectField } from '../select-field';

export interface PersonalInfoData {
    firstName: string;
    middleName?: string;
    lastName: string;
    email: string;
    secondaryEmail?: string;
    phoneNumber: string;
    secondaryPhoneNumber?: string;
    dob: string;
    gender: string;
}

export interface PersonalInfoSectionProps {
    data: PersonalInfoData;
    onChange: (field: keyof PersonalInfoData, value: string) => void;
    className?: string;
    title?: string;
    showIcon?: boolean;
    genderOptions?: string[];
}

export const PersonalInfoSection = ({
    data,
    onChange,
    className = 'p-6 bg-card border rounded',
    title = 'Personal Information',
    showIcon = true,
    genderOptions = ['Male', 'Female', 'Other'],
}: PersonalInfoSectionProps) => {
    return (
        <FormSection
            title={title}
            icon={showIcon ? <User className="w-5 h-5" /> : undefined}
            className={className}
            fields={[
                <FormField
                    key="firstName"
                    id="firstName"
                    label="First Name"
                    value={data.firstName}
                    onChange={(value: string) => onChange('firstName', value)}
                    placeholder="Enter first name"
                    required
                />,
                <FormField
                    key="middleName"
                    id="middleName"
                    label="Middle Name"
                    value={data.middleName || ''}
                    onChange={(value: string) => onChange('middleName', value)}
                    placeholder="Enter middle name"
                />,
                <FormField
                    key="lastName"
                    id="lastName"
                    label="Last Name"
                    value={data.lastName}
                    onChange={(value: string) => onChange('lastName', value)}
                    placeholder="Enter last name"
                    required
                />,
                <FormField
                    key="email"
                    id="email"
                    label="Email"
                    type="email"
                    value={data.email}
                    onChange={(value: string) => onChange('email', value)}
                    placeholder="Enter email"
                    required
                />,
                <FormField
                    key="secondaryEmail"
                    id="secondaryEmail"
                    label="Secondary Email"
                    type="email"
                    value={data.secondaryEmail || ''}
                    onChange={(value: string) =>
                        onChange('secondaryEmail', value)
                    }
                    placeholder="Enter secondary email"
                />,
                <FormField
                    key="phoneNumber"
                    id="phoneNumber"
                    label="Phone Number"
                    value={data.phoneNumber}
                    onChange={(value: string) => onChange('phoneNumber', value)}
                    placeholder="Enter phone number"
                    required
                />,
                <FormField
                    key="secondaryPhoneNumber"
                    id="secondaryPhoneNumber"
                    label="Secondary Phone Number"
                    value={data.secondaryPhoneNumber || ''}
                    onChange={(value: string) =>
                        onChange('secondaryPhoneNumber', value)
                    }
                    placeholder="Enter secondary phone number"
                />,
                <DateField
                    key="dob"
                    id="dob"
                    label="Date of Birth"
                    value={data.dob ? new Date(data.dob) : undefined}
                    onChange={(date) =>
                        onChange('dob', date?.toISOString() || '')
                    }
                    placeholder="Select date of birth"
                    required
                />,
                <SelectField
                    key="gender"
                    id="gender"
                    label="Gender"
                    required
                    value={data.gender}
                    onChange={(value: string) => onChange('gender', value)}
                    options={genderOptions}
                />,
            ]}
        />
    );
};

PersonalInfoSection.displayName = 'PersonalInfoSection';
