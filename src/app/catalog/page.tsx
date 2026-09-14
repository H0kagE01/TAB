import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { CatalogClient } from '@/components/catalog/CatalogClient';
import {
  getFilteredProducts,
  getCategories,
  getBrands,
  getCountries,
} from '@/lib/mock-data';
import { getPageWithBlocks } from '@/lib/db/pages';
import { Sparkles, Coffee } from 'lucide-react';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageWithBlocks('catalog');
  return {
    title: page?.seoTitle || 'Каталог спешелти кофе | ТАВ',
    description:
      page?.seoDescription ||
      'Полная коллекция кофе ТАВ: моносорта, микролоты свежей обжарки, эспрессо-бленды, дрип-пакеты и профессиональные аксессуары Hario и Timemore.',
    keywords: page?.seoKeywords || undefined,
  };
}

export default async function CatalogPage() {
  const [{ products }, categories, brands, countries] = await Promise.all([
    getFilteredProducts({}),
    getCategories(),
    getBrands(),
    getCountries(),
  ]);

  return (
    <div className="min-h-screen bg-[#0E0A08] text-white">
      {/* Editorial Dark Luxury Header */}
      <div className="relative border-b border-white/10 pt-20 pb-6 sm:pt-32 sm:pb-14 overflow-hidden bg-gradient-to-b from-[#17110E] to-[#0E0A08]">
        {/* Ambient Glows */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#D9A76A]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-72 h-72 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-2 sm:space-y-4">
            
            {/* Top Micro-badge */}
            <div className="inline-flex items-center gap-2 text-[10px] sm:text-xs font-mono font-bold uppercase tracking-[0.2em] text-[#D9A76A]">
              <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-[#D9A76A]" />
              <span>Коллекция спешелти кофе ТАВ</span>
            </div>

            {/* Title & Slogan */}
            <div>
              <h1 className="text-2xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white leading-tight">
                Каталог кофе
              </h1>
              <div className="font-cursive text-lg sm:text-3xl md:text-4xl text-[#D9A76A] tracking-wide pt-0.5 sm:pt-1">
                От цветочной Эфиопии до плотных эспрессо-купажей
              </div>
            </div>

            <p className="text-xs sm:text-base text-[#C4B9AD] leading-relaxed max-w-2xl font-normal hidden sm:block">
              Изучите наш ассортимент: фильтруйте зерно по степени обжарки, дескрипторам вкуса, странам произрастания и выбирайте бесплатный помол под ваш метод заваривания.
            </p>

            {/* Editorial Highlight Line */}
            <div className="flex flex-wrap items-center gap-y-2 gap-x-6 pt-2 text-xs text-[#A69C91] border-t border-white/10 mt-2">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D9A76A]" />
                <span className="text-white font-medium">100% Спешелти Арабика</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span>Свежая обжарка до 14 дней</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>Бесплатный помол в магазине</span>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Interactive Catalog Client with Suspense */}
      <Suspense fallback={<div className="p-16 text-center text-[#8E8276] font-medium">Загрузка каталога...</div>}>
        <CatalogClient
          initialProducts={products}
          initialCategory="all"
          categories={categories}
          brands={brands}
          countries={countries}
        />
      </Suspense>
    </div>
  );
}
