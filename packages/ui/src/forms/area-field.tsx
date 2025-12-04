import React from 'react';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';

export interface AreaFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  maxLength?: number;
  rows?: number;
  className?: string;
  description?: string;
  error?: string;
}

export const AreaField: React.FC<AreaFieldProps> = ({
  id,
  label,
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  maxLength,
  rows = 3,
  className = '',
  description,
  error,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <Label
        htmlFor={id}
        className={`text-sm font-medium ${error ? 'text-destructive' : ''}`}
      >
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      <Textarea
        id={id}
        placeholder={placeholder}
        value={value || ''}
        onChange={handleChange}
        required={required}
        maxLength={maxLength}
        disabled={disabled}
        rows={rows}
        className={
          error ? 'border-destructive focus-visible:ring-destructive' : ''
        }
      />
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
};

export default AreaField;
