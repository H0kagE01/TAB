import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Coffee, Sparkles, Droplets, ShieldCheck, Heart, Award } from 'lucide-react';
import { getCoffeeProducts } from '@/lib/mock-data';
import { CoffeeClient } from '@/components/coffee/CoffeeClient';
import { getResolvedCoffeePage, getPageWithBlocks } from '@/lib/db/pages';

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageWithBlocks('coffee');
  return {
    title: page?.seoTitle || 'Зерновой кофе & Дрип-пакеты — Спешелти свежей обжарки | ТАВ',
    description:
      page?.seoDescription ||
      'Отборный спешелти кофе со всего мира: Эфиопия, Колумбия, Кения, Коста-Рика, Бразилия, Гватемала. Светлая, средняя и тёмная обжарка, дрип-пакеты, бесплатный помол в ТАВ.',
    keywords: page?.seoKeywords || undefined,
  };
}

export default async function CoffeePage() {
  const [coffeePageData, coffeeProducts] = await Promise.all([
    getResolvedCoffeePage(),
    getCoffeeProducts(),
  ]);

  const {
    page,
    heroContent,
    roastGuideContent,
    roastProfiles,
    terroirAtlasContent,
    terroirData,
    grindingStationContent,
    coffeeCollectionContent,
    sensoryCycleContent,
  } = coffeePageData;

  const isBlockActive = (type: string) => {
    if (!page) return true;
    const block = page.blocks.find((b) => b.blockType === type);
    return block ? block.isActive : true;
  };

  return (
    <div className="min-h-screen bg-[#0E0A08] text-white pb-20 sm:pb-24 w-full max-w-full overflow-x-hidden">
      
      {/* 1. CINEMATIC FULL-HEIGHT HERO: SPECIALTY COFFEE ATELIER */}
      {isBlockActive('hero') && (
        <section className="relative min-h-[calc(100svh-60px)] sm:min-h-[92vh] flex flex-col justify-between pt-12 sm:pt-28 pb-6 sm:pb-14 border-b border-white/10 overflow-hidden bg-[#0A0705]">
          
          {/* Atmospheric Full-Bleed Backdrop Photo with Dark Velvet Gradient Masks */}
          <div className="absolute inset-0 pointer-events-none -z-0">
            <Image
              src={heroContent.imageUrl || "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=1600&auto=format&fit=crop"}
              alt="Спешелти кофе свежей обжарки ТАВ"
              fill
              priority
              className="object-cover object-center opacity-30 scale-105 filter blur-[0.5px]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0E0A08] via-[#0E0A08]/80 to-[#0E0A08]/90" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(217,167,106,0.18)_0%,rgba(14,10,8,0.95)_75%)]" />
          </div>

          {/* Ambient Warm Velvet Glows */}
          <div className="absolute top-1/4 right-1/4 w-[350px] sm:w-[600px] h-[350px] sm:h-[600px] bg-amber-600/20 rounded-full blur-[120px] sm:blur-[150px] pointer-events-none -z-0" />
          <div className="absolute bottom-1/4 left-1/4 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-[#B88B58]/20 rounded-full blur-[100px] sm:blur-[140px] pointer-events-none -z-0" />

          {/* Main Hero Container */}
          <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full flex-1 flex flex-col justify-between my-auto py-4">
            
            {/* Top Overline Pill */}
            <div className="text-center">
              <div className="inline-flex items-center gap-2 text-[10px] sm:text-xs font-mono font-bold uppercase tracking-[0.18em] text-[#D9A76A] px-4 py-1.5 rounded-full bg-white/[0.05] border border-white/10 backdrop-blur-md shadow-lg">
                <Award className="h-3.5 w-3.5 text-[#D9A76A] flex-shrink-0" />
                <span>{heroContent.badge || '100% Specialty Arabica • Свежая обжарка ТАВ'}</span>
              </div>
            </div>

            {/* Headline & Central Value Proposition */}
            <div className="max-w-4xl mx-auto text-center space-y-3 sm:space-y-5 my-auto py-4">
              <h1 className="text-3xl xs:text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tight text-white leading-[1.08]">
                {heroContent.headline ? (
                  <span>{heroContent.headline}</span>
                ) : (
                  <>
                    Коллекция спешелти <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D9A76A] via-amber-300 to-[#F59E0B]">
                      кофе ТАВ
                    </span>
                  </>
                )}
              </h1>

              {(heroContent.cursiveSubtitle || !heroContent.headline) && (
                <div className="font-cursive text-lg xs:text-xl sm:text-3xl md:text-4xl text-[#D9A76A] tracking-wide">
                  {heroContent.cursiveSubtitle || 'От цветочной Эфиопии до бархатной Бразилии'}
                </div>
              )}

              <p className="text-[#C4B9AD] text-xs sm:text-base lg:text-lg max-w-2xl mx-auto leading-relaxed font-normal">
                {heroContent.description ||
                  'Микролоты отборного зерна со всего мира для ценителей чистого вкуса. Индивидуальные профили обжарки, раскрывающие уникальный терруар, и бесплатный помол в Майкопе.'}
              </p>

              {/* Hero Action Buttons */}
              <div className="flex flex-col xs:flex-row items-center justify-center gap-3 pt-2 sm:pt-4 max-w-md mx-auto">
                <Link
                  href={heroContent.primaryButton?.href || '#roast-guide'}
                  className="w-full xs:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-[#D9A76A] px-6 sm:px-8 py-3.5 sm:py-4 text-xs sm:text-sm font-bold text-[#0E0A08] shadow-[0_0_30px_rgba(217,167,106,0.35)] hover:bg-[#E5CBA8] active:scale-95 transition-all cursor-pointer text-center"
                >
                  <Coffee className="h-4 w-4 fill-current flex-shrink-0" />
                  <span>{heroContent.primaryButton?.label || 'Гид по обжарке'}</span>
                  <ArrowRight className="h-4 w-4 flex-shrink-0" />
                </Link>

                <Link
                  href={heroContent.secondaryButton?.href || '/catalog'}
                  className="w-full xs:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 px-6 sm:px-8 py-3.5 sm:py-4 text-xs sm:text-sm font-semibold text-white active:scale-95 transition-all cursor-pointer text-center backdrop-blur-md"
                >
                  <span>{heroContent.secondaryButton?.label || 'Смотреть каталог'}</span>
                </Link>
              </div>
            </div>

            {/* Bottom Floating Bento Metrics Strip */}
            <div className="w-full max-w-4xl mx-auto pt-4">
              <div className="grid grid-cols-3 gap-2 sm:gap-4 p-2.5 sm:p-4 rounded-2xl sm:rounded-3xl bg-[#140E0B]/90 border border-white/15 backdrop-blur-xl shadow-2xl">
                <div className="p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-white/[0.03] text-center border border-white/5">
                  <div className="text-sm xs:text-base sm:text-2xl font-black text-white font-serif">
                    {heroContent.metrics?.[0]?.value || 'до 14 дней'}
                  </div>
                  <div className="text-[#8E8276] text-[9px] xs:text-[10px] sm:text-xs mt-0.5 font-medium leading-tight">
                    {heroContent.metrics?.[0]?.label || 'Свежая обжарка'}
                  </div>
                </div>
                <div className="p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-white/[0.03] text-center border border-white/5">
                  <div className="text-sm xs:text-base sm:text-2xl font-black text-amber-400 font-serif">
                    {heroContent.metrics?.[1]?.value || 'Q 84–89+'}
                  </div>
                  <div className="text-[#8E8276] text-[9px] xs:text-[10px] sm:text-xs mt-0.5 font-medium leading-tight">
                    {heroContent.metrics?.[1]?.label || 'SCA Грейдинг'}
                  </div>
                </div>
                <div className="p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-white/[0.03] text-center border border-white/5">
                  <div className="text-sm xs:text-base sm:text-2xl font-black text-[#D9A76A] font-serif">
                    {heroContent.metrics?.[2]?.value || '0 ₽'}
                  </div>
                  <div className="text-[#8E8276] text-[9px] xs:text-[10px] sm:text-xs mt-0.5 font-medium leading-tight">
                    {heroContent.metrics?.[2]?.label || 'Помол в подарок'}
                  </div>
                </div>
              </div>

              {/* Terroir marquee pills */}
              <div className="pt-3 flex items-center justify-center gap-2 sm:gap-4 text-[10px] sm:text-xs text-[#8E8276] overflow-x-auto no-scrollbar whitespace-nowrap">
                <span>Терруары:</span>
                <span className="text-[#C4B9AD] font-medium">🇪🇹 Эфиопия</span>
                <span>•</span>
                <span className="text-[#C4B9AD] font-medium">🇨🇴 Колумбия</span>
                <span>•</span>
                <span className="text-[#C4B9AD] font-medium">🇰🇪 Кения</span>
                <span>•</span>
                <span className="text-[#C4B9AD] font-medium">🇨🇷 Коста-Рика</span>
                <span>•</span>
                <span className="text-[#C4B9AD] font-medium">🇧🇷 Бразилия</span>
              </div>
            </div>

          </div>
        </section>
      )}

      {/* 2. MAIN INTERACTIVE CONTENT */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-16">
        <CoffeeClient
          products={coffeeProducts}
          roastGuideContent={roastGuideContent}
          roastProfiles={roastProfiles}
          isRoastGuideActive={isBlockActive('roast_guide')}
          terroirAtlasContent={terroirAtlasContent}
          terroirData={terroirData}
          isTerroirAtlasActive={isBlockActive('terroir_atlas')}
          grindingStationContent={grindingStationContent}
          isGrindingStationActive={isBlockActive('grinding_station')}
          coffeeCollectionContent={coffeeCollectionContent}
          isCoffeeCollectionActive={isBlockActive('coffee_collection')}
          sensoryCycleContent={sensoryCycleContent}
          isSensoryCycleActive={isBlockActive('sensory_cycle')}
        />
      </div>

    </div>
  );
}
