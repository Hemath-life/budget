'use client';

import { GeneralSettings } from '@/components/settings/general-settings';
import { SettingsLayout } from '@/components/settings/settings-layout';

export default function GeneralSettingsPage() {
  return (
    <SettingsLayout>
      <GeneralSettings />
    </SettingsLayout>
  );
}
