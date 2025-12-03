'use client';

import * as React from 'react';
import { ChevronDownIcon } from 'lucide-react';
import {
    Button,
    Calendar,
    Label,
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '#/components/ui';

export interface DateFieldProps {
    id: string;
    label: string;
    value: Date | undefined;
    onChange: (date: Date | undefined) => void;
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
    error?: string;
    description?: string;
    className?: string;
    captionLayout?: 'dropdown' | 'label' | 'dropdown-months' | 'dropdown-years';
}

export const DateField = ({
    id,
    label,
    value,
    onChange,
    placeholder = 'Select date',
    required = false,
    disabled = false,
    error,
    description,
    className = '',
    captionLayout = 'dropdown',
}: DateFieldProps) => {
    const [open, setOpen] = React.useState(false);

    const handleSelect = (date: Date | undefined) => {
        onChange(date);
        setOpen(false);
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
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        id={id}
                        className={`w-full justify-between font-normal ${
                            error
                                ? 'border-destructive focus-visible:ring-destructive'
                                : ''
                        }`}
                        disabled={disabled}
                    >
                        {value ? value.toLocaleDateString() : placeholder}
                        <ChevronDownIcon className="h-4 w-4 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent
                    className="w-auto overflow-hidden p-0"
                    align="start"
                >
                    <Calendar
                        mode="single"
                        selected={value}
                        captionLayout={captionLayout}
                        onSelect={handleSelect}
                        disabled={disabled}
                    />
                </PopoverContent>
            </Popover>
            {description && (
                <p className="text-xs text-muted-foreground">{description}</p>
            )}
            {error && <p className="text-xs text-destructive">{error}</p>}
        </div>
    );
};
