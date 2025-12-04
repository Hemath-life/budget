import React from 'react';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';

export interface SwitchFieldProps {
  id: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  description?: string;
  error?: string;
}

export const SwitchField: React.FC<SwitchFieldProps> = ({
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
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Label
            htmlFor={id}
            className={`text-sm font-medium ${error ? 'text-destructive' : ''} ${disabled ? 'opacity-50' : ''}`}
          >
            {label} {required && <span className="text-destructive">*</span>}
          </Label>
          {description && (
            <p
              className={`text-xs text-muted-foreground ${disabled ? 'opacity-50' : ''}`}
            >
              {description}
            </p>
          )}
        </div>
        <Switch
          id={id}
          checked={checked}
          onCheckedChange={handleCheckedChange}
          disabled={disabled}
        />
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
};

export default SwitchField;
