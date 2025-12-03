'use client';

import { SettingsLayout } from '@/apps/components/settings/settings-layout';
import { GeneralSettings } from '@/apps/components/settings/general-settings';

export default function SettingsPage() {
  return (
    <SettingsLayout>
      <GeneralSettings />
    </SettingsLayout>
  );
}
