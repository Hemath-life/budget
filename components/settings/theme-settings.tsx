'use client';

import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';
import { Sun, Moon, Monitor, Check } from 'lucide-react';

const themes = [
  {
    value: 'light',
    label: 'Light',
    description: 'Light background with dark text',
    icon: Sun,
  },
  {
    value: 'dark',
    label: 'Dark',
    description: 'Dark background with light text',
    icon: Moon,
  },
  {
    value: 'system',
    label: 'System',
    description: 'Follows your system preference',
    icon: Monitor,
  },
];

const colorThemes = [
  {
    value: 'default',
    label: 'Default',
    color: 'oklch(0.205 0 0)',
    darkColor: 'oklch(0.922 0 0)',
  },
  {
    value: 'blue',
    label: 'Blue',
    color: 'oklch(0.546 0.245 262.881)',
    darkColor: 'oklch(0.623 0.214 259.815)',
  },
  {
    value: 'green',
    label: 'Green',
    color: 'oklch(0.596 0.145 163.225)',
    darkColor: 'oklch(0.696 0.17 162.48)',
  },
  {
    value: 'purple',
    label: 'Purple',
    color: 'oklch(0.558 0.288 302.321)',
    darkColor: 'oklch(0.714 0.203 305.504)',
  },
  {
    value: 'orange',
    label: 'Orange',
    color: 'oklch(0.705 0.213 47.604)',
    darkColor: 'oklch(0.792 0.184 70.08)',
  },
  {
    value: 'rose',
    label: 'Rose',
    color: 'oklch(0.645 0.246 16.439)',
    darkColor: 'oklch(0.76 0.18 11.341)',
  },
  {
    value: 'teal',
    label: 'Teal',
    color: 'oklch(0.6 0.118 184.704)',
    darkColor: 'oklch(0.72 0.12 186.218)',
  },
  {
    value: 'cream',
    label: 'Cream',
    color: 'oklch(0.97 0.01 85)',
    darkColor: 'oklch(0.75 0.1 55)',
    isFullTheme: true,
  },
  {
    value: 'sand',
    label: 'Sand',
    color: 'oklch(0.96 0.02 75)',
    darkColor: 'oklch(0.72 0.1 50)',
    isFullTheme: true,
  },
  {
    value: 'ivory',
    label: 'Ivory',
    color: 'oklch(0.98 0.005 100)',
    darkColor: 'oklch(0.7 0.08 45)',
    isFullTheme: true,
  },
];

export function ThemeSettings() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [colorTheme, setColorTheme] = useState('default');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedColorTheme = localStorage.getItem('color-theme') || 'default';
    setColorTheme(savedColorTheme);
    // eslint-disable-next-line react-hooks/immutability
    applyColorTheme(savedColorTheme);
  }, []);

  const applyColorTheme = (value: string) => {
    const root = document.documentElement;
    // Remove all theme classes
    colorThemes.forEach((t) => {
      if (t.value !== 'default') {
        root.classList.remove(`theme-${t.value}`);
      }
    });
    // Add new theme class
    if (value !== 'default') {
      root.classList.add(`theme-${value}`);
    }
  };

  const handleThemeChange = (value: string) => {
    setTheme(value);
  };

  const handleColorThemeChange = (value: string) => {
    setColorTheme(value);
    localStorage.setItem('color-theme', value);
    applyColorTheme(value);
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Appearance Mode</CardTitle>
          <CardDescription>
            Choose between light, dark, or system theme
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={theme}
            onValueChange={handleThemeChange}
            className="grid gap-4"
          >
            {themes.map((t) => (
              <Label
                key={t.value}
                htmlFor={t.value}
                className={cn(
                  'flex items-center gap-4 rounded-lg border p-4 cursor-pointer transition-colors',
                  theme === t.value
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:bg-muted'
                )}
              >
                <RadioGroupItem value={t.value} id={t.value} className="sr-only" />
                <div
                  className={cn(
                    'h-12 w-12 rounded-lg flex items-center justify-center',
                    theme === t.value ? 'bg-primary text-primary-foreground' : 'bg-muted'
                  )}
                >
                  <t.icon className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{t.label}</p>
                  <p className="text-sm text-muted-foreground">{t.description}</p>
                </div>
                {theme === t.value && (
                  <Check className="h-5 w-5 text-primary" />
                )}
              </Label>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Accent Color</CardTitle>
          <CardDescription>
            Choose an accent color for buttons and highlights
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-3">
            {colorThemes.map((t) => {
              const isSelected = colorTheme === t.value;
              const displayColor = resolvedTheme === 'dark' ? t.darkColor : t.color;
              
              return (
                <button
                  key={t.value}
                  onClick={() => handleColorThemeChange(t.value)}
                  className={cn(
                    'flex flex-col items-center gap-2 p-3 rounded-lg border transition-all',
                    isSelected
                      ? 'border-primary ring-2 ring-primary ring-offset-2 ring-offset-background'
                      : 'border-border hover:border-muted-foreground'
                  )}
                >
                  <div
                    className={cn(
                      'h-10 w-10 rounded-full flex items-center justify-center transition-transform',
                      isSelected && 'scale-110'
                    )}
                    style={{ backgroundColor: displayColor }}
                  >
                    {isSelected && (
                      <Check className="h-5 w-5 text-white" />
                    )}
                  </div>
                  <span className="text-xs font-medium">{t.label}</span>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Preview</CardTitle>
          <CardDescription>
            See how the theme looks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border bg-card p-4 text-card-foreground">
              <h4 className="font-semibold mb-2">Card Component</h4>
              <p className="text-sm text-muted-foreground">
                This is how cards will appear with the current theme.
              </p>
            </div>
            <div className="rounded-lg border bg-muted p-4">
              <h4 className="font-semibold mb-2">Muted Background</h4>
              <p className="text-sm text-muted-foreground">
                Used for secondary content areas.
              </p>
            </div>
            <div className="rounded-lg bg-primary p-4 text-primary-foreground">
              <h4 className="font-semibold mb-2">Primary Color</h4>
              <p className="text-sm opacity-90">
                Used for buttons and accents.
              </p>
            </div>
            <div className="rounded-lg border p-4 space-y-2">
              <div className="flex gap-2">
                <span className="px-2 py-1 rounded bg-green-500 text-white text-xs">Income</span>
                <span className="px-2 py-1 rounded bg-red-500 text-white text-xs">Expense</span>
                <span className="px-2 py-1 rounded bg-blue-500 text-white text-xs">Info</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Status colors remain consistent across themes.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
