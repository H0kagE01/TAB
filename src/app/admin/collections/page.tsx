import React from 'react';
import type { Metadata } from 'next';
import { getAllCollectionsForAdmin } from '@/lib/db/collections';
import { getAllProductsForAdmin } from '@/lib/db/products';
import { CollectionsManagerClient } from '@/components/admin/collections/CollectionsManagerClient';

export const metadata: Metadata = {
  title: 'Управление подборками | ТАВ Admin',
};

export const dynamic = 'force-dynamic';

export default async function AdminCollectionsPage() {
  const [collections, products] = await Promise.all([
    getAllCollectionsForAdmin(),
    getAllProductsForAdmin(),
  ]);

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-6 sm:space-y-8">
      <CollectionsManagerClient initialCollections={collections} allProducts={products} />
    </div>
  );
}
