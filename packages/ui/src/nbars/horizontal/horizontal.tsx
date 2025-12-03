import React from 'react';
import { Link } from '@tanstack/react-router';
import { cn } from '#/lib/utils';
import { Button } from '#/components/ui/button';

export interface HorizontalNavProps {
  items: HorizontalNavItem[];
  activeItem?: string;
  onItemClick?: (item: HorizontalNavItem) => void;
  actions?: HorizontalNavAction[];
  className?: string;
  variant?: 'fixed' | 'floating' | 'static';
  position?: 'top' | 'bottom';
  theme?: 'dark' | 'light';
  rounded?: boolean;
  blur?: boolean;
}

export interface HorizontalNavItem {
  id: string;
  label: string;
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

export interface HorizontalNavAction {
  id: string;
  label: string;
  icon?: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: 'default' | 'outline' | 'ghost' | 'destructive' | 'secondary';
  disabled?: boolean;
  className?: string;
}

const HorizontalNavbar: React.FC<HorizontalNavProps> = ({
  items,
  activeItem,
  onItemClick,
  actions = [],
  className,
  variant = 'floating',
  position = 'top',
  theme = 'dark',
  rounded = true,
  blur = true,
}) => {
  const baseClasses = cn(
    'left-0 right-0 z-50',
    {
      // Position
      'top-0': position === 'top' && variant === 'fixed',
      'bottom-0': position === 'bottom' && variant === 'fixed',
      'top-4': position === 'top' && variant === 'floating',
      'bottom-4': position === 'bottom' && variant === 'floating',
      'fixed': variant === 'fixed' || variant === 'floating',
      'relative': variant === 'static',
      
      // Floating specific
      'left-4 right-4 max-w-6xl mx-auto': variant === 'floating',
      
      // Theme and style
      'bg-gray-900/95 border-gray-700/50': theme === 'dark' && blur,
      'bg-gray-900 border-gray-700': theme === 'dark' && !blur,
      'bg-white/95 border-gray-200/50': theme === 'light' && blur,
      'bg-white border-gray-200': theme === 'light' && !blur,
      
      // Border and blur
      'border backdrop-blur-xl': blur,
      'border': !blur,
      
      // Rounded corners
      'rounded-2xl': rounded && variant === 'floating',
      'rounded-lg': rounded && variant !== 'floating',
      'rounded-none': !rounded,
    }
  );

  const containerClasses = cn(
    'flex items-center justify-between px-6 py-4',
    {
      'px-8 py-5': variant === 'floating',
    }
  );

  const navItemsClasses = cn(
    'flex items-center space-x-8',
    {
      'space-x-6': variant === 'floating',
    }
  );

  const actionsClasses = cn(
    'flex items-center space-x-3',
    {
      'space-x-4': variant === 'floating',
    }
  );

  const renderNavItem = (item: HorizontalNavItem) => {
    const isActive = activeItem === item.id;
    
    const itemClasses = cn(
      'relative text-sm font-medium transition-colors duration-200',
      {
        // Dark theme
        'text-white hover:text-orange-400': theme === 'dark' && !isActive,
        'text-orange-400': theme === 'dark' && isActive,
        
        // Light theme
        'text-gray-700 hover:text-blue-600': theme === 'light' && !isActive,
        'text-blue-600': theme === 'light' && isActive,
        
        // Disabled
        'opacity-50 cursor-not-allowed': item.disabled,
      },
      item.className
    );

    const content = (
      <div className={itemClasses}>
        {item.label}
        {isActive && (
          <div className={cn(
            'absolute -bottom-1 left-0 right-0 h-0.5 rounded-full',
            {
              'bg-orange-400': theme === 'dark',
              'bg-blue-600': theme === 'light',
            }
          )} />
        )}
      </div>
    );

    const handleClick = () => {
      if (item.disabled) return;
      if (item.onClick) item.onClick();
      if (onItemClick) onItemClick(item);
    };

    if (item.href) {
      return (
        <Link
          key={item.id}
          to={item.href}
          onClick={handleClick}
          className="block"
        >
          {content}
        </Link>
      );
    }

    return (
      <button
        key={item.id}
        onClick={handleClick}
        disabled={item.disabled}
        className="block"
      >
        {content}
      </button>
    );
  };

  const renderAction = (action: HorizontalNavAction) => {
    const buttonClasses = cn(
      'rounded-xl font-medium transition-all duration-200',
      {
        // Dark theme variants
        'bg-gray-700 text-white hover:bg-gray-600 border-gray-600': 
          theme === 'dark' && action.variant === 'outline',
        'bg-orange-500 text-white hover:bg-orange-600 shadow-lg hover:shadow-orange-500/25': 
          theme === 'dark' && action.variant === 'default',
        'text-gray-300 hover:text-white hover:bg-gray-700': 
          theme === 'dark' && action.variant === 'ghost',
        
        // Light theme variants  
        'bg-white text-gray-700 hover:bg-gray-50 border-gray-300': 
          theme === 'light' && action.variant === 'outline',
        'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-blue-600/25': 
          theme === 'light' && action.variant === 'default',
        'text-gray-600 hover:text-gray-900 hover:bg-gray-100': 
          theme === 'light' && action.variant === 'ghost',
      },
      action.className
    );

    const handleClick = () => {
      if (action.disabled) return;
      if (action.onClick) action.onClick();
    };

    if (action.href) {
      return (
        <Link
          key={action.id}
          to={action.href}
          onClick={handleClick}
        >
          <Button 
            variant={action.variant || 'default'}
            disabled={action.disabled}
            className={buttonClasses}
          >
            {action.icon && <span className="mr-2">{action.icon}</span>}
            {action.label}
          </Button>
        </Link>
      );
    }

    return (
      <Button
        key={action.id}
        variant={action.variant || 'default'}
        onClick={handleClick}
        disabled={action.disabled}
        className={buttonClasses}
      >
        {action.icon && <span className="mr-2">{action.icon}</span>}
        {action.label}
      </Button>
    );
  };

  return (
    <nav className={cn(baseClasses, className)}>
      <div className={containerClasses}>
        <div className={navItemsClasses}>
          {items.map(renderNavItem)}
        </div>
        
        {actions.length > 0 && (
          <div className={actionsClasses}>
            {actions.map(renderAction)}
          </div>
        )}
      </div>
    </nav>
  );
};

export { HorizontalNavbar };
