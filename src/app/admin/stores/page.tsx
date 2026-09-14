import React from 'react';
import type { Metadata } from 'next';
import { getAllStoresForAdmin } from '@/lib/db/stores';
import { StoresManagerClient } from '@/components/admin/stores/StoresManagerClient';

export const metadata: Metadata = {
  title: 'Управление локациями и магазинами | ТАВ Admin',
};

export const dynamic = 'force-dynamic';

export default async function AdminStoresPage() {
  const stores = await getAllStoresForAdmin();

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-6 sm:space-y-8">
      <StoresManagerClient initialStores={stores} />
    </div>
  );
}
