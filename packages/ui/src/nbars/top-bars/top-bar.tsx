import React from 'react';
import { Link } from '@tanstack/react-router';
import { Button } from '#/components/ui/button';
import { cn } from '#/lib';
import { type TopBarProps } from '../components/types';
import { ReusableLogo, ReusableMobileMenu, ReusableNavMenu } from '../components';

export const TopBar: React.FC<TopBarProps> = ({
  logo,
  navLinks,
  actions,
  showThemeToggle = true,
  showMobileMenu = true,
  className,
  containerClassName,
  variant = 'fixed',
  position = 'top',
  rounded = true,
  bordered = true,
  shadow = false,
  blur = false,
}) => {
  const positionClasses = {
    fixed: variant === 'fixed' ? 'fixed' : variant === 'sticky' ? 'sticky' : 'relative',
    top: position === 'top' ? 'top-6' : 'bottom-6',
    inset: 'inset-x-4',
  };

  const styleClasses = cn(
    'h-16 z-50',
    positionClasses.fixed,
    positionClasses.top,
    positionClasses.inset,
    'max-w-screen-xl mx-auto',
    {
      'rounded-full': rounded,
      'bg-background/80': blur,
      'bg-background': !blur,
      'backdrop-blur-sm': blur,
      'border': bordered,
      'border-border': bordered,
      'shadow-lg': shadow,
    },
    className
  );

  return (
    <nav className={styleClasses}>
      <div className={cn(
        'h-full flex items-center justify-between mx-auto px-4',
        containerClassName
      )}>
        {/* Logo */}
        <div className="flex-shrink-0">
          {logo || <ReusableLogo />}
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center">
          <ReusableNavMenu
            navLinks={navLinks}
            showThemeToggle={showThemeToggle}
            orientation="horizontal"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Desktop Actions */}
          {actions && actions.length > 0 && (
            <div className="hidden sm:flex items-center gap-3">
              {actions.map((action, index) => (
                <React.Fragment key={index}>
                  {action.href ? (
                    action.href.startsWith('http') ? (
                      <Button
                        variant={action.variant || 'outline'}
                        size={action.size || 'default'}
                        className={cn('rounded-full', action.className)}
                        asChild
                      >
                        <a href={action.href} target="_blank" rel="noopener noreferrer">
                          {action.icon && <span className="mr-2">{action.icon}</span>}
                          {action.label}
                        </a>
                      </Button>
                    ) : (
                      <Button
                        variant={action.variant || 'outline'}
                        size={action.size || 'default'}
                        className={cn('rounded-full', action.className)}
                        asChild
                      >
                        <Link to={action.href}>
                          {action.icon && <span className="mr-2">{action.icon}</span>}
                          {action.label}
                        </Link>
                      </Button>
                    )
                  ) : (
                    <Button
                      variant={action.variant || 'outline'}
                      size={action.size || 'default'}
                      className={cn('rounded-full', action.className)}
                      onClick={action.onClick}
                    >
                      {action.icon && <span className="mr-2">{action.icon}</span>}
                      {action.label}
                    </Button>
                  )}
                </React.Fragment>
              ))}
            </div>
          )}

          {/* Mobile Menu */}
          {showMobileMenu && (
            <div className="md:hidden">
              <ReusableMobileMenu
                logo={logo}
                navLinks={navLinks}
                actions={actions}
                showThemeToggle={showThemeToggle}
              />
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
