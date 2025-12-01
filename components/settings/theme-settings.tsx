'use client';

import { useTheme } from 'next-themes';
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

export function ThemeSettings() {
  const { theme, setTheme } = useTheme();

  const handleThemeChange = (value: string) => {
    setTheme(value);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Theme Settings</CardTitle>
          <CardDescription>
            Customize the appearance of the application
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
