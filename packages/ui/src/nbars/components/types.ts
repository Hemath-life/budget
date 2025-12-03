export interface NavLink {
  label: string;
  href: string;
  target?: string;
  className?: string;
}

export interface TopBarAction {
  label: string;
  onClick?: () => void;
  href?: string;
  variant?: 'default' | 'outline' | 'ghost' | 'destructive' | 'secondary';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  icon?: React.ReactNode;
}

export interface TopBarProps {
  logo?: React.ReactNode;
  navLinks?: NavLink[];
  actions?: TopBarAction[];
  showThemeToggle?: boolean;
  showMobileMenu?: boolean;
  className?: string;
  containerClassName?: string;
  variant?: 'fixed' | 'sticky' | 'static';
  position?: 'top' | 'bottom';
  rounded?: boolean;
  bordered?: boolean;
  shadow?: boolean;
  blur?: boolean;
}

export interface MobileMenuProps {
  logo?: React.ReactNode;
  navLinks?: NavLink[];
  actions?: TopBarAction[];
  showThemeToggle?: boolean;
}
