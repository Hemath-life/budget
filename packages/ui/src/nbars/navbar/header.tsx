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
        'bg-background flex h-14 items-center gap-2 px-3 sm:h-16 sm:gap-4 sm:px-4 overflow-hidden',
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
          className="size-8 sm:size-9"
          datatype="header-trigger"
        />
      )}
      {/* Vertical separator between sidebar trigger and header content - hidden on mobile */}
      <Separator
        orientation="vertical"
        className="hidden h-6 sm:block"
        datatype="header-separator"
      />
      {/* Render any children components passed to the header */}
      {children}
    </header>
  );
};

Header.displayName = 'Header';
