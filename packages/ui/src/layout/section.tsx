import React from 'react';
import { cn } from '../lib/utils';

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  fixed?: boolean;
  grid?: boolean;
  ref?: React.Ref<HTMLElement>;
}

export const Section = ({ fixed, className, grid, ...props }: SectionProps) => {
  return (
    <section
      className={cn(
        grid && 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6', // Add grid class if type is grid
        fixed && 'no-scrollbar overflow-auto pt-4 relative',
        className,
      )}
      {...props}
    />
  );
};

Section.displayName = 'Section';
