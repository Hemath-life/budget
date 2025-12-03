'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { type ThemeProviderProps } from 'next-themes';
import { useEffect } from 'react';

function ColorThemeInitializer() {
  useEffect(() => {
    const savedColorTheme = localStorage.getItem('color-theme');
    if (savedColorTheme && savedColorTheme !== 'default') {
      document.documentElement.classList.add(`theme-${savedColorTheme}`);
    }
  }, []);

  return null;
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider {...props}>
      <ColorThemeInitializer />
      {children}
    </NextThemesProvider>
  );
}
