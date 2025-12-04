import React from 'react';

export interface FormSectionProps {
  title: string;
  fields: React.ReactElement[];
  className?: string;
  icon?: React.ReactNode;
  bordered?: boolean;
}

export const FormSection = ({
  title,
  fields,
  className,
  icon,
  bordered,
}: FormSectionProps) => (
  <div className={`space-y-4 ${className || ''}`}>
    <div
      className={`flex items-center gap-2 ${bordered ? 'pb-2 border-b' : ''}`}
    >
      {icon && <div className="text-primary flex-shrink-0">{icon}</div>}
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
        {title}
      </h3>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{fields}</div>
  </div>
);

FormSection.displayName = 'FormSection';
