'use client';

import { SettingsLayout } from '@/apps/components/settings/settings-layout';
import { ThemeSettings } from '@/apps/components/settings/theme-settings';

export default function ThemeSettingsPage() {
  return (
    <SettingsLayout>
      <ThemeSettings />
    </SettingsLayout>
  );
}
