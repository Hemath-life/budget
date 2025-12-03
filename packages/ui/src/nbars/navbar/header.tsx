import { Separator } from '#/components/ui/separator';
import React from 'react';
import { cn } from '../../lib/utils';
import { SidebarTrigger } from '../sidebar';

interface HeaderProps extends React.HTMLAttributes<HTMLElement> {
  fixed?: boolean;
  ref?: React.Ref<HTMLElement>;
  sidebarTrigger?: boolean;
}

export const Header = ({
  className,
  fixed,
  children,
  sidebarTrigger = true,
  ...props
}: HeaderProps) => {
  const [offset, setOffset] = React.useState(0);

  React.useEffect(() => {
    const onScroll = () => {
      setOffset(document.body.scrollTop || document.documentElement.scrollTop);
    };

    // Add scroll listener to the body
    document.addEventListener('scroll', onScroll, { passive: true });

    // Clean up the event listener on unmount
    return () => document.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={cn(
        'bg-background flex h-16 items-center gap-3 p-4 sm:gap-4',
        // Apply fixed positioning and styling when fixed prop is true
        fixed && 'header-fixed peer/header fixed z-50 w-[inherit] rounded-md',
        offset > 10 && fixed ? 'shadow-sm' : 'shadow-none',
        className,
      )}
      {...props}
    >
      {/* Sidebar toggle button with outline variant and responsive scaling */}
      {sidebarTrigger && (
        <SidebarTrigger
          variant="outline"
          className="scale-125 sm:scale-100"
          datatype="header-trigger"
        />
      )}
      {/* Vertical separator between sidebar trigger and header content */}
      <Separator
        orientation="vertical"
        className="h-6"
        datatype="header-separator"
      />
      {/* Render any children components passed to the header */}
      {children}
    </header>
  );
};

Header.displayName = 'Header';
