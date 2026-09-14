import React from 'react';
import { getSiteSettings } from '@/lib/db/settings';
import { SettingsClient } from '@/components/admin/SettingsClient';

export const dynamic = 'force-dynamic';

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  const plainSettings = {
    ...settings,
    headerMenu: Array.isArray(settings.headerMenu) ? settings.headerMenu : [],
    defaultSeo: (settings.defaultSeo as Record<string, any>) || null,
  };

  return <SettingsClient initialSettings={plainSettings as any} />;
}
