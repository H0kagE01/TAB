import React from 'react';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import { ProductFormClient } from '@/components/admin/ProductFormClient';

import { mockProducts } from '@/lib/mock-data/products';
import { mockCategories } from '@/lib/mock-data/categories';
import { mockBrands } from '@/lib/mock-data/brands';
import { mockCountries } from '@/lib/mock-data/countries';

export const dynamic = 'force-dynamic';

export default async function AdminEditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let product: any = null;
  let categories: any[] = mockCategories;
  let brands: any[] = mockBrands;
  let countries: any[] = mockCountries;

  try {
    const [dbProduct, dbCategories, dbBrands, dbCountries] = await Promise.all([
      prisma.product.findUnique({
        where: { id },
        include: {
          coffeeSpecs: true,
        },
      }),
      prisma.category.findMany({ orderBy: { order: 'asc' } }),
      prisma.brand.findMany({ orderBy: { name: 'asc' } }),
      prisma.country.findMany({ orderBy: { name: 'asc' } }),
    ]);

    product = dbProduct;
    categories = dbCategories;
    brands = dbBrands;
    countries = dbCountries;
  } catch (err) {
    console.warn(`DB unavailable for AdminEditProductPage [${id}], using mock fallback:`, err);
  }

  if (!product) {
    const mock = mockProducts.find((p) => p.id === id || p.slug === id);
    if (!mock) {
      notFound();
    }
    product = {
      id: mock.id,
      slug: mock.slug,
      title: mock.title,
      categoryId: mock.category,
      brandId: mock.brandId || null,
      countryId: mock.countryId || null,
      price: mock.price,
      oldPrice: null,
      inStock: mock.inStock,
      stockCount: mock.stockCount || 10,
      shortDescription: mock.shortDescription || null,
      description: mock.description,
      images: mock.images,
      isNew: mock.isNew || false,
      isPopular: mock.isPopular || false,
      isFeatured: mock.isFeatured || false,
      order: 1,
      coffeeSpecs: mock.coffeeSpecs
        ? {
            id: `cs-${mock.id}`,
            productId: mock.id,
            variety: mock.coffeeSpecs.variety || null,
            roastLevel: mock.coffeeSpecs.roastLevel || null,
            processing: mock.coffeeSpecs.processing || null,
            altitude: mock.coffeeSpecs.altitude || null,
            qScore: mock.coffeeSpecs.qScore || null,
            flavorNotes: mock.coffeeSpecs.flavorNotes || [],
            recommendedBrew: mock.coffeeSpecs.recommendedBrew || [],
            acidity: mock.coffeeSpecs.acidity || null,
            sweetness: mock.coffeeSpecs.sweetness || null,
            bitterness: mock.coffeeSpecs.bitterness || null,
            body: mock.coffeeSpecs.body || null,
            weightGrams: mock.coffeeSpecs.weight || 250,
            dripCount: mock.coffeeSpecs.count || null,
            recipe: mock.coffeeSpecs.recipe || null,
          }
        : null,
    };
  }

  const plainProduct = {
    ...product,
    price: Number(product.price),
    oldPrice: product.oldPrice ? Number(product.oldPrice) : null,
    images: Array.isArray(product.images) ? (product.images as string[]) : [],
    coffeeSpecs: product.coffeeSpecs
      ? {
          ...product.coffeeSpecs,
          qScore: product.coffeeSpecs.qScore ? Number(product.coffeeSpecs.qScore) : null,
          flavorNotes: Array.isArray(product.coffeeSpecs.flavorNotes)
            ? (product.coffeeSpecs.flavorNotes as string[])
            : [],
          recommendedBrew: Array.isArray(product.coffeeSpecs.recommendedBrew)
            ? (product.coffeeSpecs.recommendedBrew as string[])
            : [],
          recipe: product.coffeeSpecs.recipe || null,
        }
      : null,
  };

  return (
    <ProductFormClient
      isNew={false}
      initialProduct={plainProduct}
      categories={categories}
      brands={brands}
      countries={countries}
    />
  );
}
