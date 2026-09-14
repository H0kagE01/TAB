'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Coffee,
  Sparkles,
  Droplets,
  Flame,
  ArrowRight,
  ShieldCheck,
  Zap,
  CheckCircle2,
  SlidersHorizontal,
  Compass,
  Clock,
} from 'lucide-react';
import { Product, RoastLevel } from '@/types';
import { ResolvedRoastProfile, ResolvedTerroirItem } from '@/lib/types/page-blocks';
import { ProductCard } from '@/components/catalog/ProductCard';

interface CoffeeClientProps {
  products: Product[];
  roastGuideContent?: Record<string, any>;
  roastProfiles?: ResolvedRoastProfile[];
  isRoastGuideActive?: boolean;
  terroirAtlasContent?: Record<string, any>;
  terroirData?: ResolvedTerroirItem[];
  isTerroirAtlasActive?: boolean;
  grindingStationContent?: Record<string, any>;
  isGrindingStationActive?: boolean;
  coffeeCollectionContent?: Record<string, any>;
  isCoffeeCollectionActive?: boolean;
  sensoryCycleContent?: Record<string, any>;
  isSensoryCycleActive?: boolean;
}

const DEFAULT_GRIND_METHODS = [
  {
    number: '01',
    title: 'Турка (Джезва)',
    subtitle: 'Экстра-тонкий (пыль)',
    fraction: '≈ 0.1 мм',
    desc: 'Помол в нежнейшую пудру для плотного напитка с густой бархатистой пенкой.',
    time: '2–3 мин',
  },
  {
    number: '02',
    title: 'Эспрессо',
    subtitle: 'Тонкий калиброванный',
    fraction: '≈ 0.3 мм',
    desc: 'Фракция под давление 9 бар рожковой или автоматической кофемашины.',
    time: '25–30 сек',
  },
  {
    number: '03',
    title: 'Гейзер (Moka)',
    subtitle: 'Средне-тонкий помол',
    fraction: '≈ 0.5 мм',
    desc: 'Размер песчинок тростникового сахара. Не забивает фильтр гейзера.',
    time: '3–4 мин',
  },
  {
    number: '04',
    title: 'Фильтр & V60',
    subtitle: 'Средний помол',
    fraction: '≈ 0.8 мм',
    desc: 'Для воронки V60, фильтр-кофеварок и кемекса. Раскрывает ягоды и цветы.',
    time: '3–3.5 мин',
  },
  {
    number: '05',
    title: 'Френч-пресс',
    subtitle: 'Крупный помол',
    fraction: '≈ 1.2 мм',
    desc: 'Крупные гранулы для долгого настаивания и Cold Brew без кофейной пыли.',
    time: '4–5 мин',
  },
];

const DEFAULT_SENSORY_PHASES = [
  {
    days: '1–3 ДЕНЬ',
    title: 'Фаза активной дегазации',
    desc: 'Выход углекислого газа после ростера. Вкус зерна только начинает структурироваться.',
    highlight: false,
  },
  {
    days: '4–21 ДЕНЬ',
    title: '✨ Пик вкусоароматики',
    desc: 'Максимум эфирных масел, сочная чистая кислотность и шелковистое тело в чашке.',
    highlight: true,
  },
  {
    days: '30+ ДНЕЙ',
    title: 'Медленное угасание',
    desc: 'Постепенное окисление тонких ягодных и цветочных дескрипторов.',
    highlight: false,
  },
];

const DEFAULT_SENSORY_FEATURES = [
  {
    tag1: 'TOP 10% УРОЖАЯ',
    tag2: '84+ SCA',
    title: '100% Specialty Arabica',
    desc: 'Ручной селекционный сбор ягод без дефектов. Прозрачное происхождение каждого микролота.',
  },
  {
    tag1: 'БАРЬЕРНАЯ ФОЛЬГА',
    tag2: 'WICOvalves',
    title: 'Клапан дегазации & Zip-Lock',
    desc: 'Трехслойный металлизированный барьер блокирует кислород, сохраняя 1000+ эфирных соединений.',
  },
  {
    tag1: 'В МАГАЗИНЕ',
    tag2: 'МАЙКОП',
    title: 'Помол в подарок на Васильева, 2/1',
    desc: 'Бесплатно смолем любую пачку на калиброванных жерновах под ваш девайс.',
  },
];

export function CoffeeClient({
  products,
  roastGuideContent,
  roastProfiles = [],
  isRoastGuideActive = true,
  terroirAtlasContent,
  terroirData = [],
  isTerroirAtlasActive = true,
  grindingStationContent,
  isGrindingStationActive = true,
  coffeeCollectionContent,
  isCoffeeCollectionActive = true,
  sensoryCycleContent,
  isSensoryCycleActive = true,
}: CoffeeClientProps) {
  const [selectedRoast, setSelectedRoast] = useState<RoastLevel>('medium');
  const [selectedTerroirId, setSelectedTerroirId] = useState<string>(
    terroirData[0]?.id || 'ethiopia-yirgacheffe'
  );
  const [activeTab, setActiveTab] = useState<'all' | RoastLevel>('all');

  const activeRoastProfiles: ResolvedRoastProfile[] =
    roastProfiles && roastProfiles.length > 0
      ? roastProfiles
      : [
          {
            id: 'light' as RoastLevel,
            levelKey: 'light' as RoastLevel,
            title: 'Светлая обжарка (Light)',
            badge: 'Для ценителей',
            subtitle: 'Цветы, бергамот и сочные спелые фрукты',
            description: 'Раскрывает истинный терруар и природную сочность кофейной ягоды.',
            flavorNotes: ['Бергамот', 'Жасмин', 'Белый персик', 'Лайм'],
            recommendedBrew: 'V60 воронка, Кемекс, Аэропресс, Фильтр-кофеварка',
            acidity: 5,
            body: 2,
            sweetness: 4,
            bitterness: 1,
            color: 'from-amber-400 to-yellow-500',
            glowColor: 'rgba(245, 158, 11, 0.4)',
            recommendedProduct: null,
          },
          {
            id: 'medium' as RoastLevel,
            levelKey: 'medium' as RoastLevel,
            title: 'Средняя обжарка (Medium)',
            badge: 'Хит & Баланс',
            subtitle: 'Карамель, молочный шоколад и баланс',
            description: 'Самый гармоничный и универсальный профиль.',
            flavorNotes: ['Молочный шоколад', 'Карамель', 'Красное яблоко', 'Фундук'],
            recommendedBrew: 'Гейзерная кофеварка, Автомат, Эспрессо',
            acidity: 3,
            body: 4,
            sweetness: 5,
            bitterness: 2,
            color: 'from-amber-600 to-orange-500',
            glowColor: 'rgba(217, 119, 6, 0.45)',
            recommendedProduct: null,
          },
          {
            id: 'dark' as RoastLevel,
            levelKey: 'dark' as RoastLevel,
            title: 'Тёмная обжарка (Dark Espresso)',
            badge: 'Классика',
            subtitle: 'Плотное тело, темный шоколад и какао',
            description: 'Густой, плотный и маслянистый эспрессо-профиль без лишней кислотности.',
            flavorNotes: ['Тёмный шоколад', 'Жареный фундук', 'Патока', 'Какао'],
            recommendedBrew: 'Классический эспрессо, Капучино, Латте, Турка',
            acidity: 1,
            body: 5,
            sweetness: 3,
            bitterness: 4,
            color: 'from-[#8B5A2B] to-[#5C3A21]',
            glowColor: 'rgba(139, 90, 43, 0.5)',
            recommendedProduct: null,
          },
        ];

  const currentProfile =
    activeRoastProfiles.find((p) => p.id === selectedRoast) ||
    activeRoastProfiles[0];

  const currentTerroir =
    terroirData.find((t) => t.id === selectedTerroirId) ||
    terroirData[0] || {
      id: 'default',
      countryId: '',
      region: 'Иргачиф',
      continent: 'Восточная Африка',
      altitude: '1900 – 2200 м',
      process: 'Мытая обработка',
      sommelierNotes: 'Спешелти кофе высокогорных терруаров.',
      flavorNotes: ['Бергамот', 'Жасмин', 'Персик'],
      imageUrl: 'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?q=80&w=1200&auto=format&fit=crop',
      order: 1,
      isActive: true,
      country: { name: 'Эфиопия', code: 'ET', flagEmoji: '🇪🇹' },
      product: null,
    };

  // Coffee collection product resolution
  const isManualMode = coffeeCollectionContent?.mode === 'manual';
  const manualProductIds: string[] = Array.isArray(coffeeCollectionContent?.productIds)
    ? coffeeCollectionContent.productIds
    : [];

  let baseProducts = products;
  if (isManualMode && manualProductIds.length > 0) {
    const productMap = new Map(products.map((p) => [p.id, p]));
    baseProducts = manualProductIds
      .map((id) => productMap.get(id))
      .filter(Boolean) as Product[];
  } else {
    // Sort logic in auto mode
    const sortBy = coffeeCollectionContent?.sortBy || 'default';
    if (sortBy === 'popular') {
      baseProducts = [...products].sort((a, b) => (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0));
    } else if (sortBy === 'new') {
      baseProducts = [...products].sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    } else if (sortBy === 'price_asc') {
      baseProducts = [...products].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price_desc') {
      baseProducts = [...products].sort((a, b) => b.price - a.price);
    }
  }

  // Filter by roast tab
  const showTabs = coffeeCollectionContent?.showTabs !== false;
  let filteredProducts = baseProducts.filter((p) => {
    if (!showTabs || activeTab === 'all') return true;
    return p.coffeeSpecs?.roastLevel === activeTab;
  });

  // Apply limit if set
  if (coffeeCollectionContent?.limit && coffeeCollectionContent.limit > 0) {
    filteredProducts = filteredProducts.slice(0, coffeeCollectionContent.limit);
  }

  return (
    <div className="space-y-10 sm:space-y-14 lg:space-y-16">
      
      {/* 1. INTERACTIVE ROAST & TASTE SPECTRUM WIDGET */}
      {isRoastGuideActive && (
        <section id="roast-guide" className="relative rounded-2xl sm:rounded-3xl bg-[#140E0B] border border-white/15 p-4 sm:p-8 lg:p-10 shadow-2xl overflow-hidden backdrop-blur-xl">
          {/* Ambient Glow */}
          <div
            className="absolute -top-20 -right-20 w-80 sm:w-96 h-80 sm:h-96 rounded-full blur-3xl pointer-events-none transition-all duration-700 opacity-25"
            style={{ background: currentProfile.glowColor }}
          />

          <div className="relative z-10 space-y-6 sm:space-y-8">
          {/* Centered Header & 3-Step Roast Selector */}
          <div className="flex flex-col items-center text-center space-y-3 sm:space-y-4 max-w-3xl mx-auto pb-4 sm:pb-6 border-b border-white/10">
            <div className="inline-flex items-center gap-2 text-[10px] sm:text-xs font-mono font-bold uppercase tracking-[0.15em] sm:tracking-[0.2em] text-[#D9A76A]">
              <Coffee className="h-3.5 w-3.5 text-[#D9A76A]" />
              <span>{roastGuideContent?.badge || 'Интерактивный Кофейный Гид'}</span>
            </div>
            <h2 className="text-xl sm:text-3xl lg:text-4xl font-black text-white font-serif tracking-tight">
              {roastGuideContent?.title || 'Спектр обжарки и вкусовой профиль'}
            </h2>
            <p className="text-xs sm:text-sm text-[#C4B9AD] max-w-xl">
              {roastGuideContent?.subtitle ||
                'Выберите степень обжарки, чтобы увидеть вкусовой баланс, сенсорный радар и идеальный способ заваривания.'}
            </p>

            {/* Roast Selector Tabs */}
            <div className="grid grid-cols-3 gap-1.5 sm:gap-2 p-1.5 sm:p-2 rounded-2xl bg-black/70 border border-white/15 w-full max-w-md shadow-inner mt-1">
              {activeRoastProfiles.map((roast) => {
                const isSelected = selectedRoast === roast.id;
                return (
                  <button
                    key={roast.id}
                    type="button"
                    onClick={() => setSelectedRoast(roast.id)}
                    className={`py-2 sm:py-2.5 px-2 sm:px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap active:scale-95 ${
                      isSelected
                        ? 'bg-[#B88B58] text-[#0E0A08] shadow-lg'
                        : 'text-[#8E8276] hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span
                      className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full flex-shrink-0 ${
                        roast.id === 'light'
                          ? 'bg-amber-300'
                          : roast.id === 'medium'
                          ? 'bg-amber-600'
                          : 'bg-amber-950 border border-amber-400/60'
                      }`}
                    />
                    <span>{roast.id === 'light' ? 'Светлая' : roast.id === 'medium' ? 'Средняя' : 'Тёмная'}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Profile Details */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentProfile.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6 lg:gap-8 items-stretch"
            >
              {/* Left Column: Description & Flavor Notes */}
              <div className="md:col-span-7 lg:col-span-7 flex flex-col justify-between space-y-3.5 sm:space-y-4 p-4 sm:p-6 rounded-2xl bg-white/[0.02] border border-white/10">
                <div className="space-y-2.5 sm:space-y-3">
                  <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                    <span className="text-[10px] sm:text-xs font-bold px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-[#B88B58]/20 text-[#E5CBA8] border border-[#B88B58]/30">
                      {currentProfile.badge}
                    </span>
                    <span className="text-[10px] sm:text-xs text-[#8E8276] font-medium">100% Арабика спешелти</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white leading-snug">
                    {currentProfile.subtitle}
                  </h3>

                  <p className="text-xs sm:text-sm lg:text-base text-[#E0D8CE] leading-relaxed">
                    {currentProfile.description}
                  </p>
                </div>

                {/* Flavor Notes Badges */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#8E8276] block">
                    Доминирующие дескрипторы вкуса:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {currentProfile.flavorNotes.map((note, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-xl bg-white/5 border border-white/15 text-[11px] sm:text-xs font-semibold text-[#E0D8CE] shadow-sm"
                      >
                        {note}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Recommended Brew Methods */}
                <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-[#1A130E] border border-white/10 space-y-1 mt-2">
                  <div className="flex items-center gap-2 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#D9A76A]">
                    <SlidersHorizontal className="h-3.5 w-3.5 text-[#D9A76A] flex-shrink-0" />
                    <span>Идеально для способов заваривания:</span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#C4B9AD] leading-relaxed">
                    {currentProfile.recommendedBrew}
                  </p>
                </div>
              </div>

              {/* Right Column: Taste Radar Bars & Recommended Bean */}
              <div className="md:col-span-5 lg:col-span-5 flex flex-col justify-between space-y-4">
                
                {/* Sensory Spectrum Bars */}
                <div className="p-4 sm:p-5 rounded-2xl bg-[#1A130E] border border-white/15 shadow-xl space-y-3">
                  <div className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#D9A76A]">
                    Сенсорный баланс профиля:
                  </div>

                  <div className="space-y-2 text-xs">
                    {/* Acidity */}
                    <div className="space-y-0.5">
                      <div className="flex justify-between text-[#C4B9AD] text-[11px] sm:text-xs">
                        <span>Кислотность (Acidity)</span>
                        <span className="font-bold text-white">{currentProfile.acidity}/5</span>
                      </div>
                      <div className="h-1.5 sm:h-2 rounded-full bg-white/10 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-amber-400 to-yellow-300 rounded-full transition-all duration-500"
                          style={{ width: `${(currentProfile.acidity / 5) * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* Sweetness */}
                    <div className="space-y-0.5">
                      <div className="flex justify-between text-[#C4B9AD] text-[11px] sm:text-xs">
                        <span>Сладость (Sweetness)</span>
                        <span className="font-bold text-white">{currentProfile.sweetness}/5</span>
                      </div>
                      <div className="h-1.5 sm:h-2 rounded-full bg-white/10 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#B88B58] to-amber-400 rounded-full transition-all duration-500"
                          style={{ width: `${(currentProfile.sweetness / 5) * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* Body */}
                    <div className="space-y-0.5">
                      <div className="flex justify-between text-[#C4B9AD] text-[11px] sm:text-xs">
                        <span>Плотность тела (Body)</span>
                        <span className="font-bold text-white">{currentProfile.body}/5</span>
                      </div>
                      <div className="h-1.5 sm:h-2 rounded-full bg-white/10 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-orange-500 to-amber-600 rounded-full transition-all duration-500"
                          style={{ width: `${(currentProfile.body / 5) * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* Bitterness */}
                    <div className="space-y-0.5">
                      <div className="flex justify-between text-[#C4B9AD] text-[11px] sm:text-xs">
                        <span>Горчинка (Bitterness)</span>
                        <span className="font-bold text-white">{currentProfile.bitterness}/5</span>
                      </div>
                      <div className="h-1.5 sm:h-2 rounded-full bg-white/10 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-stone-600 to-stone-400 rounded-full transition-all duration-500"
                          style={{ width: `${(currentProfile.bitterness / 5) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recommended Product Box: Compact & Neatly Fitted */}
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-[#1F1612] to-[#140E0B] border border-white/15 space-y-2.5 shadow-xl">
                  <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#D9A76A] block">
                    Флагманский лот этого профиля:
                  </span>
                  <div className="text-sm sm:text-base font-bold text-white leading-snug">
                    {currentProfile.recommendedProduct?.title || 'Свежеобжаренный спешелти сорт'}
                  </div>
                  {currentProfile.recommendedProduct?.price && (
                    <div className="text-xs text-[#D9A76A] font-semibold">
                      от {currentProfile.recommendedProduct.price} ₽
                    </div>
                  )}
                  <div className="pt-1">
                    <Link
                      href={
                        currentProfile.recommendedProduct
                          ? `/product/${currentProfile.recommendedProduct.slug}`
                          : '/catalog'
                      }
                      className="inline-flex items-center justify-center w-full gap-2 px-4 py-2.5 rounded-xl bg-[#B88B58] text-[#0E0A08] text-xs font-bold hover:bg-[#CBA06E] transition-all cursor-pointer active:scale-95 text-center"
                    >
                      <span>Заказать этот сорт</span>
                      <ArrowRight className="h-3.5 w-3.5 flex-shrink-0" />
                    </Link>
                  </div>
                </div>

              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
      )}


      {/* 2. INTERACTIVE TERROIR MASTERCLASS (Dual-Pane Showcase) */}
      {isTerroirAtlasActive && (
      <section className="space-y-5 sm:space-y-8">
        
        {/* Header */}
        <div className="max-w-2xl space-y-1.5 sm:space-y-2">
          <span className="text-[10px] sm:text-xs font-mono font-bold uppercase tracking-widest text-[#D9A76A]">
            {terroirAtlasContent?.badge || 'География микролотов'}
          </span>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-serif font-black text-white tracking-tight">
            {terroirAtlasContent?.title || 'Мировые терруары в коллекции ТАВ'}
          </h2>
          <p className="text-xs sm:text-base text-[#C4B9AD] leading-relaxed">
            {terroirAtlasContent?.subtitle ||
              terroirAtlasContent?.description ||
              'Выберите регион происхождения, чтобы исследовать высоту произрастания, метод обработки и уникальный вкусовой букет кофейного зерна.'}
          </p>
        </div>

        {/* 2-Column Interactive Terroir Stage: md:grid-cols-12 on Tablet */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6 lg:gap-8 items-stretch">
          
          {/* Left: Active Terroir Story Stage (7 Columns on Tablet/Desktop) */}
          <div className="md:col-span-7 lg:col-span-7">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTerroir.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.25 }}
                className="relative h-full min-h-[380px] sm:min-h-[500px] rounded-2xl sm:rounded-[36px] overflow-hidden bg-[#140E0B] border border-white/15 shadow-2xl p-5 sm:p-8 lg:p-10 flex flex-col justify-between group"
              >
                {/* Background Plantation Photo with Vignette */}
                <Image
                  src={currentTerroir.imageUrl || "https://images.unsplash.com/photo-1587734195503-904fca47e0e9?q=80&w=1200&auto=format&fit=crop"}
                  alt={currentTerroir.country?.name || currentTerroir.region}
                  fill
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover object-center brightness-[0.35] group-hover:scale-105 transition-transform duration-1000 ease-out -z-0"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0E0A08] via-[#0E0A08]/60 to-transparent pointer-events-none -z-0" />

                {/* Top Origin Badges */}
                <div className="relative z-10 flex items-center justify-between gap-2">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[10px] sm:text-xs font-mono text-[#E5CBA8]">
                    {currentTerroir.country?.flagEmoji && <span>{currentTerroir.country.flagEmoji}</span>}
                    <span className="font-bold">{currentTerroir.country?.name || currentTerroir.region}</span>
                    <span className="text-white/30">•</span>
                    <span>{currentTerroir.continent || 'Африка'}</span>
                  </div>

                  <span className="px-2.5 py-1 rounded-full bg-[#D9A76A]/20 border border-[#D9A76A]/40 text-[#E5CBA8] text-[10px] sm:text-xs font-mono font-bold">
                    {currentTerroir.process || 'Мытая'}
                  </span>
                </div>

                {/* Bottom Story & Terroir DNA */}
                <div className="relative z-10 space-y-4 pt-12 sm:pt-16">
                  <div>
                    <span className="text-[10px] sm:text-xs font-mono text-[#D9A76A] uppercase tracking-wider block">
                      Регион происхождения
                    </span>
                    <h3 className="text-2xl sm:text-4xl font-serif font-bold text-white leading-tight">
                      {currentTerroir.region}
                    </h3>
                  </div>

                  <p className="text-xs sm:text-sm text-[#E5DDD3] leading-relaxed max-w-lg">
                    {currentTerroir.sommelierNotes}
                  </p>

                  {/* Flavor Descriptor Badges */}
                  <div className="flex flex-wrap gap-1.5 sm:gap-2 pt-1">
                    {(currentTerroir.flavorNotes || []).map((note: string, idx: number) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg bg-black/50 border border-white/15 text-[11px] sm:text-xs text-[#E5CBA8] font-medium backdrop-blur-sm"
                      >
                        {note}
                      </span>
                    ))}
                  </div>

                  {/* Specs Strip */}
                  <div className="grid grid-cols-2 gap-2 pt-3 border-t border-white/15 text-xs font-mono">
                    <div className="space-y-0.5">
                      <span className="text-[10px] text-[#8E8276] block">Высота произрастания:</span>
                      <span className="text-[#E0D8CE] font-bold text-xs">{currentTerroir.altitude}</span>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[10px] text-[#8E8276] block">Метод обработки:</span>
                      <span className="text-[#E0D8CE] font-bold text-xs">{currentTerroir.process}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right: Interactive Terroir Region List (5 Columns on Tablet/Desktop) */}
          <div className="md:col-span-5 lg:col-span-5 flex flex-col justify-between gap-2.5 sm:gap-3">
            {terroirData.map((terroir) => {
              const isSelected = terroir.id === currentTerroir.id;
              return (
                <button
                  key={terroir.id}
                  onClick={() => setSelectedTerroirId(terroir.id)}
                  className={`p-3.5 sm:p-4 rounded-2xl sm:rounded-3xl border text-left transition-all duration-300 flex items-center justify-between gap-3 cursor-pointer ${
                    isSelected
                      ? 'bg-[#1F1612] border-[#D9A76A] shadow-xl shadow-[#D9A76A]/10 scale-[1.01]'
                      : 'bg-[#140E0B]/80 border-white/10 hover:border-white/20 hover:bg-[#1A130E]'
                  }`}
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-base sm:text-lg">{terroir.country?.flagEmoji || '☕'}</span>
                      <span
                        className={`text-xs sm:text-sm font-bold truncate ${
                          isSelected ? 'text-[#E5CBA8]' : 'text-white'
                        }`}
                      >
                        {terroir.region}
                      </span>
                      <span className="text-[10px] font-mono text-[#8E8276] shrink-0">
                        {terroir.country?.name}
                      </span>
                    </div>

                    <div className="text-[11px] sm:text-xs text-[#C4B9AD] leading-relaxed">
                      {(terroir.flavorNotes || []).join(' • ')}
                    </div>
                  </div>

                  <div
                    className={`h-7 w-7 sm:h-8 sm:w-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                      isSelected
                        ? 'bg-[#D9A76A] text-[#0E0A08]'
                        : 'bg-white/5 text-[#8E8276]'
                    }`}
                  >
                    <ArrowRight className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                  </div>
                </button>
              );
            })}
          </div>

        </div>
      </section>
      )}


      {/* 3. BARISTA IN-STORE GRINDING STATION (📱 Swipeable on Mobile / 5-Col Continuum on Tablet & Desktop) */}
      {isGrindingStationActive && (
      <section className="space-y-6 sm:space-y-8 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-[500px] h-[300px] bg-amber-950/20 rounded-full blur-[140px] pointer-events-none -z-10" />

        {/* Top Editorial Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 sm:gap-6 pb-2">
          <div className="space-y-2 sm:space-y-2.5 max-w-xl">
            <div className="flex items-center gap-2 text-[10px] sm:text-xs font-mono font-bold uppercase tracking-widest text-[#D9A76A]">
              <Compass className="h-3.5 w-3.5 text-[#D9A76A]" />
              <span>{grindingStationContent?.badge || 'Сервис в Майкопе • ул. К.А. Васильева, 2/1'}</span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-black text-white tracking-tight leading-[1.15]">
              {grindingStationContent?.headline || 'Бесплатный помол зерна'} <br />
              <span className="italic font-normal text-[#E5CBA8]">
                {grindingStationContent?.headlineHighlight || 'под ваш способ заваривания'}
              </span>
            </h2>
            
            <p className="text-xs sm:text-sm text-[#C4B9AD] leading-relaxed">
              {grindingStationContent?.description ||
                'При покупке любого сорта мы бесплатно смолем зерно прямо в магазине под ваш любимый девайс — от пудры для джезвы до френч-пресса.'}
            </p>
          </div>

          {/* Integrated Equipment Badges */}
          <div className="grid grid-cols-2 md:flex md:flex-col gap-2.5 sm:gap-3 md:w-72 flex-shrink-0">
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#160F0B]/80 border border-white/10 shadow-lg">
              <div className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[#D9A76A] flex-shrink-0">
                <Sparkles className="h-3.5 w-3.5 text-[#D9A76A]" />
              </div>
              <div className="space-y-0.5">
                <div className="text-[11px] sm:text-xs font-bold text-white">
                  {grindingStationContent?.feature1?.title || 'Жернова Fiorenzato'}
                </div>
                <div className="text-[10px] sm:text-[11px] text-[#A89D91] leading-snug">
                  {grindingStationContent?.feature1?.desc || 'Без перегрева и пыли.'}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#160F0B]/80 border border-white/10 shadow-lg">
              <div className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[#D9A76A] flex-shrink-0">
                <Clock className="h-3.5 w-3.5 text-[#D9A76A]" />
              </div>
              <div className="space-y-0.5">
                <div className="text-[11px] sm:text-xs font-bold text-white">
                  {grindingStationContent?.feature2?.title || 'Помол за 60 секунд'}
                </div>
                <div className="text-[10px] sm:text-[11px] text-[#A89D91] leading-snug">
                  {grindingStationContent?.feature2?.desc || 'Свежий помол при вас.'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 📱 5 Grinding Methods */}
        <div className="flex gap-3 sm:gap-4 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory lg:grid lg:grid-cols-5 lg:gap-4 pb-2">
          {(Array.isArray(grindingStationContent?.methods) && grindingStationContent.methods.length > 0
            ? grindingStationContent.methods
            : DEFAULT_GRIND_METHODS
          ).map((method: any, idx: number) => (
            <div
              key={idx}
              className="group rounded-2xl sm:rounded-3xl bg-gradient-to-b from-[#18110C] to-[#120B07] border border-white/10 hover:border-[#D9A76A]/60 p-5 sm:p-6 flex flex-col justify-between transition-all duration-300 w-[72vw] xs:w-[65vw] sm:w-[260px] md:w-[280px] lg:w-auto snap-start flex-shrink-0 shadow-xl min-h-[220px]"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-[#D9A76A]">{method.number || `0${idx + 1}`}</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-white/5 text-[#E5CBA8] border border-white/10 whitespace-nowrap">
                    {method.fraction}
                  </span>
                </div>
                <div>
                  <h4 className="text-base sm:text-lg font-bold text-white font-serif group-hover:text-[#E5CBA8] transition-colors leading-snug">
                    {method.title}
                  </h4>
                  <span className="text-[11px] font-mono text-[#D9A76A] block mt-0.5">
                    {method.subtitle}
                  </span>
                </div>
                <p className="text-xs text-[#A89D91] leading-relaxed">
                  {method.desc}
                </p>
              </div>
              <div className="pt-3 mt-3 border-t border-white/10 text-xs font-mono text-[#C4B9AD] flex items-center justify-between">
                <span>Экстракция:</span>
                <span className="font-bold text-white">{method.time}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
      )}


      {/* 4. COFFEE PRODUCT SHOWCASE WITH CENTERED TABS */}
      {isCoffeeCollectionActive && (
      <section className="space-y-5 sm:space-y-8">
        <div className="flex flex-col items-center text-center space-y-3 sm:space-y-4">
          <div className="space-y-1 sm:space-y-2">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#D9A76A]">
              {coffeeCollectionContent?.badge || 'Свежая обжарка в наличии'}
            </span>
            <h2 className="text-xl sm:text-4xl font-black text-white font-serif tracking-tight">
              {coffeeCollectionContent?.title || 'Кофейная коллекция ТАВ'}
            </h2>
            {coffeeCollectionContent?.subtitle && (
              <p className="text-xs sm:text-sm text-[#C4B9AD] max-w-lg mx-auto">
                {coffeeCollectionContent.subtitle}
              </p>
            )}
          </div>

          {/* Centered Roast Category Switcher */}
          {showTabs && (
            <div className="inline-flex items-center justify-center p-1 sm:p-1.5 rounded-2xl bg-[#140E0B] border border-white/15 shadow-xl overflow-x-auto no-scrollbar max-w-full">
              <button
                type="button"
                onClick={() => setActiveTab('all')}
                className={`px-3.5 py-1.5 sm:px-5 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap active:scale-95 ${
                  activeTab === 'all'
                    ? 'bg-[#B88B58] text-[#0E0A08] shadow-md'
                    : 'text-[#C4B9AD] hover:text-white'
                }`}
              >
                {coffeeCollectionContent?.tabAllLabel || 'Все сорта'} ({baseProducts.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('light')}
                className={`px-3 py-1.5 sm:px-4 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-1 whitespace-nowrap active:scale-95 ${
                  activeTab === 'light'
                    ? 'bg-[#B88B58] text-[#0E0A08] shadow-md'
                    : 'text-[#C4B9AD] hover:text-white'
                }`}
              >
                <span>{coffeeCollectionContent?.tabLightLabel || 'Светлая'}</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('medium')}
                className={`px-3 py-1.5 sm:px-4 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-1 whitespace-nowrap active:scale-95 ${
                  activeTab === 'medium'
                    ? 'bg-[#B88B58] text-[#0E0A08] shadow-md'
                    : 'text-[#C4B9AD] hover:text-white'
                }`}
              >
                <span>{coffeeCollectionContent?.tabMediumLabel || 'Средняя'}</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('dark')}
                className={`px-3 py-1.5 sm:px-4 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-1 whitespace-nowrap active:scale-95 ${
                  activeTab === 'dark'
                    ? 'bg-[#B88B58] text-[#0E0A08] shadow-md'
                    : 'text-[#C4B9AD] hover:text-white'
                }`}
              >
                <span>{coffeeCollectionContent?.tabDarkLabel || 'Тёмная'}</span>
              </button>
            </div>
          )}
        </div>

        {/* 📱 2x2 Grid on Mobile & Tablet / 💻 4-Col Grid on Desktop (Zero orphan cards) */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
            {filteredProducts.map((coffee) => (
              <ProductCard key={coffee.id} product={coffee} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 px-4 rounded-3xl bg-white/[0.02] border border-white/5 space-y-2">
            <p className="text-sm text-[#A89D91]">Сорта с выбранными параметрами сейчас готовятся к обжарке.</p>
            {showTabs && activeTab !== 'all' && (
              <button
                type="button"
                onClick={() => setActiveTab('all')}
                className="text-xs font-bold text-[#D9A76A] hover:underline"
              >
                Показать все сорта
              </button>
            )}
          </div>
        )}

        {/* Optional CTA Link Button */}
        {coffeeCollectionContent?.showButton && (
          <div className="flex justify-center pt-2">
            <Link
              href={coffeeCollectionContent?.buttonHref || '/catalog'}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#1C1410] hover:bg-[#251A14] border border-white/15 hover:border-[#D9A76A]/50 text-white font-bold text-xs sm:text-sm transition-all shadow-xl hover:shadow-[#D9A76A]/10 active:scale-95"
            >
              <span>{coffeeCollectionContent?.buttonLabel || 'Смотреть весь каталог'}</span>
              <ArrowRight className="h-4 w-4 text-[#D9A76A]" />
            </Link>
          </div>
        )}
      </section>
      )}


      {/* 5. QUALITY & ROASTING PROMISES («Золотое окно свежести» Bento Showcase) */}
      {isSensoryCycleActive && (
      <section className="space-y-6 sm:space-y-10 relative overflow-hidden">
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[300px] bg-amber-950/20 rounded-full blur-[160px] pointer-events-none -z-10" />

        {/* Section Header */}
        <div className="max-w-2xl space-y-2 sm:space-y-3">
          <div className="flex items-center gap-2 text-[10px] sm:text-xs font-mono font-bold uppercase tracking-widest text-[#D9A76A]">
            <Sparkles className="h-3.5 w-3.5 text-[#D9A76A]" />
            <span>{sensoryCycleContent?.badge || 'Сенсорный контроль и стандарты'}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-serif font-black text-white tracking-tight leading-[1.15]">
            {sensoryCycleContent?.headline || 'Почему кофе ТАВ'} <br />
            <span className="italic font-normal text-[#E5CBA8]">
              {sensoryCycleContent?.headlineHighlight || 'раскрывается иначе'}
            </span>
          </h2>
          <p className="text-xs sm:text-base text-[#C4B9AD] leading-relaxed">
            {sensoryCycleContent?.description ||
              'Мы относимся к спешелти-кофе как к живому продукту: от строгого отбора мировых микролотов до контроля фаз созревания зерна после обжарки.'}
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch">
          
          {/* Left: Freshness Window Card (7 Columns) */}
          <div className="lg:col-span-7 rounded-2xl sm:rounded-[36px] bg-gradient-to-br from-[#1B120D] via-[#140E0A] to-[#0E0A08] border border-amber-500/25 p-4 sm:p-8 shadow-2xl flex flex-col justify-between space-y-5 sm:space-y-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-80 h-80 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-4">
              {/* Header */}
              <div className="flex flex-wrap items-center justify-between gap-2.5">
                <div className="space-y-0.5">
                  <span className="text-[10px] sm:text-xs font-mono text-[#D9A76A] uppercase tracking-wider block">
                    Сенсорный цикл зерна
                  </span>
                  <h3 className="text-lg sm:text-2xl font-serif font-bold text-white">
                    {sensoryCycleContent?.freshnessTitle || '«Золотое окно свежести»'}
                  </h3>
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-[#E5CBA8] text-[11px] sm:text-xs font-mono font-bold">
                  <Clock className="h-3.5 w-3.5 text-[#D9A76A]" />
                  <span>{sensoryCycleContent?.freshnessBadge || 'Пик: 4–21 день'}</span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-[#C4B9AD] leading-relaxed">
                {sensoryCycleContent?.freshnessDesc ||
                  'Свой истинный букет, сочную сладость и плотную пенку crema арабика проявляет именно в «золотом окне» созревания.'}
              </p>

              {/* Freshness Timeline Stages */}
              <div className="space-y-2 sm:space-y-2.5 pt-1">
                {(Array.isArray(sensoryCycleContent?.phases) && sensoryCycleContent.phases.length > 0
                  ? sensoryCycleContent.phases
                  : DEFAULT_SENSORY_PHASES
                ).map((phase: any, idx: number) => (
                  <div
                    key={idx}
                    className={
                      phase.highlight
                        ? 'p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-gradient-to-r from-amber-500/20 via-amber-500/10 to-transparent border border-amber-500/40 space-y-1 shadow-lg'
                        : 'p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-white/[0.03] border border-white/5 space-y-1'
                    }
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={
                          phase.highlight
                            ? 'font-mono text-[10px] sm:text-xs font-bold text-[#0E0A08] px-2 py-0.5 rounded-md bg-[#B88B58]'
                            : 'font-mono text-[10px] sm:text-xs font-bold text-[#8E8276] px-2 py-0.5 rounded-md bg-white/5 border border-white/10'
                        }
                      >
                        {phase.days}
                      </span>
                      <span className="font-bold text-xs sm:text-sm text-white">
                        {phase.title}
                      </span>
                    </div>
                    <p
                      className={
                        phase.highlight
                          ? 'text-[#E0D8CE] text-[11px] sm:text-xs leading-relaxed pl-0.5'
                          : 'text-[#8E8276] text-[11px] sm:text-xs leading-relaxed pl-0.5'
                      }
                    >
                      {phase.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Live Freshness Guarantee */}
            <div className="relative z-10 p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-[#0E0A08]/90 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-3 text-[11px] sm:text-xs">
              <div className="flex items-center gap-1.5 text-[#D9A76A] font-mono font-bold whitespace-nowrap">
                <Zap className="h-3.5 w-3.5 fill-[#D9A76A] flex-shrink-0" />
                <span>{sensoryCycleContent?.shelfBanner?.leftText || 'На полках в Майкопе:'}</span>
              </div>
              <div className="text-white font-medium">
                {sensoryCycleContent?.shelfBanner?.rightText || 'Всегда свежая обжарка не старше 7–14 дней'}
              </div>
            </div>
          </div>

          {/* Right: 3 Refined Craft Bento Cards (5 Columns on Desktop, 1 Column on Mobile) */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-3 sm:gap-4">
            {(Array.isArray(sensoryCycleContent?.features) && sensoryCycleContent.features.length > 0
              ? sensoryCycleContent.features
              : DEFAULT_SENSORY_FEATURES
            ).map((feat: any, idx: number) => (
              <div
                key={idx}
                className="group p-4 sm:p-7 rounded-2xl sm:rounded-[32px] bg-gradient-to-b from-[#18110C] to-[#120B07] border border-white/10 hover:border-[#D9A76A]/60 shadow-xl transition-all duration-300 flex flex-col justify-between space-y-2.5 sm:space-y-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-[#E5CBA8]">
                    {feat.tag1}
                  </span>
                  <span className="text-xs font-mono font-bold text-[#D9A76A]">{feat.tag2}</span>
                </div>
                <div className="space-y-1">
                  <h4 className="text-base sm:text-lg font-bold text-white font-serif group-hover:text-[#E5CBA8] transition-colors">
                    {feat.title}
                  </h4>
                  <p className="text-xs text-[#A89D91] leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>
      )}

    </div>
  );
}
