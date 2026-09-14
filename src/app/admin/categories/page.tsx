import React from 'react';
import type { Metadata } from 'next';
import { getAllCategoriesForAdmin } from '@/lib/db/categories';
import { CategoriesManagerClient } from '@/components/admin/categories/CategoriesManagerClient';

export const metadata: Metadata = {
  title: 'Управление категориями | ТАВ Admin',
};

export const dynamic = 'force-dynamic';

export default async function AdminCategoriesPage() {
  const categories = await getAllCategoriesForAdmin();

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-6 sm:space-y-8">
      <CategoriesManagerClient initialCategories={categories} />
    </div>
  );
}
