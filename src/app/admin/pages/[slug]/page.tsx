import React from 'react';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import { BlockEditorClient } from '@/components/admin/BlockEditorClient';
import { getAllProductsForAdmin } from '@/lib/db/products';

import { mockPages } from '@/lib/mock-data/pages';
import { mockCountries } from '@/lib/mock-data/countries';

export const dynamic = 'force-dynamic';

export default async function AdminPageEditorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let page: any = null;
  let allProducts: any[] = [];
  let allCountries: any[] = mockCountries;

  try {
    const [dbPage, prods, dbCountries] = await Promise.all([
      prisma.page.findUnique({
        where: { slug },
        include: {
          blocks: {
            orderBy: { order: 'asc' },
          },
        },
      }),
      getAllProductsForAdmin(),
      prisma.country.findMany({
        select: { id: true, name: true, code: true, flagEmoji: true },
        orderBy: { name: 'asc' },
      }),
    ]);

    page = dbPage;
    allProducts = prods;
    allCountries = dbCountries;
  } catch (err) {
    console.warn(`DB unavailable for AdminPageEditorPage [${slug}], using mock fallback`);
    allProducts = await getAllProductsForAdmin();
  }

  if (!page) {
    const mock = mockPages.find((p) => p.slug === slug);
    if (!mock) {
      notFound();
    }
    page = mock;
  }

  const plainPage = {
    id: page.id,
    slug: page.slug,
    title: page.title,
    seoTitle: page.seoTitle,
    seoDescription: page.seoDescription,
    seoKeywords: page.seoKeywords,
    ogImage: page.ogImage,
    isPublished: page.isPublished,
    blocks: page.blocks.map((b: any) => ({
      id: b.id,
      pageId: b.pageId,
      blockType: b.blockType,
      name: b.name,
      order: b.order,
      isActive: b.isActive,
      content: b.content as Record<string, any>,
    })),
  };

  return (
    <BlockEditorClient
      initialPage={plainPage}
      allProducts={allProducts}
      allCountries={allCountries}
    />
  );
}
