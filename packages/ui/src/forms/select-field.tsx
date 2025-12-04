import { ChevronDown, Edit3 } from 'lucide-react';
import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';

/**
 * Option type for SelectField - can be a simple string or an object with label/value
 */
export type SelectOption =
  | string
  | {
      label: string;
      value: string;
      /** Optional icon or custom element to render before the label */
      icon?: React.ReactNode;
      /** Optional color for visual indicator */
      color?: string;
      /** Whether this option is disabled */
      disabled?: boolean;
    };

export interface SelectFieldProps {
  id: string;
  /** Label for the field. Can be hidden with hideLabel for inline usage */
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  /** Options can be strings or objects with label/value/icon/color */
  options: readonly SelectOption[] | SelectOption[];
  allowCustom?: boolean;
  customLabel?: string;
  disabled?: boolean;
  className?: string;
  /** Custom className for the trigger button */
  triggerClassName?: string;
  description?: string;
  error?: string;
  /** Hide the label for inline/compact usage */
  hideLabel?: boolean;
}

/** Helper to normalize options to object format */
function normalizeOption(option: SelectOption): {
  label: string;
  value: string;
  icon?: React.ReactNode;
  color?: string;
  disabled?: boolean;
} {
  if (typeof option === 'string') {
    return { label: option, value: option };
  }
  return option;
}

/** Helper to get all option values */
function getOptionValues(
  options: readonly SelectOption[] | SelectOption[],
): string[] {
  return options.map((opt) => (typeof opt === 'string' ? opt : opt.value));
}

export const SelectField: React.FC<SelectFieldProps> = ({
  id,
  label,
  value,
  onChange,
  placeholder = 'Select an option',
  required = false,
  options,
  allowCustom = false,
  customLabel = 'Other',
  disabled = false,
  className = '',
  triggerClassName = '',
  description,
  error,
  hideLabel = false,
}) => {
  const optionValues = getOptionValues(options);

  const [isCustomMode, setIsCustomMode] = useState(() => {
    // Check if current value is custom (not in options and not empty)
    return (
      allowCustom &&
      value &&
      !optionValues.includes(value) &&
      value !== customLabel
    );
  });

  const handleSelectChange = (selectedValue: string) => {
    if (selectedValue === customLabel && allowCustom) {
      setIsCustomMode(true);
      onChange(''); // Clear value to show custom input
    } else {
      setIsCustomMode(false);
      onChange(selectedValue);
    }
  };

  const handleCustomInputChange = (inputValue: string) => {
    onChange(inputValue);
  };

  const switchToDropdown = () => {
    setIsCustomMode(false);
    onChange('');
  };

  const showLabel = label && !hideLabel;

  return (
    <div className={`${showLabel ? 'space-y-2' : ''} ${className}`}>
      {showLabel && (
        <Label
          htmlFor={id}
          className={`text-sm font-medium ${error ? 'text-destructive' : ''}`}
        >
          {label} {required && <span className="text-destructive">*</span>}
        </Label>
      )}
      {isCustomMode ? (
        <Input
          id={id}
          type="text"
          placeholder={`Enter custom ${(label || 'value').toLowerCase()}`}
          value={value}
          onChange={(e) => handleCustomInputChange(e.target.value)}
          required={required}
          disabled={disabled}
          className={
            error ? 'border-destructive focus-visible:ring-destructive' : ''
          }
        />
      ) : (
        <Select
          value={value && optionValues.includes(value) ? value : ''}
          onValueChange={handleSelectChange}
          disabled={disabled}
        >
          <SelectTrigger
            className={`w-full h-10 ${error ? 'border-destructive focus:ring-destructive' : ''} ${triggerClassName}`}
          >
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent className="max-h-[300px]">
            {options.map((option) => {
              const normalized = normalizeOption(option);
              if (normalized.value === customLabel) return null;
              return (
                <SelectItem
                  key={normalized.value}
                  value={normalized.value}
                  disabled={normalized.disabled}
                  className="cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    {normalized.color && (
                      <div
                        className="h-3 w-3 rounded-full shrink-0"
                        style={{ backgroundColor: normalized.color }}
                      />
                    )}
                    {normalized.icon}
                    {normalized.label}
                  </div>
                </SelectItem>
              );
            })}
            {allowCustom && options.length > 0 && (
              <>
                <div className="h-px bg-border my-1 mx-2" />
                <SelectItem
                  value={customLabel}
                  className="cursor-pointer text-muted-foreground"
                >
                  <div className="flex items-center">
                    <Edit3 className="w-3 h-3 mr-2" />
                    {customLabel}
                  </div>
                </SelectItem>
              </>
            )}
          </SelectContent>
        </Select>
      )}
      {isCustomMode && allowCustom && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={switchToDropdown}
          disabled={disabled}
          className="h-8 px-3 text-xs text-muted-foreground hover:text-foreground"
        >
          <ChevronDown className="w-3 h-3 mr-1" />
          Choose from list
        </Button>
      )}
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
};

export default SelectField;
