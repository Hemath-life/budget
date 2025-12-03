import { useEffect } from 'react';
import { IconCheck, IconMoon, IconSun, IconPalette } from '@tabler/icons-react';
import { cn } from '../../lib/utils';
import { Button } from '#/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '#/components/ui/dropdown-menu';
import { useTheme } from './theme-context';
import type { Theme } from './themes';

export function ThemeSwitch() {
  const { theme, setTheme } = useTheme();

  /* Update theme-color meta tag
   * when theme is updated */
  useEffect(() => {
    const getThemeColor = (theme: Theme): string => {
      switch (theme) {
        case 'dark':
          return '#0f172a'; // oklch(0.15 0.02 240) - Monday dark theme
        case 'monday':
          return '#f8fafc'; // oklch(0.98 0.01 240) - Monday light theme
        case 'blue':
          return '#262a52'; // oklch(40% 0.1 262) approximation
        case 'royal':
          return '#1f1a3d'; // oklch(35% 0.09 270) approximation
        case 'emerald':
          return '#1a3329'; // oklch(38% 0.08 160) approximation
        case 'stone':
          return '#292524'; // oklch(0.147 0.004 49.25) approximation
        case 'gray':
          return '#1f2937'; // oklch(0.13 0.028 261.692) approximation
        case 'slate':
          return '#1e293b'; // oklch(0.129 0.042 264.695) approximation
        default:
          return '#ffffff';
      }
    };
    
    const themeColor = getThemeColor(theme);
    const metaThemeColor = document.querySelector("meta[name='theme-color']");
    if (metaThemeColor) metaThemeColor.setAttribute('content', themeColor);
  }, [theme]);

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="scale-95 rounded-full">
          <IconSun className="size-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
          <IconMoon className="absolute size-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {/* Base themes */}
        <DropdownMenuItem onClick={() => setTheme('light')}>
          <IconSun size={16} className="mr-2" />
          Light
          <IconCheck
            size={14}
            className={cn('ml-auto', theme !== 'light' && 'hidden')}
          />
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')}>
          <IconMoon size={16} className="mr-2" />
          Dark
          <IconCheck
            size={14}
            className={cn('ml-auto', theme !== 'dark' && 'hidden')}
          />
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('system')}>
          <IconPalette size={16} className="mr-2" />
          System
          <IconCheck
            size={14}
            className={cn('ml-auto', theme !== 'system' && 'hidden')}
          />
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => setTheme('monday')}>
          <div
            className="mr-2 size-4 rounded-full border border-border"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6, #ec4899)' }}
          />
          Monday
          <IconCheck
            size={14}
            className={cn('ml-auto', theme !== 'monday' && 'hidden')}
          />
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />        {/* Color themes */}
        <DropdownMenuItem onClick={() => setTheme('blue')}>
          <div className="mr-2 size-4 rounded-full bg-blue-500" />
          Blue
          <IconCheck
            size={14}
            className={cn('ml-auto', theme !== 'blue' && 'hidden')}
          />
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('royal')}>
          <div className="mr-2 size-4 rounded-full bg-purple-600" />
          Royal
          <IconCheck
            size={14}
            className={cn('ml-auto', theme !== 'royal' && 'hidden')}
          />
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('emerald')}>
          <div className="mr-2 size-4 rounded-full bg-emerald-500" />
          Emerald
          <IconCheck
            size={14}
            className={cn('ml-auto', theme !== 'emerald' && 'hidden')}
          />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
