'use client';

import { Label } from '@repo/ui/components/ui';

interface FormFieldProps {
  label: string;
  optional?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function FormField({
  label,
  optional,
  children,
  className,
}: FormFieldProps) {
  return (
    <div className={className}>
      <Label className="text-xs text-muted-foreground mb-1.5 block">
        {label}
        {optional && <span className="opacity-50"> (optional)</span>}
      </Label>
      {children}
    </div>
  );
}
