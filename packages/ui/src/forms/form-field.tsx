import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';

export interface FormFieldProps {
    id: string;
    label: string;
    value: string | number | Date;
    onChange: (value: string) => void;
    placeholder?: string;
    type?:
        | 'text'
        | 'email'
        | 'password'
        | 'number'
        | 'tel'
        | 'url'
        | 'search'
        | 'time'
        | 'month'
        | 'week'
        | 'color';
    required?: boolean;
    maxLength?: number;
    disabled?: boolean;
    error?: string;
    description?: string;
    className?: string;
    min?: string | number;
    max?: string | number;
    step?: string | number;
}

export const FormField = ({
    id,
    label,
    value,
    onChange,
    placeholder,
    type = 'text',
    required = false,
    maxLength,
    disabled = false,
    error,
    description,
    className = '',
    min,
    max,
    step,
}: FormFieldProps) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        onChange(newValue);
    };

    const getInputValue = () => {
        if (value instanceof Date) {
            return value.toISOString().split('T')[0];
        }
        return String(value || '');
    };

    return (
        <div className={`space-y-2 ${className}`}>
            <Label
                htmlFor={id}
                className={`text-sm font-medium ${error ? 'text-destructive' : ''}`}
            >
                {label}{' '}
                {required && <span className="text-destructive">*</span>}
            </Label>

            <Input
                id={id}
                type={type}
                placeholder={placeholder}
                value={getInputValue()}
                onChange={handleChange}
                required={required}
                maxLength={maxLength}
                disabled={disabled}
                min={type === 'number' ? min : undefined}
                max={type === 'number' ? max : undefined}
                step={type === 'number' ? step : undefined}
                className={
                    error
                        ? 'border-destructive focus-visible:ring-destructive'
                        : ''
                }
            />
            {description && (
                <p className="text-xs text-muted-foreground">{description}</p>
            )}
            {error && <p className="text-xs text-destructive">{error}</p>}
        </div>
    );
};
