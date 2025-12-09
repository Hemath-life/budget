'use client';

import { ProfileSettings } from '@/components/settings/profile-settings';
import { SettingsLayout } from '@/components/settings/settings-layout';

export default function ProfilePage() {
  return (
    <SettingsLayout>
      <ProfileSettings />
    </SettingsLayout>
  );
}
