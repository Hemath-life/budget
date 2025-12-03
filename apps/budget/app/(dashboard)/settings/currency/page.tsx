'use client';

import { SettingsLayout } from '@/components/settings/settings-layout';
import { CurrencySettings } from '@/components/settings/currency-settings';

export default function CurrencySettingsPage() {
  return (
    <SettingsLayout>
      <CurrencySettings />
    </SettingsLayout>
  );
}
