import { cn } from '#/lib/utils';

export interface BottomBarProps {
  items: BottomBarItem[];
  activeItem?: string;
  onItemClick?: (item: BottomBarItem) => void;
  className?: string;
  variant?: 'fixed' | 'floating' | 'static';
  style?: 'glass' | 'pill' | 'segmented' | 'solid';
  rounded?: boolean;
  blur?: boolean;
  showLabels?: boolean;
  compact?: boolean;
}

export interface BottomBarItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href?: string;
  onClick?: () => void;
  badge?: string | number;
  disabled?: boolean;
  className?: string;
}

export interface SideBarProps {
  items: SideBarItem[];
  activeItem?: string;
  onItemClick?: (item: SideBarItem) => void;
  className?: string;
  variant?: 'fixed' | 'floating' | 'static';
  position?: 'left' | 'right';
  rounded?: boolean;
  blur?: boolean;
  showLabels?: boolean;
  compact?: boolean;
  collapsed?: boolean;
}

export interface SideBarItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href?: string;
  onClick?: () => void;
  badge?: string | number;
  disabled?: boolean;
  className?: string;
  children?: SideBarItem[];
}
