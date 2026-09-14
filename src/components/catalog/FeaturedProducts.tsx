'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Product } from '@/types';
import { ProductCard } from './ProductCard';

interface FeaturedProductsProps {
  title: string;
  subtitle?: string;
  badge?: string;
  products: Product[];
  actionLabel?: string;
  actionHref?: string;
}

export function FeaturedProducts({
  title,
  subtitle,
  badge = 'Популярное',
  products,
  actionLabel = 'Смотреть весь каталог',
  actionHref = '/catalog',
}: FeaturedProductsProps) {
  if (!products || products.length === 0) return null;

  return (
    <section className="py-10 sm:py-14 lg:py-16 bg-[#0E0A08] border-b border-[#211813]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="space-y-1 sm:space-y-1.5 max-w-xl">
            {badge && (
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-[#B88B58]">
                {badge}
              </span>
            )}
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black font-serif text-white tracking-tight leading-tight">
              {title}
            </h2>
            {subtitle && (
              <p className="text-xs sm:text-sm md:text-base text-[#A89D91]">
                {subtitle}
              </p>
            )}
          </div>

          <Link
            href={actionHref}
            className="inline-flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-bold text-[#D9A76A] hover:text-white transition-colors group flex-shrink-0 pt-1 sm:pt-0"
          >
            <span>{actionLabel}</span>
            <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* 2-Column Mobile / 3-Column Tablet & Desktop Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-2.5 sm:gap-6">
          {products.map((product, idx) => (
            <ProductCard key={product.id} product={product} priority={idx < 4} />
          ))}
        </div>

        {/* Bottom Centered CTA */}
        <div className="mt-8 sm:mt-12 text-center">
          <Link
            href={actionHref}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl sm:rounded-2xl bg-[#1D1510] hover:bg-[#2A1E18] border border-[#3A281E] hover:border-[#B88B58]/50 px-6 sm:px-8 py-3 sm:py-3.5 text-xs sm:text-sm font-bold text-[#F7F4EF] transition-all shadow-md active:scale-95"
          >
            <span>{actionLabel}</span>
            <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#B88B58]" />
          </Link>
        </div>

      </div>
    </section>
  );
}
