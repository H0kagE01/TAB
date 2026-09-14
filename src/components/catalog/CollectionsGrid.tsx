'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { Collection } from '@/types';

interface CollectionsGridProps {
  collections: Collection[];
  badge?: string;
  title?: string;
  description?: string;
}

export function CollectionsGrid({
  collections,
  badge = 'Тематические сеты',
  title = 'Интересные подборки',
  description = 'Специально подобранные комбинации для легкого старта, кулинарных открытий и подарков.',
}: CollectionsGridProps) {
  if (!collections || collections.length === 0) return null;

  return (
    <section className="py-10 sm:py-14 lg:py-16 bg-[#120D0A] border-b border-[#211813]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8">
          <span className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-[#B88B58] block mb-1.5 sm:mb-2">
            {badge}
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black font-serif text-white tracking-tight leading-tight">
            {title}
          </h2>
          <p className="text-[#A89D91] text-xs sm:text-sm md:text-base mt-1.5 sm:mt-2">
            {description}
          </p>
        </div>

        {/* 4 Thematic Cards: 2-Col Mobile / 2-Col Tablet / 4-Col Desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-6">
          {collections.map((col) => (
            <Link
              key={col.id}
              href={`/catalog?collection=${col.slug}`}
              className="group relative overflow-hidden rounded-xl sm:rounded-3xl bg-[#1A130F] border border-[#35251C] hover:border-[#B88B58]/60 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
            >
              {/* Image & Overlay */}
              <div className="relative aspect-[16/10] sm:aspect-[4/3] w-full overflow-hidden bg-black/40">
                <Image
                  src={col.coverImage}
                  alt={col.title}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-85 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A130F] via-transparent to-transparent" />
                {col.badgeText && (
                  <span className="absolute top-2 left-2 sm:top-3 sm:left-3 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[8px] sm:text-[10px] font-bold uppercase tracking-wider bg-[#0E0A08]/90 text-[#D9A76A] backdrop-blur-md shadow border border-[#B88B58]/30">
                    {col.badgeText}
                  </span>
                )}
              </div>

              {/* Text info */}
              <div className="p-2.5 sm:p-5 flex-1 flex flex-col justify-between space-y-2 sm:space-y-3">
                <div className="space-y-1 sm:space-y-1.5">
                  <h3 className="text-xs sm:text-lg font-bold text-white group-hover:text-[#D9A76A] transition-colors line-clamp-1 sm:line-clamp-none">
                    {col.title}
                  </h3>
                  <p className="text-[10px] sm:text-xs text-[#A89D91] line-clamp-2 sm:line-clamp-3 leading-relaxed">
                    {col.description}
                  </p>
                </div>

                <div className="pt-2 sm:pt-3 flex items-center justify-between text-[10px] sm:text-xs font-bold text-[#E0D8CE] border-t border-[#2A1D16]">
                  <span>Смотреть</span>
                  <ArrowRight className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-[#B88B58] group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
