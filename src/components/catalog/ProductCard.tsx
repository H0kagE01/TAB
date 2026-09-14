'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Coffee, Sparkles, ShoppingBag, ArrowUpRight, CheckCircle2, Droplets } from 'lucide-react';
import { Product } from '@/types';
import { formatPrice, getRoastLevelInfo } from '@/lib/utils';
import { useCart } from '../inquiry/InquiryContext';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const { addToCart } = useCart();
  const [isJustAdded, setIsJustAdded] = useState(false);

  const handleAdd = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1, undefined, false, e.currentTarget);
    setIsJustAdded(true);
    setTimeout(() => setIsJustAdded(false), 1400);
  };

  return (
    <div className="group relative rounded-xl sm:rounded-3xl transition-all duration-300 h-full flex flex-col">
      {/* Main Card Content */}
      <div className="relative z-10 flex flex-col justify-between h-full overflow-hidden rounded-xl sm:rounded-[1.5rem] bg-[#140E0B] border border-[#2A1D17] hover:border-[#D9A76A]/60 shadow-xl transition-all duration-300">
        
        {/* Top Image Stage */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#0A0705]">
          <Link href={`/product/${product.slug}`} className="block h-full w-full">
            {product.images && product.images[0] && product.images[0].trim() ? (
              <Image
                src={product.images[0]}
                alt={product.title}
                fill
                priority={priority}
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out opacity-90 group-hover:opacity-100"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-[#17100B] text-[#D9A76A]/40">
                <Coffee className="h-6 w-6 sm:h-8 sm:w-8" />
              </div>
            )}
          </Link>

          {/* Smooth Dark Gradient Mask at bottom of image */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#140E0B] via-transparent to-black/30 pointer-events-none" />

          {/* Top Left Badges */}
          <div className="absolute top-1.5 sm:top-3 left-1.5 sm:left-3 z-10 pointer-events-none flex items-center gap-1 flex-wrap">
            {product.coffeeSpecs?.qScore ? (
              <span className="flex items-center gap-1 px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[8px] sm:text-[10px] font-bold text-[#E5CBA8] bg-black/80 border border-[#D9A76A]/40 backdrop-blur-md shadow whitespace-nowrap">
                <Sparkles className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-[#D9A76A] flex-shrink-0" />
                <span>Q {product.coffeeSpecs.qScore}</span>
              </span>
            ) : product.coffeeSpecs?.roastLevel ? (
              <span className="flex items-center gap-1 px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[8px] sm:text-[10px] font-bold text-[#E5CBA8] bg-black/80 border border-[#D9A76A]/40 backdrop-blur-md shadow whitespace-nowrap">
                <Coffee className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-[#D9A76A] flex-shrink-0" />
                <span>{product.coffeeSpecs.roastLevel === 'light' ? 'Светлая' : product.coffeeSpecs.roastLevel === 'medium' ? 'Средняя' : 'Тёмная'}</span>
              </span>
            ) : product.category === 'drip-coffee' ? (
              <span className="flex items-center gap-1 px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[8px] sm:text-[10px] font-bold text-amber-300 bg-black/80 border border-amber-400/30 backdrop-blur-md shadow whitespace-nowrap">
                <Droplets className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-amber-400 flex-shrink-0" />
                <span>Дрип</span>
              </span>
            ) : (
              <span className="flex items-center gap-1 px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[8px] sm:text-[10px] font-semibold text-[#E0D8CE] bg-black/80 border border-white/15 backdrop-blur-md shadow whitespace-nowrap">
                ТАВ
              </span>
            )}
          </div>

          {/* In-Stock Indicator (Top Right) */}
          <div className="absolute top-1.5 sm:top-3 right-1.5 sm:right-3 z-10 pointer-events-none">
            {product.inStock ? (
              <span className="flex items-center gap-1 px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[8px] sm:text-[10px] font-semibold bg-black/75 text-emerald-300 border border-emerald-500/30 backdrop-blur-md shadow whitespace-nowrap flex-shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
                <span className="hidden sm:inline">В наличии</span>
              </span>
            ) : (
              <span className="px-1.5 py-0.5 sm:py-1 rounded-full text-[8px] sm:text-[10px] font-semibold bg-black/75 text-stone-400 border border-stone-700 backdrop-blur-md whitespace-nowrap flex-shrink-0">
                Под заказ
              </span>
            )}
          </div>
        </div>

        {/* Card Body */}
        <div className="flex flex-1 flex-col justify-between p-2.5 sm:p-4 space-y-2 sm:space-y-3">
          
          {/* Main Info */}
          <div className="space-y-1 sm:space-y-1.5">
            {/* Meta Row */}
            <div className="flex items-center gap-1 text-[9px] sm:text-[10px] overflow-hidden">
              <span className="font-bold text-[#D9A76A] tracking-wider uppercase shrink-0">
                {product.categoryName || (product.category === 'single-origin' ? 'Моносорт' : product.category === 'espresso-blends' ? 'Эспрессо' : product.category === 'drip-coffee' ? 'Дрип-кофе' : product.category === 'sets' ? 'Сет' : 'Кофе')}
              </span>
              {product.countryName && (
                <>
                  <span className="text-[#8E8276] shrink-0">•</span>
                  <span className="text-[#A89D91] truncate font-medium">
                    {product.countryName}
                  </span>
                </>
              )}
            </div>

            {/* Product Title */}
            <h3 className="text-[11px] xs:text-xs sm:text-sm md:text-base font-bold text-white leading-snug group-hover:text-[#D9A76A] transition-colors line-clamp-2 min-h-[1.9rem] sm:min-h-[2.4rem]">
              <Link href={`/product/${product.slug}`}>{product.title}</Link>
            </h3>

            {/* Coffee Descriptor / Notes (Max 2 on mobile for clean fit) */}
            {product.coffeeSpecs?.flavorNotes ? (
              <div className="pt-0.5 flex flex-wrap gap-1">
                {product.coffeeSpecs.flavorNotes.slice(0, 2).map((note, i) => (
                  <span
                    key={i}
                    className="px-1.5 py-0.5 rounded bg-white/[0.04] border border-white/10 text-[#C4B9AD] text-[8px] sm:text-[10px] font-medium truncate max-w-[85px] sm:max-w-none"
                  >
                    {note}
                  </span>
                ))}
              </div>
            ) : product.shortDescription ? (
              <p className="text-[9px] sm:text-xs text-[#9E9284] line-clamp-1 pt-0.5">
                {product.shortDescription}
              </p>
            ) : null}
          </div>

          {/* Bottom Row: Price & Action */}
          <div className="pt-2 sm:pt-2.5 border-t border-white/10 flex items-center justify-between gap-1 sm:gap-2">
            <div className="text-xs xs:text-sm sm:text-base md:text-lg font-black text-white font-serif tracking-tight whitespace-nowrap flex-shrink-0">
              {formatPrice(product.price)}
            </div>

            <div className="flex items-center gap-1 sm:gap-1.5 flex-shrink-0">
              <button
                type="button"
                onClick={handleAdd}
                className={`inline-flex items-center justify-center gap-1 p-1.5 sm:px-3 sm:py-2 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold transition-all duration-200 cursor-pointer shadow-md hover:scale-105 active:scale-95 whitespace-nowrap ${
                  isJustAdded
                    ? 'bg-emerald-500 text-white shadow-emerald-500/40 ring-2 ring-emerald-400 scale-105'
                    : 'bg-[#D9A76A] text-[#0E0A08] hover:bg-[#E5CBA8]'
                }`}
                aria-label="Добавить кофе в корзину"
              >
                {isJustAdded ? (
                  <>
                    <CheckCircle2 className="h-3 w-3 sm:h-3.5 sm:w-3.5 flex-shrink-0 text-white" />
                    <span className="hidden sm:inline">В корзине ✓</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="h-3 w-3 sm:h-3.5 sm:w-3.5 flex-shrink-0" />
                    <span className="hidden sm:inline">В корзину</span>
                  </>
                )}
              </button>

              <Link
                href={`/product/${product.slug}`}
                className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-[#C4B9AD] hover:text-white transition-all cursor-pointer flex-shrink-0"
                title="Подробнее о кофе"
                aria-label="Подробнее о кофе"
              >
                <ArrowUpRight className="h-3 w-3 sm:h-3.5 sm:w-3.5 flex-shrink-0" />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

