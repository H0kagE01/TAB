import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { CatalogClient } from '@/components/catalog/CatalogClient';
import { getFilteredProducts } from '@/lib/db/products';
import { Coffee, Search } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Поиск кофе | ТАВ',
  description: 'Поиск спешелти кофе, моносортов, дрип-пакетов и аксессуаров в коллекции ТАВ.',
};

export default async function SearchPage() {
  const { products: allProducts } = await getFilteredProducts({});

  return (
    <div className="min-h-screen bg-[#0E0A08] text-white">
      <div className="relative border-b border-white/10 pt-24 pb-8 sm:pt-32 sm:pb-12 bg-gradient-to-b from-[#17110E] to-[#0E0A08] overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#D9A76A]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-[#D9A76A] mb-2">
            <Search className="h-3.5 w-3.5" />
            <span>Поиск кофе</span>
          </div>
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black font-serif text-white tracking-tight">
            Результаты поиска по коллекции ТАВ
          </h1>
        </div>
      </div>

      <Suspense fallback={<div className="p-16 text-center text-[#8E8276]">Загрузка поиска...</div>}>
        <CatalogClient initialProducts={allProducts} initialCategory="all" />
      </Suspense>
    </div>
  );
}
