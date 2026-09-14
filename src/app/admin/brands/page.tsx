import React from 'react';
import type { Metadata } from 'next';
import prisma from '@/lib/prisma';
import { getAllBrandsForAdmin } from '@/lib/db/brands';
import { BrandsManagerClient } from '@/components/admin/brands/BrandsManagerClient';

export const metadata: Metadata = {
  title: 'Управление брендами | ТАВ Admin',
};

export const dynamic = 'force-dynamic';

import { mockCountries } from '@/lib/mock-data/countries';

export default async function AdminBrandsPage() {
  let brands: any[] = [];
  let countries: any[] = mockCountries;

  try {
    const [dbBrands, dbCountries] = await Promise.all([
      getAllBrandsForAdmin(),
      prisma.country.findMany({
        orderBy: { name: 'asc' },
        select: { id: true, name: true, code: true, flagEmoji: true },
      }),
    ]);
    brands = dbBrands;
    countries = dbCountries;
  } catch (err) {
    console.warn('DB unavailable in AdminBrandsPage, using mock fallback:', err);
    brands = await getAllBrandsForAdmin();
  }

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-6 sm:space-y-8">
      <BrandsManagerClient initialBrands={brands} allCountries={countries} />
    </div>
  );
}
