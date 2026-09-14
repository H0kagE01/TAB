'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, ArrowRight, Coffee, Droplets, Layers, Sparkles } from 'lucide-react';

const directions = [
  {
    id: 'single-origin',
    number: '01',
    category: 'Single Origin & Micro-lots',
    title: 'Моносорта и микролоты',
    description:
      'Высокогорная арабика с уникальным терруаром. Чистые дескрипторы вкуса: от жасмина и бергамота до черной смородины и клубники.',
    image:
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=1200&auto=format&fit=crop',
    href: '/catalog/single-origin',
    actionLabel: 'Выбрать моносорт',
    accentColor: '#D9A76A',
    borderColor: 'hover:border-amber-500/40',
    tags: [
      { label: 'Эфиопия Иргачефф', href: '/product/ethiopia-yirgacheffe-washed' },
      { label: 'Кения Ньери (SL28)', href: '/product/kenya-aa-nyeri-hill' },
      { label: 'Коста-Рика Анаэробика', href: '/product/costa-rica-tarrazu-anaerobic' },
      { label: 'Светлая обжарка (V60)', href: '/coffee' },
    ],
    features: ['100% Спешелти Арабика', 'Q-Score 85–89', 'Бесплатный помол'],
  },
  {
    id: 'drip-coffee',
    number: '02',
    category: 'Portable Drip Coffee',
    title: 'Дрип-пакеты в саше',
    description:
      'Натуральный свежесмолотый кофе в индивидуальных фильтрах с азотным наполнением. Идеальный кофе в чашке за 2 минуты без кофемашины.',
    image:
      'https://images.unsplash.com/photo-1511920170033-f8396924c348?q=80&w=1200&auto=format&fit=crop',
    href: '/catalog/drip-coffee',
    actionLabel: 'В каталог дрип-кофе',
    accentColor: '#E5CBA8',
    borderColor: 'hover:border-amber-300/40',
    tags: [
      { label: 'Mix Box 10 шт', href: '/product/tav-drip-box-mix-10' },
      { label: 'Ethiopia Washed 10 шт', href: '/product/tav-drip-box-ethiopia-10' },
      { label: 'Balance Colombia 10 шт', href: '/product/tav-drip-box-colombia-brazil-10' },
    ],
    features: ['Герметичный азотный барьер', '11.5г спешелти зерна в саше', 'В дорогу и офис'],
  },
  {
    id: 'espresso-blends',
    number: '03',
    category: 'Signature Espresso',
    title: 'Эспрессо-купажи ТАВ',
    description:
      'Авторские смеси средней и тёмной обжарки для плотного эспрессо, капучино и домашних кофемашин. Бархатная крема и ноты пралине.',
    image:
      'https://images.unsplash.com/photo-1611854779393-1b2da9d400fe?q=80&w=1200&auto=format&fit=crop',
    href: '/catalog/espresso-blends',
    actionLabel: 'Смотреть бленды',
    accentColor: '#C2905A',
    borderColor: 'hover:border-orange-500/40',
    tags: [
      { label: 'ТАВ Signature Blend', href: '/product/tav-signature-espresso-blend' },
      { label: 'Brazil Cerrado Dulce', href: '/product/brazil-cerrado-dulce' },
      { label: 'Средняя и темная обжарка', href: '/coffee' },
    ],
    features: ['Густая стойкая пенка', 'Низкая кислотность', 'Для эспрессо и гейзера'],
  },
  {
    id: 'accessories',
    number: '04',
    category: 'Brewing Gear & Barista Tools',
    title: 'Аксессуары & V60',
    description:
      'Профессиональное оборудование для альтернативного заваривания дома: японские воронки Hario V60, ручные кофемолки Timemore со стальными жерновами.',
    image:
      'https://images.unsplash.com/photo-1544787219-7f47ccb76574?q=80&w=1200&auto=format&fit=crop',
    href: '/catalog/accessories',
    actionLabel: 'Оборудование для дома',
    accentColor: '#9E9284',
    borderColor: 'hover:border-stone-500/40',
    tags: [
      { label: 'Hario V60 Керамика', href: '/product/hario-v60-ceramic-02-black' },
      { label: 'Кофемолка Timemore C3', href: '/product/timemore-chestnut-c3-pro' },
      { label: 'Сервер Hario 600мл', href: '/product/hario-v60-range-server-600' },
    ],
    features: ['Оригинальные бренды Hario & Timemore', 'Точный помол зерна', 'Для идеальной чашки'],
  },
];

interface DirectionsBlockProps {
  badge?: string;
  headline?: string;
  headlineHighlight?: string;
  description?: string;
  cards?: Array<{
    number?: string;
    category?: string;
    title?: string;
    description?: string;
    imageUrl?: string;
    image?: string; // legacy
    href?: string;
    actionLabel?: string;
    tags?: string | Array<{label: string; href?: string}>;
    features?: string | string[];
    accentColor?: string;
    borderColor?: string;
  }>;
}

export function DirectionsBlock({
  badge = 'КОЛЛЕКЦИЯ ТАВ',
  headline = 'Кофе для любого настроения',
  headlineHighlight = 'и способа заваривания',
  description = 'От сочных ягодных моносортов под воронку до плотных орехово-шоколадных эспрессо-смесей.',
  cards: cardsProp,
}: DirectionsBlockProps = {}) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Merge DB card data with hardcoded defaults
  const ACCENT_COLORS = ['#D9A76A', '#E5CBA8', '#C2905A', '#9E9284'];
  const BORDER_COLORS = [
    'hover:border-amber-500/40',
    'hover:border-amber-300/40',
    'hover:border-orange-500/40',
    'hover:border-stone-500/40',
  ];

  const resolvedCards = (cardsProp && cardsProp.length === 4 ? cardsProp : directions).map(
    (card: any, idx: number) => {
      // Normalize tags: string → [{label}]
      let tags: Array<{label: string; href?: string}> = [];
      if (Array.isArray(card.tags)) {
        if (typeof card.tags[0] === 'string') {
          tags = (card.tags as string[]).map((t: string) => ({ label: t }));
        } else {
          tags = card.tags as Array<{label: string; href?: string}>;
        }
      } else if (typeof card.tags === 'string') {
        tags = card.tags.split(',').map((t: string) => ({ label: t.trim() })).filter((t: any) => t.label);
      }

      // Normalize features: string → string[]
      let features: string[] = [];
      if (Array.isArray(card.features)) {
        features = card.features as string[];
      } else if (typeof card.features === 'string') {
        features = card.features.split(',').map((f: string) => f.trim()).filter(Boolean);
      }

      return {
        id: card.id || card.number || `card-${idx}`,
        number: card.number || `0${idx + 1}`,
        category: card.category || '',
        title: card.title || '',
        description: card.description || '',
        image: card.imageUrl || card.image || '',
        href: card.href || '/',
        actionLabel: card.actionLabel || 'Узнать больше',
        accentColor: card.accentColor || ACCENT_COLORS[idx % 4],
        borderColor: card.borderColor || BORDER_COLORS[idx % 4],
        tags,
        features,
      };
    }
  );

  return (
    <section className="relative py-10 sm:py-14 lg:py-16 bg-[#0E0A08] text-white border-b border-[#1E1712] overflow-hidden">
      {/* Ambient lighting */}
      <div className="absolute top-1/3 left-1/4 -translate-y-1/2 w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] bg-amber-950/15 rounded-full blur-[120px] sm:blur-[150px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 -translate-y-1/2 w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] bg-[#B88B58]/10 rounded-full blur-[120px] sm:blur-[150px] pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header: Minimalist & Editorial */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 mb-6 sm:mb-8 pb-4 sm:pb-5 border-b border-white/10">
          <div className="space-y-2 sm:space-y-3 max-w-xl">
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="text-[11px] sm:text-xs font-mono tracking-widest text-[#D9A76A] uppercase">
                {badge}
              </span>
              <span className="h-px w-6 sm:w-8 bg-[#D9A76A]/40" />
            </div>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-serif text-white tracking-tight leading-[1.15]">
              {headline} <br className="hidden sm:inline" />
              <span className="italic font-normal text-[#E5CBA8]">{headlineHighlight}</span>
            </h2>
            {description && (
              <p className="text-[#A89D91] text-xs sm:text-sm leading-relaxed max-w-lg">{description}</p>
            )}
          </div>

          <p className="text-[#9E9284] text-xs sm:text-sm md:text-base max-w-md leading-relaxed">
            Мы отбираем зеленый кофе высшего грейда, разрабатываем индивидуальные профили обжарки и подбираем аксессуары для безупречного вкуса.
          </p>
        </div>

        {/* 4 Key Directions Editorial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {resolvedCards.map((dir) => {
            return (
              <div
                key={dir.id}
                onMouseEnter={() => setHoveredId(dir.id)}
                onMouseLeave={() => setHoveredId(null)}
                className={`group relative overflow-hidden rounded-2xl sm:rounded-[28px] bg-[#140E0A] border border-white/10 ${dir.borderColor} transition-all duration-500 flex flex-col justify-between min-h-[440px] sm:min-h-[480px] shadow-2xl`}
              >
                {/* Background Image Layer */}
                <div className="absolute inset-0 z-0 select-none pointer-events-none overflow-hidden">
                  <Image
                    src={dir.image}
                    alt={dir.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover object-center opacity-25 group-hover:opacity-40 group-hover:scale-105 transition-all duration-1000 ease-out"
                  />
                  {/* Cinematic Vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0E0A08] via-[#0E0A08]/85 to-[#0E0A08]/50" />
                  
                  {/* Hover ambient radial color */}
                  <div
                    className="absolute -top-20 -right-20 w-80 h-80 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-700 pointer-events-none"
                    style={{ backgroundColor: dir.accentColor }}
                  />
                </div>

                {/* Card Top: Number & Category Header */}
                <div className="relative z-10 p-5 sm:p-7 lg:p-8 space-y-4">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3 sm:pb-4 gap-2">
                    <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 flex-1">
                      <span className="font-mono text-xs sm:text-sm font-bold text-[#D9A76A] flex-shrink-0">
                        {dir.number}
                      </span>
                      <span className="h-3 w-px bg-white/20 flex-shrink-0" />
                      <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-[#A89D91] truncate">
                        {dir.category}
                      </span>
                    </div>

                    <Link
                      href={dir.href}
                      className="inline-flex items-center gap-1 text-xs text-[#C4B9AD] group-hover:text-white transition-colors flex-shrink-0 whitespace-nowrap"
                    >
                      <span className="whitespace-nowrap">В раздел</span>
                      <ArrowUpRight className="h-3.5 w-3.5 text-[#D9A76A] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform flex-shrink-0" />
                    </Link>
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-2">
                    <h3 className="text-2xl sm:text-3xl font-serif text-white tracking-tight group-hover:text-[#F7F4EF] transition-colors">
                      {dir.title}
                    </h3>
                    <p className="text-[#B5AAA0] text-xs sm:text-sm leading-relaxed max-w-xl">
                      {dir.description}
                    </p>
                  </div>

                  {/* Clean Editorial Sub-links */}
                  <div className="pt-1">
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      {dir.tags.map((tag, idx) => (
                        <Link
                          key={idx}
                          href={tag.href || '#'}
                          className="px-3 py-1.5 rounded-full text-xs font-medium text-[#D1C7BC] bg-white/[0.04] border border-white/10 hover:bg-[#D9A76A]/15 hover:border-[#D9A76A]/40 hover:text-[#E5CBA8] transition-all duration-200"
                        >
                          {tag.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Bottom: Features & Refined Action */}
                <div className="relative z-10 p-5 sm:p-7 lg:p-8 pt-0 space-y-4">
                  {/* Subtle Features list with bullet separators */}
                  <div className="flex flex-wrap items-center gap-y-1.5 gap-x-3 text-[11px] sm:text-xs text-[#8A7E72] border-t border-white/10 pt-3 sm:pt-4 font-mono">
                    {dir.features.map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-[#D9A76A]" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>

                  {/* Refined CTA Button */}
                  <Link
                    href={dir.href}
                    className="group/btn relative w-full overflow-hidden rounded-xl sm:rounded-2xl p-3.5 sm:p-4 flex items-center justify-between text-xs sm:text-sm font-bold transition-all duration-300 bg-gradient-to-r from-[#C2905A] via-[#D9A76A] to-[#E5CBA8] hover:from-[#B8854F] hover:to-[#D9A76A] text-[#0E0A08] shadow-lg shadow-amber-950/60"
                  >
                    <span className="group-hover/btn:translate-x-1 transition-transform">
                      {dir.actionLabel}
                    </span>

                    <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg sm:rounded-xl flex items-center justify-center bg-black/15 text-[#0E0A08] group-hover/btn:scale-105 group-hover/btn:translate-x-0.5 transition-all duration-300">
                      <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </div>
                  </Link>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
