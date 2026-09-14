import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CatalogClient } from '@/components/catalog/CatalogClient';
import {
  getCategoryBySlug,
  getFilteredProducts,
  getBrands,
  getCountries,
  getCategories,
} from '@/lib/mock-data';
import { ProductCategory } from '@/types';
import { Sparkles, Coffee } from 'lucide-react';

interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  const cat = await getCategoryBySlug(category);

  if (!cat) {
    return {
      title: 'Категория не найдена',
    };
  }

  return {
    title: cat.name,
    description: cat.longDescription || cat.shortDescription,
    openGraph: {
      title: `${cat.name} | Каталог ТАВ`,
      description: cat.shortDescription,
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;

  const [cat, { products }, categories, brands, countries] = await Promise.all([
    getCategoryBySlug(category),
    getFilteredProducts({ category }),
    getCategories(),
    getBrands(),
    getCountries(),
  ]);

  if (!cat) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#0E0A08] text-white">
      {/* Dark Luxury Category Banner */}
      <div className="relative border-b border-white/10 pt-20 pb-6 sm:pt-32 sm:pb-14 overflow-hidden bg-gradient-to-b from-[#17110E] to-[#0E0A08]">
        {/* Category Ambient Glow */}
        <div 
          className="absolute top-0 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ backgroundColor: cat.accentColor || '#D9A76A' }}
        />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-2 sm:space-y-3">
            <div className="inline-flex items-center gap-2 text-[10px] sm:text-xs font-mono font-bold uppercase tracking-[0.2em] text-[#D9A76A]">
              <Coffee className="h-3.5 w-3.5 text-[#D9A76A]" />
              <span>Раздел каталога ТАВ</span>
            </div>

            <h1 className="text-2xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white">
              {cat.name}
            </h1>
            
            <p className="text-stone-300 text-xs sm:text-base leading-relaxed pt-0.5 max-w-2xl font-normal">
              {cat.shortDescription || cat.longDescription}
            </p>
          </div>
        </div>
      </div>

      {/* Catalog Client with Suspense */}
      <Suspense fallback={<div className="p-16 text-center text-[#8E8276] font-medium">Загрузка категории...</div>}>
        <CatalogClient
          initialProducts={products}
          initialCategory={cat.slug as ProductCategory}
          categories={categories}
          brands={brands}
          countries={countries}
        />
      </Suspense>
    </div>
  );
}
