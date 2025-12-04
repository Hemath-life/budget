import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '#/lib';

const iconWrapperVariants = cva(
  'inline-flex items-center justify-center transition-colors',
  {
    variants: {
      variant: {
        default: 'text-foreground',
        primary: 'text-primary',
        secondary: 'text-secondary-foreground',
        muted: 'text-muted-foreground',
        destructive: 'text-destructive',
        success: 'text-green-600',
        warning: 'text-yellow-600',
        info: 'text-blue-600',
      },
      size: {
        xs: 'h-3 w-3',
        sm: 'h-4 w-4',
        default: 'w-12 h-12',
        md: 'h-6 w-6',
        lg: 'h-8 w-8',
        xl: 'h-10 w-10',
        '2xl': 'h-12 w-12',
      },
      rounded: {
        none: 'rounded-none',
        sm: 'rounded-sm',
        default: 'rounded',
        md: 'rounded-md',
        lg: 'rounded-lg',
        full: 'rounded-full',
      },
      background: {
        none: '',
        subtle: 'bg-muted/50',
        solid: 'bg-muted',
        primary: 'bg-primary/10',
        secondary: 'bg-secondary',
        destructive: 'bg-destructive/10',
        success: 'bg-green-100 dark:bg-green-950',
        warning: 'bg-yellow-100 dark:bg-yellow-950',
        info: 'bg-blue-100 dark:bg-blue-950',
      },
      hover: {
        none: '',
        subtle: 'hover:bg-muted/80',
        solid: 'hover:bg-muted/80',
        primary: 'hover:bg-primary/20',
        secondary: 'hover:bg-secondary/80',
        destructive: 'hover:bg-destructive/20',
        success: 'hover:bg-green-200 dark:hover:bg-green-900',
        warning: 'hover:bg-yellow-200 dark:hover:bg-yellow-900',
        info: 'hover:bg-blue-200 dark:hover:bg-blue-900',
      },
      border: {
        default: 'border',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      rounded: 'default',
      background: 'solid',
      hover: 'none',
      border: 'default',
    },
  },
);

export interface IconWrapperProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof iconWrapperVariants> {
  children: React.ReactNode;
}

const IconWrapper = React.forwardRef<HTMLDivElement, IconWrapperProps>(
  (
    {
      className,
      variant,
      size,
      rounded,
      background,
      hover,
      children,
      border,
      ...props
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          iconWrapperVariants({
            variant,
            size,
            rounded,
            background,
            hover,
          }),
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);
IconWrapper.displayName = 'IconWrapper';

export { IconWrapper, iconWrapperVariants };
