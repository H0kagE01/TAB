'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, PanInfo } from 'framer-motion';
import { 
  Coffee, 
  Sparkles, 
  Layers, 
  ArrowRight, 
  Star, 
  ShieldCheck, 
  Clock, 
  ShoppingBag,
  Droplets,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useCart } from '../inquiry/InquiryContext';
import { Product } from '@/types';

// ─── Accent palette (cycles by product index) ────────────────────────────────
const ACCENT_PALETTE = [
  { accentColor: '#D9A76A', glowColor: 'rgba(217, 167, 106, 0.3)' },
  { accentColor: '#C2905A', glowColor: 'rgba(194, 144, 90, 0.3)' },
  { accentColor: '#E5CBA8', glowColor: 'rgba(229, 203, 168, 0.3)' },
  { accentColor: '#B88B58', glowColor: 'rgba(184, 139, 88, 0.35)' },
  { accentColor: '#A07840', glowColor: 'rgba(160, 120, 64, 0.3)' },
];

// ─── Icon by category slug ────────────────────────────────────────────────────
function getCategoryIcon(category: string): React.ElementType {
  if (category.includes('drip')) return Droplets;
  if (category.includes('espresso')) return Layers;
  if (category.includes('single')) return Coffee;
  return Sparkles;
}

// ─── Split title into two visual lines ───────────────────────────────────────
function splitTitle(title: string): { prefix: string; highlight: string } {
  const words = title.trim().split(' ');
  if (words.length <= 2) return { prefix: title, highlight: '' };
  const mid = Math.ceil(words.length / 2);
  return {
    prefix: words.slice(0, mid).join(' '),
    highlight: words.slice(mid).join(' '),
  };
}

// ─── Build badge text from product data ──────────────────────────────────────
function buildBadge(product: Product): string {
  const specs = product.coffeeSpecs;
  if (specs?.variety) return `🌿 ${specs.variety}`;
  if (specs?.processing) return `☕ ${specs.processing}`;
  if (specs?.flavorNotes?.length) return `✨ ${specs.flavorNotes[0]}`;
  return product.categoryName || '☕ Спешелти кофе';
}

// ─── Build description with smart fallback from coffeeSpecs ──────────────────
function buildDescription(product: Product): string {
  if (product.shortDescription) return product.shortDescription;
  if (product.description?.trim()) return product.description.slice(0, 240);
  // Auto-generate from specs when description is missing
  const specs = product.coffeeSpecs;
  if (specs) {
    const parts: string[] = [];
    if (specs.roastLevel) {
      const labels = { light: 'Светлая обжарка', medium: 'Средняя обжарка', dark: 'Тёмная обжарка' };
      parts.push(labels[specs.roastLevel]);
    }
    if (specs.processing) parts.push(`обработка: ${specs.processing}`);
    if (specs.flavorNotes?.length) {
      parts.push(`ноты ${specs.flavorNotes.join(', ')}`);
    }
    if (specs.altitude) parts.push(`высота ${specs.altitude}`);
    if (parts.length) return parts.join(', ') + '.';
  }
  return `${product.categoryName || 'Спешелти кофе'} ТАВ свежей обжарки.`;
}

// ─── Build top-right badge on image ──────────────────────────────────────────
function buildTopBadge(product: Product): { icon: string; title: string } {
  const specs = product.coffeeSpecs;
  if (specs?.altitude && specs?.qScore) return { icon: '⛰️', title: `${specs.altitude} • Q ${specs.qScore}` };
  if (specs?.altitude) return { icon: '⛰️', title: specs.altitude };
  if (specs?.qScore) return { icon: '🏆', title: `Q-Score ${specs.qScore}` };
  if (specs?.roastLevel) {
    const labels = { light: 'Светлая обжарка', medium: 'Средняя обжарка', dark: 'Тёмная обжарка' };
    return { icon: '🔥', title: labels[specs.roastLevel] };
  }
  return { icon: '☕', title: 'Спешелти кофе' };
}

// ─── Build tab label ──────────────────────────────────────────────────────────
function buildTabTitle(product: Product): string {
  const specs = product.coffeeSpecs;
  if (specs?.roastLevel) {
    const labels = { light: 'Светлая • Фильтр', medium: 'Средняя • Универс.', dark: 'Тёмная • Эспрессо' };
    return labels[specs.roastLevel];
  }
  return product.categoryName || product.brandName || 'ТАВ Кофе';
}

// ─── Slide model built from a Product ────────────────────────────────────────
interface HeroSlide {
  id: string;
  product: Product;
  tabTitle: string;
  icon: React.ElementType;
  accentColor: string;
  glowColor: string;
  badge: string;
  titlePrefix: string;
  titleHighlight: string;
  description: string;
  catalogHref: string;
  catalogBtnLabel: string;
  topBadge: { icon: string; title: string };
  rating: string;
  reviewsCount: string;
}

function buildSlides(products: Product[]): HeroSlide[] {
  return products.map((product, idx) => {
    const { prefix, highlight } = splitTitle(product.title);
    const palette = ACCENT_PALETTE[idx % ACCENT_PALETTE.length];
    const catStr = typeof product.category === 'string' ? product.category : String(product.category);
    return {
      id: product.id,
      product,
      tabTitle: buildTabTitle(product),
      icon: getCategoryIcon(catStr),
      accentColor: palette.accentColor,
      glowColor: palette.glowColor,
      badge: buildBadge(product),
      titlePrefix: prefix,
      titleHighlight: highlight,
      description: buildDescription(product),
      catalogHref: `/catalog/${catStr}`,
      catalogBtnLabel: product.categoryName || 'Каталог',
      topBadge: buildTopBadge(product),
      rating: '5.0',
      reviewsCount: 'Оценка ТАВ',
    };
  });
}

// ─── Component ────────────────────────────────────────────────────────────────
interface HeroSectionProps {
  featuredProducts: Product[];
}

export function HeroSection({ featuredProducts }: HeroSectionProps) {
  const slides = buildSlides(featuredProducts);
  const [activeMoodIndex, setActiveMoodIndex] = useState<number>(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(true);
  const { addToCart } = useCart();

  // Guard: if no featured products — show nothing
  if (slides.length === 0) {
    return (
      <section className="relative bg-[#0A0705] text-white min-h-[calc(100svh-60px)] flex items-center justify-center border-b border-[#1C140F]">
        <div className="text-center space-y-3 text-[#8E8276]">
          <Coffee className="h-12 w-12 mx-auto opacity-40" />
          <p className="text-sm font-mono">Отметьте товары как «Избранные» в панели администратора,<br />чтобы они показывались здесь</p>
        </div>
      </section>
    );
  }

  const activeSlide = slides[activeMoodIndex] ?? slides[0];
  const activeProduct = activeSlide.product;

  // Auto rotation every 8 seconds if user isn't interacting
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (!isAutoPlaying || slides.length <= 1) return;
    const timer = setInterval(() => {
      setActiveMoodIndex((prev) => (prev + 1) % slides.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [isAutoPlaying, slides.length]);

  const handleManualTabChange = (index: number) => {
    setActiveMoodIndex(index);
    setIsAutoPlaying(false);
  };

  const handleNextSlide = () => {
    setIsAutoPlaying(false);
    setActiveMoodIndex((prev) => (prev + 1) % slides.length);
  };

  const handlePrevSlide = () => {
    setIsAutoPlaying(false);
    setActiveMoodIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleSwipeEnd = (_e: any, info: PanInfo) => {
    if (info.offset.x < -35 || info.velocity.x < -300) {
      handleNextSlide();
    } else if (info.offset.x > 35 || info.velocity.x > 300) {
      handlePrevSlide();
    }
  };

  const handleQuickAdd = (product: Product, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    addToCart(product, 1, undefined, true);
  };

  // 2.5D Parallax mouse tracking for desktop
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const cardRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const mouseX = useMotionValue(0);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 200 };
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [6, -6]), springConfig);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-6, 6]), springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || typeof window === 'undefined' || window.innerWidth < 768) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <section className="relative bg-[#0A0705] text-white min-h-screen lg:min-h-[100dvh] pt-20 sm:pt-24 lg:pt-28 pb-8 sm:pb-10 lg:pb-12 flex flex-col justify-center overflow-hidden border-b border-[#1C140F]">
      
      {/* Ambient background glow */}
      <div 
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[700px] h-[300px] sm:h-[450px] rounded-full blur-[100px] sm:blur-[140px] pointer-events-none transition-colors duration-1000 opacity-25"
        style={{ backgroundColor: activeSlide.accentColor }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-transparent via-[#0A0705]/60 to-[#0A0705] pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full flex-1 flex flex-col justify-center my-auto">
        
        {/* =========================================================================
            1. DESKTOP & TABLET VIEW (2-Column Grid with Fixed-Height Stable Slots)
           ========================================================================= */}
        <div className="hidden md:grid md:grid-cols-12 gap-6 lg:gap-12 items-center flex-1">
          {/* Left Column: Headline, Editorial Info, Actions, and Mood Switcher */}
          <div className="md:col-span-6 lg:col-span-7 flex flex-col justify-between space-y-3 lg:space-y-4">
            
            {/* Badge Slot (Fixed Height: 32px) */}
            <div className="h-8 flex items-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSlide.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.18 }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/[0.05] border border-white/10 text-xs font-semibold text-[#D9A76A]"
                >
                  <span>{activeSlide.badge}</span>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Headline Slot (Locked Fixed Height: 95px on tablet, 115px on desktop) */}
            <div className="h-[5.8rem] sm:h-[6.2rem] lg:h-[7rem] flex flex-col justify-center overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.h1
                  key={activeSlide.id}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.18 }}
                  className="text-2xl sm:text-3xl md:text-3xl lg:text-4xl xl:text-5xl font-serif text-white tracking-tight leading-[1.14]"
                >
                  {activeSlide.titlePrefix} <br />
                  <span className="italic font-normal bg-gradient-to-r from-[#F7F4EF] via-[#E5CBA8] to-[#D9A76A] bg-clip-text text-transparent">
                    {activeSlide.titleHighlight}
                  </span>
                </motion.h1>
              </AnimatePresence>
            </div>

            {/* Description Slot (Locked Fixed Height: 72px on tablet and desktop) */}
            <div className="h-[4.5rem] sm:h-[4.8rem] flex items-start overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.p
                  key={activeSlide.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.18 }}
                  className="text-xs sm:text-sm lg:text-base text-[#B5AAA0] leading-relaxed max-w-xl font-normal line-clamp-3"
                >
                  {activeSlide.description}
                </motion.p>
              </AnimatePresence>
            </div>

            {/* Action Buttons Slot (Locked Height: 48px, Compact & Elegant) */}
            <div className="h-[48px] flex items-center gap-2.5 sm:gap-3">
              {activeProduct && (
                <button
                  type="button"
                  onClick={() => handleQuickAdd(activeProduct)}
                  className="px-4 sm:px-5 lg:px-6 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl bg-[#D9A76A] hover:bg-[#E5CBA8] text-[#0E0A08] text-xs sm:text-sm font-bold shadow-lg shadow-[#D9A76A]/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 whitespace-nowrap h-full"
                >
                  <ShoppingBag className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                  <span>В корзину • {activeProduct.price} ₽</span>
                </button>
              )}

              <Link
                href={activeSlide.catalogHref}
                className="px-4 sm:px-5 lg:px-6 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/15 text-white text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-1.5 sm:gap-2 group whitespace-nowrap h-full"
              >
                <span>{activeSlide.catalogBtnLabel}</span>
                <ArrowRight className="h-3.5 w-3.5 text-[#D9A76A] group-hover:translate-x-1 transition-transform flex-shrink-0" />
              </Link>
            </div>

            {/* 🎯 TABLET & DESKTOP MOOD SWITCHER BUTTONS (Stable locked height) */}
            <div className="pt-3 border-t border-white/10">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#8E8276] font-bold block mb-2">
                Коллекция сортов ТАВ:
              </span>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                {slides.map((slide, idx) => {
                  const Icon = slide.icon;
                  const isActive = activeMoodIndex === idx;
                  return (
                    <button
                      key={slide.id}
                      type="button"
                      onClick={() => handleManualTabChange(idx)}
                      className={`h-[42px] flex items-center gap-2 px-3 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer text-left ${
                        isActive
                          ? 'bg-[#D9A76A] text-[#0E0A08] font-bold shadow-md shadow-[#D9A76A]/25 ring-1 ring-[#D9A76A]'
                          : 'bg-white/[0.04] text-[#C4B9AD] border border-white/10 hover:text-white hover:bg-white/[0.08]'
                      }`}
                    >
                      <Icon className={`h-3.5 w-3.5 flex-shrink-0 ${isActive ? 'text-[#0E0A08]' : 'text-[#D9A76A]'}`} />
                      <span className="truncate">{slide.tabTitle}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quality Value Props (Locked Height: 32px) */}
            <div className="h-8 grid grid-cols-3 gap-3 items-center text-xs text-[#9E9284]">
              <div className="flex items-center gap-1.5 truncate">
                <ShieldCheck className="h-3.5 w-3.5 text-[#D9A76A] flex-shrink-0" />
                <span className="leading-tight truncate">100% Спешелти</span>
              </div>
              <div className="flex items-center gap-1.5 truncate">
                <Clock className="h-3.5 w-3.5 text-[#D9A76A] flex-shrink-0" />
                <span className="leading-tight truncate">До 14 дней</span>
              </div>
              <div className="flex items-center gap-1.5 truncate">
                <Coffee className="h-3.5 w-3.5 text-[#D9A76A] flex-shrink-0" />
                <span className="leading-tight truncate">Помол 0 ₽</span>
              </div>
            </div>
          </div>

          {/* Right Column: 2.5D Parallax Product Card with Locked Total Dimensions */}
          <div
            className="md:col-span-6 lg:col-span-5 flex justify-center w-full perspective-[1200px]"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            ref={cardRef}
          >
            <div className="w-full max-w-[420px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSlide.id}
                  style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.18 }}
                  className="relative w-full h-[470px] sm:h-[490px] lg:h-[510px] rounded-3xl bg-[#140E0A] border border-white/15 p-4 sm:p-5 shadow-2xl transition-all group flex flex-col justify-between overflow-hidden select-none"
                >
                  <div
                    className="absolute -top-12 -right-12 w-44 h-44 rounded-full blur-2xl opacity-25 pointer-events-none"
                    style={{ backgroundColor: activeSlide.accentColor }}
                  />

                  {/* Image Stage (Fixed Aspect Ratio) */}
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-[#1E1510] border border-white/10 shadow-inner flex-shrink-0">
                    {activeProduct.images[0] ? (
                      <Image
                        src={activeProduct.images[0]}
                        alt={activeProduct.title}
                        fill
                        priority
                        sizes="420px"
                        className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out pointer-events-none"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-stone-600">
                        <Coffee className="h-10 w-10" />
                      </div>
                    )}

                    <div className="absolute top-2.5 left-2.5 bg-[#0E0A08]/85 backdrop-blur-md px-2.5 py-1 rounded-full border border-[#D9A76A]/40 flex items-center gap-1 shadow-lg">
                      <span className="text-[10px] font-mono tracking-wider text-[#D9A76A] font-bold uppercase">
                        ТАВ
                      </span>
                    </div>

                    {activeProduct.countryName && (
                      <div className="absolute bottom-2.5 right-2.5 bg-black/75 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/15 text-[10px] font-semibold text-white">
                        {activeProduct.countryName}
                      </div>
                    )}

                    <div className="absolute top-2.5 right-2.5 bg-[#140E0A]/90 backdrop-blur-md px-2.5 py-1 rounded-full border border-[#D9A76A]/30 text-[10px] font-medium text-[#E5CBA8] shadow">
                      <span>{activeSlide.topBadge.icon} {activeSlide.topBadge.title}</span>
                    </div>
                  </div>

                  {/* Card Info (Fixed Heights) */}
                  <div className="flex-1 flex flex-col justify-between pt-2">
                    <div className="h-5 flex items-center justify-between gap-1 text-[11px]">
                      <div className="flex items-center gap-1 text-amber-400 font-bold">
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        <span>{activeSlide.rating}</span>
                        <span className="text-[#8E8276] font-normal">({activeSlide.reviewsCount})</span>
                      </div>
                      {activeProduct.coffeeSpecs?.roastLevel && (
                        <span className="font-mono text-[#D9A76A] uppercase font-semibold text-[10px] sm:text-[11px]">
                          ОБЖАРКА: {activeProduct.coffeeSpecs.roastLevel === 'light' ? 'СВЕТЛАЯ' : activeProduct.coffeeSpecs.roastLevel === 'medium' ? 'СРЕДНЯЯ' : 'ТЁМНАЯ'}
                        </span>
                      )}
                    </div>

                    {/* Title (Locked 2-line max height) */}
                    <div className="h-10 sm:h-12 flex items-center overflow-hidden">
                      <h3 className="text-base sm:text-lg font-serif font-bold text-white group-hover:text-[#E5CBA8] transition-colors line-clamp-2">
                        {activeProduct.title}
                      </h3>
                    </div>

                    {/* Flavor Notes (Locked Height: 24px) */}
                    <div className="h-6 flex items-center gap-1 overflow-hidden">
                      {activeProduct.coffeeSpecs?.flavorNotes?.length ? (
                        activeProduct.coffeeSpecs.flavorNotes.slice(0, 3).map((note, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/10 text-[10px] font-medium text-[#D1C7BC] whitespace-nowrap"
                          >
                            {note}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-[#8E8276]">{activeProduct.shortDescription || 'Спешелти кофе ТАВ'}</span>
                      )}
                    </div>

                    {/* Price & Action Row (Locked Height: 48px) */}
                    <div className="pt-2 border-t border-white/10 flex items-center justify-between h-12">
                      <div>
                        <span className="text-[8px] uppercase font-mono tracking-wider text-[#8E8276] block leading-none mb-0.5">
                          ЦЕНА
                        </span>
                        <span className="text-lg sm:text-xl font-black text-white font-serif">
                          {activeProduct.price} ₽
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={(e) => handleQuickAdd(activeProduct, e)}
                          className="px-3.5 py-1.5 sm:py-2 rounded-xl bg-[#D9A76A] hover:bg-[#E5CBA8] text-[#0E0A08] text-xs font-bold transition-all flex items-center gap-1 active:scale-95 cursor-pointer whitespace-nowrap shadow-md"
                        >
                          <ShoppingBag className="h-3.5 w-3.5" />
                          <span>В корзину</span>
                        </button>

                        <Link
                          href={`/product/${activeProduct.slug}`}
                          className="text-xs font-semibold text-[#D9A76A] hover:text-white flex items-center gap-0.5 transition-all px-2.5 py-1.5 sm:py-2 rounded-xl bg-white/[0.04] border border-white/10 whitespace-nowrap"
                        >
                          <span>Подробнее</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>

                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* =========================================================================
            2. MOBILE HERO STAGE (Spacious, Clear from Header, 2x2 Switcher Grid)
           ========================================================================= */}
        <div className="md:hidden flex-1 flex flex-col justify-between py-1 space-y-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSlide.id}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.15}
              onDragEnd={handleSwipeEnd}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.22 }}
              className="flex-1 flex flex-col justify-between space-y-2.5 touch-pan-y"
            >
              {/* Top Meta & Micro-Badge (Clearly visible below header) */}
              <div className="flex items-center justify-between gap-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.06] border border-white/10 text-[10px] font-semibold text-[#D9A76A]">
                  <span>{activeSlide.badge}</span>
                </div>
                <div className="flex items-center gap-1 text-[11px] font-bold text-amber-400 bg-black/60 px-2.5 py-0.5 rounded-full border border-white/10">
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                  <span>{activeSlide.rating}</span>
                </div>
              </div>

              {/* Title & Flavor Subtitle */}
              <div className="space-y-0.5">
                <h1 className="text-2xl font-serif text-white tracking-tight leading-tight">
                  {activeSlide.titlePrefix}{' '}
                  <span className="italic font-normal bg-gradient-to-r from-[#F7F4EF] via-[#E5CBA8] to-[#D9A76A] bg-clip-text text-transparent">
                    {activeSlide.titleHighlight}
                  </span>
                </h1>
                
                {/* Flavor Notes Pills */}
                {activeProduct.coffeeSpecs?.flavorNotes && (
                  <div className="flex items-center gap-1.5 pt-1 overflow-x-auto no-scrollbar">
                    {activeProduct.coffeeSpecs.flavorNotes.map((note, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md bg-white/[0.05] border border-white/10 text-[10px] text-[#E0D8CE] font-medium whitespace-nowrap"
                      >
                        {note}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Center Visual Card */}
              <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden bg-[#160E0A] border border-white/15 shadow-2xl group my-auto">
                {activeProduct.images[0] ? (
                  <Image
                    src={activeProduct.images[0]}
                    alt={activeProduct.title}
                    fill
                    priority
                    sizes="(max-width: 640px) 100vw, 400px"
                    className="object-cover pointer-events-none"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-stone-600">
                    <Coffee className="h-12 w-12" />
                  </div>
                )}

                {/* Dark luxury vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0705]/90 via-transparent to-black/30 pointer-events-none" />

                {/* Top Corner Stamps */}
                <div className="absolute top-2.5 left-2.5 bg-[#0E0A08]/85 backdrop-blur-md px-2.5 py-1 rounded-full border border-[#D9A76A]/40 flex items-center gap-1 shadow-lg">
                  <span className="text-[10px] font-mono tracking-wider text-[#D9A76A] font-bold uppercase">
                    ТАВ
                  </span>
                </div>

                <div className="absolute top-2.5 right-2.5 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/15 text-[10px] font-medium text-[#E5CBA8] shadow">
                  <span>{activeSlide.topBadge.icon} {activeSlide.topBadge.title}</span>
                </div>

                {/* Bottom Overlay Info on Image */}
                <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between">
                  {activeProduct.countryName && (
                    <span className="text-xs font-semibold text-[#E0D8CE] bg-black/75 px-2.5 py-1 rounded-lg border border-white/10 backdrop-blur-sm">
                      {activeProduct.countryName}
                    </span>
                  )}
                  {activeProduct.coffeeSpecs?.roastLevel && (
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#D9A76A] bg-black/75 px-2 py-1 rounded-lg border border-[#D9A76A]/30 backdrop-blur-sm font-bold">
                      {activeProduct.coffeeSpecs.roastLevel === 'light' ? 'Светлая обжарка' : activeProduct.coffeeSpecs.roastLevel === 'medium' ? 'Средняя обжарка' : 'Тёмная обжарка'}
                    </span>
                  )}
                </div>
              </div>

              {/* Action Bar (One clear primary button + details link) */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={(e) => handleQuickAdd(activeProduct, e)}
                  className="flex-1 py-3 px-4 rounded-xl bg-[#D9A76A] hover:bg-[#E5CBA8] active:scale-95 text-[#0E0A08] text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#D9A76A]/25 cursor-pointer whitespace-nowrap"
                >
                  <ShoppingBag className="h-4 w-4 flex-shrink-0" />
                  <span>В корзину • {activeProduct.price} ₽</span>
                </button>

                <Link
                  href={`/product/${activeProduct.slug}`}
                  className="py-3 px-3.5 rounded-xl bg-white/[0.07] hover:bg-white/[0.12] border border-white/15 text-white text-xs font-semibold flex items-center justify-center gap-1 active:scale-95 transition-all whitespace-nowrap"
                >
                  <span>О сорте</span>
                  <ArrowRight className="h-3.5 w-3.5 text-[#D9A76A]" />
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* 🎯 MOBILE 2x2 SLIDE SWITCHER GRID (Neat, convenient, finger-accessible) */}
          <div className="pt-2">
            <div className="grid grid-cols-2 gap-1.5 p-1.5 rounded-2xl bg-[#140E0B]/95 border border-white/15 backdrop-blur-xl shadow-xl">
              {slides.map((slide, idx) => {
                const isActive = activeMoodIndex === idx;
                return (
                  <button
                    key={slide.id}
                    type="button"
                    onClick={() => handleManualTabChange(idx)}
                    className={`flex items-center gap-2 px-2.5 py-2 rounded-xl text-[11px] font-semibold transition-all cursor-pointer text-left ${
                      isActive
                        ? 'bg-[#D9A76A] text-[#0E0A08] font-bold shadow-md shadow-[#D9A76A]/25'
                        : 'bg-white/[0.03] text-[#A89D91] border border-white/5 hover:text-white hover:bg-white/[0.06]'
                    }`}
                  >
                    <span
                      className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-black flex-shrink-0 ${
                        isActive ? 'bg-[#0E0A08] text-[#D9A76A]' : 'bg-white/10 text-[#C4B9AD]'
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <span className="truncate">{slide.tabTitle}</span>
                  </button>
                );
              })}
            </div>

            {/* Trust Strip */}
            <div className="grid grid-cols-3 gap-1 pt-2.5 text-[10px] text-[#9E9284]">
              <div className="flex items-center gap-1 justify-center text-center">
                <ShieldCheck className="h-3 w-3 text-[#D9A76A] flex-shrink-0" />
                <span className="leading-tight">100% Specialty</span>
              </div>
              <div className="flex items-center gap-1 justify-center text-center">
                <Clock className="h-3 w-3 text-[#D9A76A] flex-shrink-0" />
                <span className="leading-tight">До 14 дней</span>
              </div>
              <div className="flex items-center gap-1 justify-center text-center">
                <Coffee className="h-3 w-3 text-[#D9A76A] flex-shrink-0" />
                <span className="leading-tight">Помол 0 ₽</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
