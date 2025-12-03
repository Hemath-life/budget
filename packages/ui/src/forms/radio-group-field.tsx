import React from "react";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { Label } from "../components/ui/label";

export interface RadioGroupFieldProps {
    id: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
    options: readonly { value: string; label: string; description?: string }[] | { value: string; label: string; description?: string }[];
    required?: boolean;
    disabled?: boolean;
    className?: string;
    description?: string;
    error?: string;
    orientation?: "vertical" | "horizontal";
}

export const RadioGroupField: React.FC<RadioGroupFieldProps> = ({
    id,
    label,
    value,
    onChange,
    options,
    required = false,
    disabled = false,
    className = "",
    description,
    error,
    orientation = "vertical",
}) => {
    const handleValueChange = (selectedValue: string) => {
        onChange(selectedValue);
    };

    return (
        <div className={`space-y-3 ${className}`}>
            <div className="space-y-1">
                <Label 
                    className={`text-sm font-medium ${error ? 'text-destructive' : ''} ${disabled ? 'opacity-50' : ''}`}
                >
                    {label} {required && <span className="text-destructive">*</span>}
                </Label>
                {description && (
                    <p className={`text-xs text-muted-foreground ${disabled ? 'opacity-50' : ''}`}>
                        {description}
                    </p>
                )}
            </div>
            
            <RadioGroup
                value={value}
                onValueChange={handleValueChange}
                disabled={disabled}
                className={orientation === "horizontal" ? "flex flex-wrap gap-6" : "flex flex-col space-y-2"}
            >
                {options.map((option, index) => (
                    <div key={option.value} className="flex items-start space-x-3">
                        <RadioGroupItem 
                            value={option.value} 
                            id={`${id}-${index}`}
                            className={error ? "border-destructive" : ""}
                        />
                        <div className="space-y-1 leading-none">
                            <Label 
                                htmlFor={`${id}-${index}`}
                                className={`text-sm font-normal cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {option.label}
                            </Label>
                            {option.description && (
                                <p className={`text-xs text-muted-foreground ${disabled ? 'opacity-50' : ''}`}>
                                    {option.description}
                                </p>
                            )}
                        </div>
                    </div>
                ))}
            </RadioGroup>
            
            {error && (
                <p className="text-xs text-destructive">{error}</p>
            )}
        </div>
    );
};

export default RadioGroupField;
