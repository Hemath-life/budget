'use client';

import { useSettings, useCurrencies, usePatchSettings } from '@/lib/hooks';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export function GeneralSettings() {
  const { data: settings, isLoading } = useSettings();
  const { data: currencies = [] } = useCurrencies();
  const patchSettings = usePatchSettings();

  const dateFormats = [
    { value: 'MMM dd, yyyy', label: 'Dec 01, 2025' },
    { value: 'dd/MM/yyyy', label: '01/12/2025' },
    { value: 'MM/dd/yyyy', label: '12/01/2025' },
    { value: 'yyyy-MM-dd', label: '2025-12-01' },
    { value: 'MMMM dd, yyyy', label: 'December 01, 2025' },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
          <CardDescription>
            Configure your general app preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Default Currency */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Default Currency</Label>
              <p className="text-sm text-muted-foreground">
                Used for new transactions and display
              </p>
            </div>
            <Select
              value={settings?.defaultCurrency || 'USD'}
              onValueChange={(value) => {
                patchSettings.mutate({ defaultCurrency: value }, {
                  onSuccess: () => toast.success('Default currency updated'),
                });
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {currencies.map((currency) => (
                  <SelectItem key={currency.code} value={currency.code}>
                    {currency.code} ({currency.symbol})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date Format */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Date Format</Label>
              <p className="text-sm text-muted-foreground">
                How dates are displayed throughout the app
              </p>
            </div>
            <Select
              value={settings?.dateFormat || 'MMM dd, yyyy'}
              onValueChange={(value) => {
                patchSettings.mutate({ dateFormat: value }, {
                  onSuccess: () => toast.success('Date format updated'),
                });
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {dateFormats.map((format) => (
                  <SelectItem key={format.value} value={format.value}>
                    {format.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Notifications */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Enable notifications for bill reminders
              </p>
            </div>
            <Switch
              checked={settings?.notificationsEnabled ?? true}
              onCheckedChange={(checked) => {
                patchSettings.mutate({ notificationsEnabled: checked }, {
                  onSuccess: () => toast.success(
                    checked ? 'Notifications enabled' : 'Notifications disabled'
                  ),
                });
              }}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Data & Privacy</CardTitle>
          <CardDescription>
            Manage your data and privacy settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Your data is stored locally in your browser. No data is sent to external servers.
          </p>
          <p className="text-sm text-muted-foreground">
            To backup your data, use the Export feature to download your transactions and settings.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
