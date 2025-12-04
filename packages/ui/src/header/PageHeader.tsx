import React from 'react';
import { Button } from '../components/ui/button';
import { cn } from '../lib/utils';

export interface HeaderAction {
  label: string;
  onClick: () => void;
  variant?:
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link';
  icon?: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
  className?: string;
  fixed?: boolean;
  actions?: HeaderAction[];
  showBorder?: boolean;
  background?: 'default' | 'transparent' | 'blur';
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  children,
  className,
  actions = [],
  showBorder = true,
  background = 'default',
}) => {
  const backgroundClasses = {
    default: 'bg-background',
    transparent: 'bg-transparent',
    blur: 'bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60',
  };

  const headerClasses = cn(
    'flex items-center justify-between pb-4',
    backgroundClasses[background],
    {
      'border-b border-border': showBorder,
    },
    className,
  );

  return (
    <header className={headerClasses}>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-bold tracking-tight text-foreground truncate">
              {title}
            </h1>
            {subtitle && (
              <p className="text-sm text-muted-foreground mt-1 truncate">
                {subtitle}
              </p>
            )}
          </div>

          {children && (
            <div className="flex items-center space-x-2 ml-4">{children}</div>
          )}
        </div>
      </div>

      {actions.length > 0 && (
        <div className="flex items-center space-x-2 ml-6">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant={action.variant || 'default'}
              onClick={action.onClick}
              disabled={action.disabled}
              className={cn('flex items-center space-x-2', action.className)}
            >
              {action.icon && (
                <span className="w-4 h-4 flex items-center justify-center">
                  {action.icon}
                </span>
              )}
              <span>{action.label}</span>
            </Button>
          ))}
        </div>
      )}
    </header>
  );
};

// Simplified header for more control
interface SimpleHeaderProps {
  children: React.ReactNode;
  className?: string;
  fixed?: boolean;
  showBorder?: boolean;
  background?: 'default' | 'transparent' | 'blur';
}

export const SimpleHeader: React.FC<SimpleHeaderProps> = ({
  children,
  className,
  fixed = false,
  showBorder = true,
  background = 'default',
}) => {
  const backgroundClasses = {
    default: 'bg-background',
    transparent: 'bg-transparent',
    blur: 'bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60',
  };

  const headerClasses = cn(
    'px-6 py-4',
    backgroundClasses[background],
    {
      'border-b border-border': showBorder,
      'sticky top-0 z-50': fixed,
    },
    className,
  );

  return <header className={headerClasses}>{children}</header>;
};

// Specialized header for forms/modals
interface FormHeaderProps {
  title: string;
  subtitle?: string;
  onClose?: () => void;
  className?: string;
}

export const FormHeader: React.FC<FormHeaderProps> = ({
  title,
  subtitle,
  onClose,
  className,
}) => {
  return (
    <div
      className={cn(
        'flex items-center justify-between p-6 border-b border-border',
        className,
      )}
    >
      <div>
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
        {subtitle && (
          <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
        )}
      </div>
      {onClose && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="h-8 w-8 p-0"
        >
          <span className="sr-only">Close</span>
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </Button>
      )}
    </div>
  );
};
