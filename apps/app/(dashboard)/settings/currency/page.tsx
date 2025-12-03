'use client';

import { SettingsLayout } from '@/apps/components/settings/settings-layout';
import { CurrencySettings } from '@/apps/components/settings/currency-settings';

export default function CurrencySettingsPage() {
  return (
    <SettingsLayout>
      <CurrencySettings />
    </SettingsLayout>
  );
}
