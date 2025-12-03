'use client';

import { SettingsLayout } from '@/components/settings/settings-layout';
import { ThemeSettings } from '@/components/settings/theme-settings';

export default function ThemeSettingsPage() {
  return (
    <SettingsLayout>
      <ThemeSettings />
    </SettingsLayout>
  );
}
