'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles, Coffee, Award, ShieldCheck, Layers } from 'lucide-react';

interface AboutSnippetProps {
  badge?: string;
  headline?: string;
  headlineHighlight?: string;
  quote?: string;
  description?: string;
  ctaLabel?: string;
  ctaHref?: string;
  imageUrl?: string;
  featureStripTitle?: string;
  featureStripBadge?: string;
  panel1Title?: string;
  panel1Text?: string;
  panel2Title?: string;
  panel2Text?: string;
}

export function AboutSnippet({
  badge = 'Философия ТАВ',
  headline = 'Культура спешелти',
  headlineHighlight = 'и чистота вкуса',
  quote = '«Для ТАВ кофе — это не просто утренний ритуал. Это результат труда фермеров, чистота высокогорного терруара и ювелирная точность обжарки.»',
  description = 'Мы отбираем зеленый кофе только категории Specialty с оценкой SCA от 84 до 89+ баллов. Обжариваем небольшими партиями каждую неделю, чтобы в вашей чашке всегда раскрывался пик аромата и сочности.',
  ctaLabel = 'Узнать больше о ТАВ',
  ctaHref = '/about',
  imageUrl = 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=1200&auto=format&fit=crop',
  featureStripTitle = 'Дегустация и свежий помол',
  featureStripBadge = 'Бесплатно',
  panel1Title = 'Контроль Q-грейдинга',
  panel1Text = 'Тестирование каждого лота на каппингах и точная калибровка профилей.',
  panel2Title = 'Помол под ваш метод',
  panel2Text = 'Бесплатно мелем зерно под эспрессо, V60, гейзер, турку или френч-пресс.',
}: AboutSnippetProps = {}) {
  return (
    <section className="relative py-10 sm:py-14 lg:py-16 bg-[#0E0A08] text-white border-b border-[#1E1712] overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/2 -left-20 -translate-y-1/2 w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] bg-amber-950/15 rounded-full blur-[120px] sm:blur-[160px] pointer-events-none" />
      <div className="absolute top-1/3 -right-20 w-[350px] sm:w-[550px] h-[350px] sm:h-[550px] bg-[#D9A76A]/10 rounded-full blur-[120px] sm:blur-[150px] pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 lg:gap-14 items-stretch">
          
          {/* LEFT: Full-Height Atmospheric Photo Stage */}
          <div className="md:col-span-5 lg:col-span-5 relative self-stretch flex flex-col min-h-[360px] sm:min-h-[460px] md:min-h-full">
            <div className="relative flex-1 w-full min-h-[360px] sm:min-h-[460px] md:min-h-full rounded-2xl sm:rounded-[32px] overflow-hidden border border-white/15 shadow-2xl group bg-[#150F0A]">
              <Image
                src={imageUrl}
                alt="Пространство ТАВ"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center group-hover:scale-105 transition-transform duration-1000 ease-out"
              />
              
              {/* Luxury dark gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0E0A08] via-[#0E0A08]/40 to-black/20" />

              {/* In-photo Bottom Feature Strip */}
              <div className="absolute bottom-3 sm:bottom-5 left-3 sm:left-5 right-3 sm:right-5 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-black/75 backdrop-blur-xl border border-white/15 text-white flex items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
                  <span className="font-semibold text-[11px] sm:text-xs text-white">{featureStripTitle}</span>
                </div>
                <span className="text-[10px] sm:text-[11px] font-mono text-[#D9A76A] font-bold bg-white/5 px-2.5 py-1 rounded-lg border border-white/10 flex-shrink-0">
                  {featureStripBadge}
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT: Editorial Manifesto & Coffee Philosophy */}
          <div className="md:col-span-7 lg:col-span-7 space-y-4 sm:space-y-6 flex flex-col justify-center">
            
            {/* Eyebrow & Title */}
            <div className="space-y-2 sm:space-y-3">
              <div className="flex items-center gap-2.5 sm:gap-3">
                <span className="text-[11px] sm:text-xs font-mono tracking-widest text-[#D9A76A] uppercase">
                  {badge}
                </span>
                <span className="h-px w-6 sm:w-8 bg-[#D9A76A]/40" />
              </div>

              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-serif text-white tracking-tight leading-[1.15]">
                {headline} <br />
                <span className="italic font-normal text-[#E5CBA8]">{headlineHighlight}</span>
              </h2>
            </div>

            {/* Lead Manifesto Quote */}
            <div className="pl-3.5 sm:pl-5 border-l-2 border-[#D9A76A]/70 space-y-1.5 sm:space-y-2">
              <p className="text-sm sm:text-base md:text-lg text-[#E5DDD3] font-serif italic leading-relaxed">
                {quote}
              </p>
            </div>

            {/* Narrative text */}
            <p className="text-[#A89D91] text-xs sm:text-sm md:text-base leading-relaxed">
              {description}
            </p>

            {/* 2 Refined Direction Mini-Panels */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              
              {/* Panel 1: Обжарка */}
              <div className="p-3.5 sm:p-5 rounded-xl sm:rounded-2xl bg-white/[0.03] hover:bg-[#D9A76A]/10 border border-white/10 hover:border-[#D9A76A]/40 transition-all duration-300 group/p1">
                <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
                  <div className="h-6 w-6 sm:h-7 sm:w-7 rounded-lg bg-[#D9A76A]/20 border border-[#D9A76A]/40 flex items-center justify-center text-[#D9A76A] flex-shrink-0">
                    <Award className="h-3 w-3 sm:h-3.5 w-3.5" />
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-white group-hover/p1:text-[#E5CBA8] transition-colors">
                    {panel1Title}
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs text-[#8E8276] leading-relaxed">
                  {panel1Text}
                </p>
              </div>

              {/* Panel 2: Сервис помола */}
              <div className="p-3.5 sm:p-5 rounded-xl sm:rounded-2xl bg-white/[0.03] hover:bg-amber-500/10 border border-white/10 hover:border-amber-500/40 transition-all duration-300 group/p2">
                <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
                  <div className="h-6 w-6 sm:h-7 sm:w-7 rounded-lg bg-[#D9A76A]/20 border border-[#D9A76A]/40 flex items-center justify-center text-[#D9A76A] flex-shrink-0">
                    <Coffee className="h-3 w-3 sm:h-3.5 w-3.5" />
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-white group-hover/p2:text-amber-200 transition-colors">
                    {panel2Title}
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs text-[#8E8276] leading-relaxed">
                  {panel2Text}
                </p>
              </div>

            </div>

            {/* Action CTA Button */}
            <div className="pt-2 sm:pt-3">
              <Link
                href={ctaHref}
                className="w-full inline-flex items-center justify-between gap-3.5 rounded-xl sm:rounded-2xl bg-gradient-to-r from-[#C2905A] via-[#D9A76A] to-[#E5CBA8] hover:from-[#B8854F] hover:to-[#D9A76A] px-6 sm:px-8 py-3.5 sm:py-4 text-xs sm:text-sm font-bold text-[#0E0A08] shadow-xl shadow-amber-950/60 transition-all duration-300 group/btn cursor-pointer active:scale-95 text-center"
              >
                <span className="font-bold">{ctaLabel}</span>
                <div className="h-6 w-6 sm:h-7 sm:w-7 rounded-lg sm:rounded-xl bg-black/15 flex items-center justify-center group-hover/btn:translate-x-1 transition-transform shrink-0">
                  <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#0E0A08]" />
                </div>
              </Link>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
