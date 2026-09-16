import React from 'react';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  Coffee,
  Sparkles,
  MapPin,
  ShieldCheck,
  Store,
  Clock,
  CheckCircle2,
  Award,
  Droplets,
  Layers,
} from 'lucide-react';
import { getMainStore } from '@/lib/db/stores';

import { getPageWithBlocks } from '@/lib/db/pages';

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageWithBlocks('about');
  return {
    title: page?.seoTitle || 'О бренде ТАВ — Культура спешелти кофе в Майкопе',
    description:
      page?.seoDescription ||
      'История и философия ТАВ: почему мы сосредоточились на спешелти кофе свежей обжарки, выборе редких микролотов и культуре заваривания в Майкопе.',
    keywords: page?.seoKeywords || undefined,
  };
}

export default async function AboutPage() {
  const [page, store] = await Promise.all([
    getPageWithBlocks('about'),
    getMainStore(),
  ]);

  const isBlockActive = (type: string) => {
    if (!page) return true;
    const block = page.blocks.find((b) => b.blockType === type);
    return block ? block.isActive : false;
  };

  const getBlockContent = (type: string): Record<string, any> => {
    return page?.blocks.find((b) => b.blockType === type)?.content || {};
  };

  const heroContent = getBlockContent('hero');
  const philosophyContent = getBlockContent('philosophy');
  const standardsContent = getBlockContent('standards');
  const calloutContent = getBlockContent('callout_banner');

  return (
    <div className="min-h-screen bg-[#0E0A08] text-white pb-12 sm:pb-20 w-full max-w-full overflow-x-hidden">
      
      {/* 1. HERO SECTION */}
      {isBlockActive('hero') && (
        <section className="relative min-h-[100dvh] w-full flex flex-col justify-between pt-24 pb-8 sm:pt-28 sm:pb-10 lg:pt-32 lg:pb-12 border-b border-white/10 bg-[#0E0A08] overflow-hidden">
          
          {/* Backdrop Image */}
          <div className="absolute inset-0 pointer-events-none -z-0">
            <Image
              src={heroContent.imageUrl || "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=1200&auto=format&fit=crop"}
              alt="Атмосфера ТАВ"
              fill
              priority
              className="object-cover object-center opacity-30 scale-105 filter blur-[1px]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0E0A08] via-[#0E0A08]/75 to-[#0E0A08]/90" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(217,167,106,0.18)_0%,rgba(14,10,8,0.95)_75%)]" />
          </div>

          {/* Ambient Glows */}
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[350px] sm:w-[650px] h-[350px] sm:h-[500px] bg-amber-600/15 rounded-full blur-[140px] pointer-events-none -z-0" />

          {/* Top Overline Pill */}
          <div className="relative z-10 w-full text-center shrink-0">
            <div className="inline-flex items-center justify-center gap-2 text-[10px] sm:text-xs font-mono font-bold uppercase tracking-[0.15em] sm:tracking-[0.2em] text-[#E5CBA8] px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-md shadow-sm">
              <span className="text-[#D9A76A]">ТАВ</span>
              <span className="text-white/30">•</span>
              <span>{heroContent.badge || 'SPECIALTY COFFEE ROASTERS'}</span>
            </div>
          </div>

          {/* Main Content Container (Center) */}
          <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 w-full text-center my-auto py-4 sm:py-6 space-y-4 sm:space-y-6">
            
            {/* Headline & Subtitle */}
            <div className="space-y-3 sm:space-y-4 max-w-3xl mx-auto">
              <h1 className="text-3xl sm:text-5xl lg:text-[54px] font-black uppercase tracking-tight text-white font-serif leading-[1.14]">
                {(() => {
                  if (heroContent.headline && heroContent.headlineHighlight) {
                    return (
                      <>
                        {heroContent.headline}{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D9A76A] via-amber-300 to-[#E5CBA8] block mt-1">
                          {heroContent.headlineHighlight}
                        </span>
                      </>
                    );
                  }
                  if (heroContent.headline) {
                    return (
                      <span className="block">
                        {heroContent.headline}
                      </span>
                    );
                  }
                  return (
                    <>
                      «Раскрываем истинный{' '}
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D9A76A] via-amber-300 to-[#E5CBA8] block mt-1">
                        характер кофе»
                      </span>
                    </>
                  );
                })()}
              </h1>
              
              <p className="text-[#C4B9AD] text-xs sm:text-base lg:text-lg leading-relaxed max-w-2xl mx-auto font-normal">
                {heroContent.description ||
                  'ТАВ — это пространство, где кофе рассматривается как искусство. От тщательного отбора зеленого зерна на фермах до ювелирной калибровки профиля обжарки на ростере.'}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 max-w-md mx-auto pt-1">
              <Link
                href={heroContent.primaryButton?.href || '#philosophy'}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#C2905A] via-[#D9A76A] to-[#E5CBA8] px-7 py-3.5 text-xs sm:text-sm font-bold text-[#0E0A08] shadow-[0_0_25px_rgba(217,167,106,0.35)] active:scale-95 transition-all cursor-pointer text-center"
              >
                <span>{heroContent.primaryButton?.label || 'Философия ТАВ'}</span>
                <ArrowRight className="h-4 w-4 flex-shrink-0" />
              </Link>

              <Link
                href={heroContent.secondaryButton?.href || '/catalog'}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white/5 border border-white/15 px-6 py-3.5 text-xs sm:text-sm font-semibold text-[#E0D8CE] hover:text-white hover:bg-white/10 active:scale-95 transition-all cursor-pointer text-center backdrop-blur-md"
              >
                <Coffee className="h-4 w-4 text-[#D9A76A] flex-shrink-0" />
                <span>{heroContent.secondaryButton?.label || 'Каталог кофе'}</span>
              </Link>
            </div>
          </div>

          {/* Bottom Metrics (Bottom) */}
          <div className="relative z-10 w-full max-w-xl mx-auto px-4 text-center space-y-3 shrink-0">
            <div className="grid grid-cols-3 gap-2 sm:gap-4 p-2.5 sm:p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md">
              <div className="text-center space-y-0.5">
                <div className="text-base sm:text-xl font-black text-white font-serif">
                  {heroContent.metrics?.[0]?.value || '100%'}
                </div>
                <div className="text-[10px] sm:text-xs text-[#8E8276] leading-tight">
                  {heroContent.metrics?.[0]?.label || 'Спешелти Арабика'}
                </div>
              </div>
              <div className="text-center space-y-0.5 border-x border-white/10 px-1">
                <div className="text-base sm:text-xl font-black text-[#D9A76A] font-serif">
                  {heroContent.metrics?.[1]?.value || '84–89+'}
                </div>
                <div className="text-[10px] sm:text-xs text-[#8E8276] leading-tight">
                  {heroContent.metrics?.[1]?.label || 'Баллы SCA'}
                </div>
              </div>
              <div className="text-center space-y-0.5">
                <div className="text-base sm:text-xl font-black text-emerald-400 font-serif">
                  {heroContent.metrics?.[2]?.value || '0 ₽'}
                </div>
                <div className="text-[10px] sm:text-xs text-[#8E8276] leading-tight">
                  {heroContent.metrics?.[2]?.label || 'Помол в подарок'}
                </div>
              </div>
            </div>

            <div className="inline-flex items-center justify-center gap-2 text-[10px] sm:text-xs font-mono text-[#8E8276] bg-black/40 border border-white/10 px-3.5 py-1.5 rounded-full backdrop-blur-md">
              <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Пространство ТАВ</span>
              </span>
              <span className="text-white/20">•</span>
              <span>г. {store?.city || 'Майкоп'}, {store?.address || 'ул. К.А. Васильева, 2/1'}</span>
            </div>
          </div>

        </section>
      )}

      {/* 2. PHILOSOPHY & SOURCING */}
      {isBlockActive('philosophy') && (
        <section id="philosophy" className="py-10 sm:py-14 lg:py-16 border-b border-white/10 relative overflow-hidden bg-gradient-to-b from-[#0E0A08] via-[#120D0A] to-[#0E0A08]">
          
          <div className="absolute top-1/3 left-0 w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] bg-[#D9A76A]/10 rounded-full blur-[140px] pointer-events-none" />

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 lg:gap-14 items-center">
              
              {/* Left Manifesto */}
              <div className="md:col-span-5 space-y-4 sm:space-y-5 text-center md:text-left">
                <div className="inline-flex items-center gap-2 text-[10px] sm:text-xs font-mono font-bold uppercase tracking-[0.15em] sm:tracking-[0.2em] text-[#D9A76A]">
                  <Sparkles className="h-3.5 w-3.5 text-[#D9A76A]" />
                  <span>{philosophyContent.badge || 'ФИЛОСОФИЯ ОБЖАРКИ ТАВ'}</span>
                </div>

                <div className="space-y-2 sm:space-y-3">
                  <h2 className="text-2xl sm:text-3xl lg:text-5xl font-black text-white font-serif tracking-tight leading-[1.15]">
                    {philosophyContent.title || 'Чистый вкус зерна без компромиссов'}
                  </h2>
                  
                  <p className="text-xs sm:text-sm lg:text-base text-[#C4B9AD] leading-relaxed font-normal">
                    {philosophyContent.description1 ||
                      'Кофе — это живая ягода, отражающая климат, почву и высоту произрастания. Мы не прячем дефекты сырья за сверхтёмной обжаркой, а подбираем профили, подчеркивающие природную сладость, сочную кислотность и букет дескрипторов.'}
                  </p>
                  <p className="text-xs sm:text-sm lg:text-base text-[#C4B9AD] leading-relaxed font-normal">
                    {philosophyContent.description2 ||
                      'Каждый лот в коллекции ТАВ проходит многократные дегустации (каппинги) и получает подробный вкусовой паспорт с оценкой SCA.'}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2.5 sm:gap-3.5 pt-1 max-w-md mx-auto md:mx-0">
                  <div className="p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-white/[0.03] border border-white/10 space-y-0.5 text-center sm:text-left">
                    <div className="text-sm sm:text-lg font-bold font-serif text-white flex items-center justify-center sm:justify-start gap-1.5">
                      <Award className="h-4 w-4 text-[#D9A76A]" />
                      <span>Q-Grader</span>
                    </div>
                    <div className="text-[10px] sm:text-xs text-[#8E8276]">Контроль каждого батча</div>
                  </div>

                  <div className="p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-white/[0.03] border border-white/10 space-y-0.5 text-center sm:text-left">
                    <div className="text-sm sm:text-lg font-bold font-serif text-[#D9A76A]">7–14 дней</div>
                    <div className="text-[10px] sm:text-xs text-[#8E8276]">Пик раскрытия вкуса</div>
                  </div>
                </div>
              </div>

              {/* Right Cards */}
              <div className="md:col-span-7 space-y-3 sm:space-y-3.5">
                
                {/* Card 1: Single Origin */}
                <div className="group relative rounded-2xl sm:rounded-3xl overflow-hidden border border-white/15 bg-[#160F0B] p-4 sm:p-5 flex items-start sm:items-center gap-3.5 sm:gap-5 hover:border-[#D9A76A]/50 transition-all duration-300 shadow-xl">
                  <div className="relative h-20 w-20 sm:h-24 sm:w-24 rounded-xl sm:rounded-2xl overflow-hidden flex-shrink-0 border border-white/15 bg-[#140E0B]">
                    <Image
                      src="https://images.unsplash.com/photo-1587734195503-904fca47e0e9?q=80&w=600&auto=format&fit=crop"
                      alt="Моносорта ТАВ"
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                    <div className="absolute bottom-1 left-1 text-[9px] sm:text-[10px] font-mono font-bold text-[#D9A76A]">
                      Origin 🌿
                    </div>
                  </div>

                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <h3 className="text-sm sm:text-base lg:text-lg font-bold font-serif text-white group-hover:text-[#E5CBA8] transition-colors truncate">
                        Моносорта и редкие микролоты
                      </h3>
                      <span className="text-[10px] sm:text-[11px] font-mono text-[#D9A76A] bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-500/30 whitespace-nowrap">
                        SCA 85–89+
                      </span>
                    </div>
                    <p className="text-[11px] sm:text-xs text-[#C4B9AD] leading-relaxed">
                      Эфиопия, Колумбия, Кения, Коста-Рика и Гватемала. Мытая, натуральная и анаэробная ферментация для воронки V60, фильтра и кемекса.
                    </p>
                  </div>
                </div>

                {/* Card 2: Drip Coffee */}
                <div className="group relative rounded-2xl sm:rounded-3xl overflow-hidden border border-white/15 bg-[#160F0B] p-4 sm:p-5 flex items-start sm:items-center gap-3.5 sm:gap-5 hover:border-amber-500/50 transition-all duration-300 shadow-xl">
                  <div className="relative h-20 w-20 sm:h-24 sm:w-24 rounded-xl sm:rounded-2xl overflow-hidden flex-shrink-0 border border-white/15 bg-[#140E0B]">
                    <Image
                      src="https://images.unsplash.com/photo-1511920170033-f8396924c348?q=80&w=600&auto=format&fit=crop"
                      alt="Дрип-пакеты ТАВ"
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                    <div className="absolute bottom-1 left-1 text-[9px] sm:text-[10px] font-mono font-bold text-amber-300">
                      Drip ⚡
                    </div>
                  </div>

                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <h3 className="text-sm sm:text-base lg:text-lg font-bold font-serif text-white group-hover:text-[#E5CBA8] transition-colors truncate">
                        Дрип-пакеты в азотной среде
                      </h3>
                      <span className="text-[10px] sm:text-[11px] font-mono text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-500/30 whitespace-nowrap">
                        В дорогу & офис
                      </span>
                    </div>
                    <p className="text-[11px] sm:text-xs text-[#C4B9AD] leading-relaxed">
                      Свежесмолотый кофе в индивидуальных саше. Бескислородная упаковка защищает аромат и позволяет заваривать идеальную чашку за 2 минуты.
                    </p>
                  </div>
                </div>

                {/* Card 3: Espresso & Blends */}
                <div className="group relative rounded-2xl sm:rounded-3xl overflow-hidden border border-white/15 bg-[#160F0B] p-4 sm:p-5 flex items-start sm:items-center gap-3.5 sm:gap-5 hover:border-orange-500/50 transition-all duration-300 shadow-xl">
                  <div className="relative h-20 w-20 sm:h-24 sm:w-24 rounded-xl sm:rounded-2xl overflow-hidden flex-shrink-0 border border-white/15 bg-[#140E0B]">
                    <Image
                      src="https://images.unsplash.com/photo-1611854779393-1b2da9d400fe?q=80&w=600&auto=format&fit=crop"
                      alt="Эспрессо бленды ТАВ"
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                    <div className="absolute bottom-1 left-1 text-[9px] sm:text-[10px] font-mono font-bold text-orange-400">
                      Espresso ☕
                    </div>
                  </div>

                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <h3 className="text-sm sm:text-base lg:text-lg font-bold font-serif text-white group-hover:text-orange-300 transition-colors truncate">
                        Фирменные эспрессо-купажи
                      </h3>
                      <span className="text-[10px] sm:text-[11px] font-mono text-orange-400 bg-orange-950/60 px-2 py-0.5 rounded-full border border-orange-500/30 whitespace-nowrap">
                        Бархатная крема
                      </span>
                    </div>
                    <p className="text-[11px] sm:text-xs text-[#C4B9AD] leading-relaxed">
                      Сбалансированные авторские купажи ТАВ со сладким шоколадно-ореховым телом без едкой кислотности. Идеально для эспрессо и капучино.
                    </p>
                  </div>
                </div>

              </div>

            </div>
          </div>
        </section>
      )}

      {/* 3. 3 STANDARDS OF TAV */}
      {isBlockActive('standards') && (
        <section className="py-10 sm:py-14 lg:py-16 border-b border-white/10 relative overflow-hidden bg-[#0E0A08]">
          
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 space-y-8 sm:space-y-12">
            
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="space-y-2 max-w-2xl">
                <div className="inline-flex items-center gap-2 text-[10px] sm:text-xs font-mono font-bold uppercase tracking-[0.15em] sm:tracking-[0.2em] text-[#D9A76A]">
                  <ShieldCheck className="h-3.5 w-3.5 text-[#D9A76A]" />
                  <span>{standardsContent.badge || 'СТАНДАРТЫ КАЧЕСТВА ТАВ'}</span>
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-5xl font-black text-white font-serif tracking-tight leading-tight">
                  {standardsContent.title || '3 правила бренда ТАВ'}
                </h2>
              </div>

              <p className="text-xs sm:text-sm text-[#C4B9AD] max-w-md md:text-right leading-relaxed font-normal">
                {standardsContent.subtitle ||
                  'От строгого отбора зеленого сырья до упаковки и помола зерна в присутствии гостя.'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 lg:gap-8 items-stretch">
              
              {/* Standard 01 */}
              <div className="group relative rounded-2xl sm:rounded-[32px] p-5 sm:p-6 lg:p-8 bg-[#150F0C] border border-white/15 hover:border-[#D9A76A]/50 transition-all duration-300 shadow-2xl flex flex-col justify-between space-y-5">
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl sm:text-5xl font-black font-serif text-white/20 group-hover:text-[#D9A76A]/40 transition-colors">
                      {standardsContent.rules?.[0]?.number || '01'}
                    </span>
                    <span className="text-[10px] sm:text-[11px] font-mono font-bold text-[#D9A76A] bg-amber-950/60 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                      {standardsContent.rules?.[0]?.badge || 'SCA 84–89+'}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-base sm:text-lg lg:text-xl font-bold font-serif text-white group-hover:text-[#E5CBA8] transition-colors leading-snug">
                      {standardsContent.rules?.[0]?.title || 'Только 100% Спешелти зерно'}
                    </h3>
                    <p className="text-xs text-[#C4B9AD] leading-relaxed">
                      {standardsContent.rules?.[0]?.description ||
                        'Никакой коммерческой робусты и дефектного зерна. Мы работаем с лотами с прозрачным происхождением и подтвержденной историей фермы.'}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/10 space-y-1.5 text-[10px] sm:text-[11px] font-mono text-[#8E8276]">
                  <div className="flex items-center gap-2 text-[#E0D8CE]">
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#D9A76A] flex-shrink-0" />
                    <span>Прозрачный терруар и обработка</span>
                  </div>
                </div>
              </div>

              {/* Standard 02 */}
              <div className="group relative rounded-2xl sm:rounded-[32px] p-5 sm:p-6 lg:p-8 bg-[#150F0C] border border-white/15 hover:border-amber-500/50 transition-all duration-300 shadow-2xl flex flex-col justify-between space-y-5">
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl sm:text-5xl font-black font-serif text-white/20 group-hover:text-[#D9A76A]/40 transition-colors">
                      {standardsContent.rules?.[1]?.number || '02'}
                    </span>
                    <span className="text-[10px] sm:text-[11px] font-mono font-bold text-amber-300 bg-amber-950/60 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                      {standardsContent.rules?.[1]?.badge || 'До 14 дней'}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-base sm:text-lg lg:text-xl font-bold font-serif text-white group-hover:text-[#E5CBA8] transition-colors leading-snug">
                      {standardsContent.rules?.[1]?.title || 'Свежесть и контроль обжарки'}
                    </h3>
                    <p className="text-xs text-[#C4B9AD] leading-relaxed">
                      {standardsContent.rules?.[1]?.description ||
                        'Обжариваем небольшими партиями каждую неделю. Пакеты с односторонним дегазационным клапаном сохраняют сочные эфирные масла.'}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/10 space-y-1.5 text-[10px] sm:text-[11px] font-mono text-[#8E8276]">
                  <div className="flex items-center gap-2 text-[#E0D8CE]">
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#D9A76A] flex-shrink-0" />
                    <span>Еженедельные батчи свежей обжарки</span>
                  </div>
                </div>
              </div>

              {/* Standard 03 */}
              <div className="group relative rounded-2xl sm:rounded-[32px] p-5 sm:p-6 lg:p-8 bg-[#150F0C] border border-white/15 hover:border-emerald-500/50 transition-all duration-300 shadow-2xl flex flex-col justify-between space-y-5">
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl sm:text-5xl font-black font-serif text-white/20 group-hover:text-emerald-400/40 transition-colors">
                      {standardsContent.rules?.[2]?.number || '03'}
                    </span>
                    <span className="text-[10px] sm:text-[11px] font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                      {standardsContent.rules?.[2]?.badge || 'Бесплатно 0 ₽'}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-base sm:text-lg lg:text-xl font-bold font-serif text-white group-hover:text-emerald-300 transition-colors leading-snug">
                      {standardsContent.rules?.[2]?.title || 'Профессиональный помол'}
                    </h3>
                    <p className="text-xs text-[#C4B9AD] leading-relaxed">
                      {standardsContent.rules?.[2]?.description ||
                        'Мы бесплатно смолем зерно под ваш метод (турка, эспрессо, гейзер, воронка V60, френч-пресс) прямо при вас.'}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/10 space-y-1.5 text-[10px] sm:text-[11px] font-mono text-[#8E8276]">
                  <div className="flex items-center gap-2 text-[#E0D8CE]">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0" />
                    <span>Жернова профессионального грейда</span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </section>
      )}

      {/* 4. CALLOUT BANNER */}
      {isBlockActive('callout_banner') && (
        <section className="py-10 sm:py-14 lg:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="relative rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#1F1612] via-[#140E0B] to-[#1A130E] border border-white/20 p-5 sm:p-10 lg:p-14 shadow-2xl overflow-hidden">
              <div className="absolute top-0 right-0 w-80 sm:w-96 h-80 sm:h-96 bg-[#D9A76A]/15 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 sm:gap-8">
                <div className="space-y-2 sm:space-y-2.5 max-w-xl">
                  <div className="inline-flex items-center gap-2 text-[10px] sm:text-xs font-mono font-bold uppercase tracking-[0.15em] sm:tracking-[0.2em] text-[#D9A76A]">
                    <Store className="h-3.5 w-3.5 text-[#D9A76A]" />
                    <span>{calloutContent.badge || `Пространство ТАВ ${store?.city ? `в ${store.city}` : 'в Майкопе'}`}</span>
                  </div>
                  <h3 className="text-xl sm:text-3xl lg:text-4xl font-black text-white font-serif leading-tight">
                    {calloutContent.title || 'Ждем вас на дегустацию свежего зерна'}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#C4B9AD] leading-relaxed">
                    {calloutContent.description ||
                      'Приходите вдохнуть ароматы свежей обжарки, подобрать дрип-кофе и аксессуары или забрать онлайн-заказ.'}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 w-full md:w-auto flex-shrink-0">
                  <Link
                    href={calloutContent.buttonPrimary?.href || '/contacts'}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#D9A76A] px-5 sm:px-6 py-3.5 text-xs sm:text-sm font-bold text-[#0E0A08] shadow-[0_0_25px_rgba(217,167,106,0.4)] hover:bg-[#E5CBA8] active:scale-95 transition-all cursor-pointer text-center"
                  >
                    <MapPin className="h-4 w-4 flex-shrink-0" />
                    <span>{calloutContent.buttonPrimary?.label || 'Контакты и адрес'}</span>
                  </Link>

                  <Link
                    href={calloutContent.buttonSecondary?.href || '/catalog'}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white/5 border border-white/15 px-5 sm:px-6 py-3.5 text-xs sm:text-sm font-semibold text-white hover:bg-white/10 active:scale-95 transition-all cursor-pointer text-center"
                  >
                    <span>{calloutContent.buttonSecondary?.label || 'Каталог кофе'}</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

    </div>
  );
}
