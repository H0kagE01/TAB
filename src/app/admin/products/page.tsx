import React from 'react';
import prisma from '@/lib/prisma';
import { ProductsManagerClient } from '@/components/admin/ProductsManagerClient';

import { mockProducts } from '@/lib/mock-data/products';
import { mockCategories } from '@/lib/mock-data/categories';
import { mockBrands } from '@/lib/mock-data/brands';
import { mockCountries } from '@/lib/mock-data/countries';

export const dynamic = 'force-dynamic';

export default async function AdminProductsPage() {
  let plainProducts: any[] = [];
  let categories: any[] = mockCategories;
  let brands: any[] = mockBrands;
  let countries: any[] = mockCountries;

  try {
    const [dbProducts, dbCategories, dbBrands, dbCountries] = await Promise.all([
      prisma.product.findMany({
        orderBy: { order: 'asc' },
        include: {
          category: true,
          brand: true,
          country: true,
          coffeeSpecs: true,
        },
      }),
      prisma.category.findMany({ orderBy: { order: 'asc' } }),
      prisma.brand.findMany({ orderBy: { name: 'asc' } }),
      prisma.country.findMany({ orderBy: { name: 'asc' } }),
    ]);

    categories = dbCategories;
    brands = dbBrands;
    countries = dbCountries;

    plainProducts = dbProducts.map((p) => ({
      id: p.id,
      slug: p.slug,
      title: p.title,
      categoryId: p.categoryId,
      categoryName: p.category.name,
      brandName: p.brand?.name || null,
      countryName: p.country?.name || null,
      flagEmoji: p.country?.flagEmoji || null,
      price: Number(p.price),
      oldPrice: p.oldPrice ? Number(p.oldPrice) : null,
      inStock: p.inStock,
      isNew: p.isNew,
      isPopular: p.isPopular,
      isFeatured: p.isFeatured,
      images: Array.isArray(p.images) ? (p.images as string[]) : [],
      roastLevel: p.coffeeSpecs?.roastLevel || null,
      variety: p.coffeeSpecs?.variety || null,
      qScore: p.coffeeSpecs?.qScore ? Number(p.coffeeSpecs.qScore) : null,
    }));
  } catch (err) {
    console.warn('DB unavailable in AdminProductsPage, using mock fallback:', err);
    plainProducts = mockProducts.map((p) => {
      const cat = mockCategories.find((c) => c.slug === p.category || c.id === p.category);
      const br = mockBrands.find((b) => b.id === p.brandId);
      const cntr = mockCountries.find((c) => c.id === p.countryId);
      return {
        id: p.id,
        slug: p.slug,
        title: p.title,
        categoryId: cat?.id || p.category,
        categoryName: p.categoryName || cat?.name || 'Кофе',
        brandName: br?.name || null,
        countryName: cntr?.name || null,
        flagEmoji: cntr?.flagEmoji || null,
        price: p.price,
        oldPrice: null,
        inStock: p.inStock,
        isNew: p.isNew || false,
        isPopular: p.isPopular || false,
        isFeatured: p.isFeatured || false,
        images: p.images || [],
        roastLevel: p.coffeeSpecs?.roastLevel || null,
        variety: p.coffeeSpecs?.variety || null,
        qScore: p.coffeeSpecs?.qScore || null,
      };
    });
  }

  return (
    <ProductsManagerClient
      initialProducts={plainProducts}
      categories={categories}
      brands={brands}
      countries={countries}
    />
  );
}
