'use client';

import { useAppSelector, useAppDispatch } from '@/store/hooks';
import {
  setDefaultCurrency,
  setDateFormat,
  toggleNotifications,
} from '@/store/slices/settingsSlice';
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

export function GeneralSettings() {
  const dispatch = useAppDispatch();
  const settings = useAppSelector((state) => state.settings);

  const dateFormats = [
    { value: 'MMM dd, yyyy', label: 'Dec 01, 2025' },
    { value: 'dd/MM/yyyy', label: '01/12/2025' },
    { value: 'MM/dd/yyyy', label: '12/01/2025' },
    { value: 'yyyy-MM-dd', label: '2025-12-01' },
    { value: 'MMMM dd, yyyy', label: 'December 01, 2025' },
  ];

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
              value={settings.defaultCurrency}
              onValueChange={(value) => {
                dispatch(setDefaultCurrency(value));
                toast.success('Default currency updated');
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {settings.currencies.map((currency) => (
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
              value={settings.dateFormat}
              onValueChange={(value) => {
                dispatch(setDateFormat(value));
                toast.success('Date format updated');
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
              checked={settings.notificationsEnabled}
              onCheckedChange={() => {
                dispatch(toggleNotifications());
                toast.success(
                  settings.notificationsEnabled
                    ? 'Notifications disabled'
                    : 'Notifications enabled'
                );
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
