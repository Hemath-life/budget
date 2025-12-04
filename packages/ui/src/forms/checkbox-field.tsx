import type { ReactNode } from 'react';
import React from 'react';
import { Checkbox } from '../components/ui/checkbox';
import { Label } from '../components/ui/label';

export interface CheckboxFieldProps {
  id: string;
  label: ReactNode;
  checked: boolean;
  onChange: (checked: boolean) => void;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  description?: ReactNode;
  error?: string;
}

export const CheckboxField: React.FC<CheckboxFieldProps> = ({
  id,
  label,
  checked,
  onChange,
  required = false,
  disabled = false,
  className = '',
  description,
  error,
}) => {
  const handleCheckedChange = (checkedValue: boolean) => {
    onChange(checkedValue);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center space-x-3">
        <Checkbox
          id={id}
          checked={checked}
          onCheckedChange={handleCheckedChange}
          disabled={disabled}
          className={`${error ? 'border-destructive' : ''} mt-0.5`}
        />
        <div className="space-y-1 leading-none flex-1">
          <Label
            htmlFor={id}
            className={`text-sm font-medium cursor-pointer leading-5 ${error ? 'text-destructive' : ''} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {label} {required && <span className="text-destructive">*</span>}
          </Label>
          {description && (
            <p
              className={`text-xs text-muted-foreground leading-4 ${disabled ? 'opacity-50' : ''}`}
            >
              {description}
            </p>
          )}
        </div>
      </div>
      {error && <p className="text-xs text-destructive ml-7">{error}</p>}
    </div>
  );
};

export default CheckboxField;
