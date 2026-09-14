import React from 'react';
import prisma from '@/lib/prisma';
import { ProductFormClient } from '@/components/admin/ProductFormClient';

import { mockCategories } from '@/lib/mock-data/categories';
import { mockBrands } from '@/lib/mock-data/brands';
import { mockCountries } from '@/lib/mock-data/countries';

export const dynamic = 'force-dynamic';

export default async function AdminNewProductPage() {
  let categories: any[] = mockCategories;
  let brands: any[] = mockBrands;
  let countries: any[] = mockCountries;

  try {
    const [dbCategories, dbBrands, dbCountries] = await Promise.all([
      prisma.category.findMany({ orderBy: { order: 'asc' } }),
      prisma.brand.findMany({ orderBy: { name: 'asc' } }),
      prisma.country.findMany({ orderBy: { name: 'asc' } }),
    ]);
    categories = dbCategories;
    brands = dbBrands;
    countries = dbCountries;
  } catch (err) {
    console.warn('DB unavailable in AdminNewProductPage, using mock fallback:', err);
  }

  return (
    <ProductFormClient
      isNew
      categories={categories}
      brands={brands}
      countries={countries}
    />
  );
}
