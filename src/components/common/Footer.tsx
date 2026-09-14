'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Phone, Clock, ArrowUpRight, Coffee, Award, Navigation } from 'lucide-react';
import type { StoreLocation } from '@/types';
import { mockStores } from '@/lib/mock-data/stores';
import type { SiteSettingsData } from '@/lib/db/settings';

interface FooterProps {
  primaryStore?: StoreLocation;
  siteSettings?: SiteSettingsData;
}

export function Footer({ primaryStore, siteSettings }: FooterProps = {}) {
  const store = primaryStore ?? mockStores[0];
  const siteName = siteSettings?.siteName || 'ТАВ';
  const logoUrl = siteSettings?.logoUrl || '/images/logo.jpg';
  const footerText =
    siteSettings?.footerText ||
    'Спешелти кофе свежей обжарки. Отборные микролоты с высокогорных плантаций Эфиопии, Колумбии, Кении и Гватемалы, дрип-пакеты в среде азота и бесплатный помол в Майкопе.';

  return (
    <footer className="w-full bg-[#080504] text-[#C4B9AD] pt-12 sm:pt-16 pb-20 sm:pb-16 border-t border-[#1C140F]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Responsive Grid:
            - Mobile (<768px): 1-col vertical flow with 2-col link list
            - iPad / Tablet (768px - 1024px): 2x2 spacious Bento Grid (No crammed text or awkward line breaks)
            - Desktop (>=1024px): 4-col wide layout (4 + 2 + 2 + 4 cols)
        */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 md:gap-x-10 md:gap-y-10 lg:gap-8 pb-10 sm:pb-12 border-b border-[#1C140F]">
          
          {/* 1. Brand Story */}
          <div className="md:col-span-1 lg:col-span-4 space-y-4">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <div className="relative w-9 h-9 rounded-full overflow-hidden border border-[#D9A76A]/40 shadow-md group-hover:border-[#D9A76A] transition-all flex-shrink-0">
                <Image
                  src={logoUrl}
                  alt={`${siteName} Logo`}
                  fill
                  sizes="36px"
                  className="object-cover"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-black tracking-[0.2em] text-white uppercase font-sans group-hover:text-[#D9A76A] transition-colors">
                  ТАВ
                </span>
                <span className="h-1.5 w-1.5 rounded-full bg-[#D9A76A]" />
              </div>
            </Link>

            <p className="text-xs sm:text-sm text-[#8E8276] leading-relaxed max-w-sm">
              {footerText}
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#18110D] text-[#D9A76A] text-[11px] font-semibold border border-[#3A281E]">
                <Award className="h-3 w-3 text-[#D9A76A] flex-shrink-0" />
                <span>100% Specialty Arabica</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#18110D] text-[#C4B9AD] text-[11px] font-medium border border-[#3A281E]">
                <Coffee className="h-3 w-3 text-[#D9A76A] flex-shrink-0" />
                <span>Помол 0 ₽</span>
              </span>
            </div>
          </div>

          {/* 2. Store Location Card on Tablet (Desktop puts this in Col 4) */}
          <div className="md:col-span-1 lg:col-span-4 lg:order-last space-y-3">
            <h4 className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-[#D9A76A] font-mono">
              Локация в Майкопе
            </h4>
            
            <div className="p-4 rounded-2xl bg-[#140E0B] border border-[#2B1E17] space-y-3 shadow-md">
              <div className="font-semibold text-white font-serif text-sm">
                {store?.name || 'Пространство ТАВ в Майкопе'}
              </div>

              <div className="text-xs text-[#8E8276] flex items-start gap-2">
                <MapPin className="h-3.5 w-3.5 flex-shrink-0 text-[#D9A76A] mt-0.5" />
                <span className="leading-snug">{store?.address || 'ул. К.А. Васильева, 2/1'}</span>
              </div>

              <div className="text-xs text-[#8E8276] flex items-center gap-2">
                <Clock className="h-3.5 w-3.5 flex-shrink-0 text-[#8E8276]" />
                <span>{store?.workingHours || 'Пн–Пт: 08:30 – 20:30, Сб–Вс: 10:00 – 18:00'}</span>
              </div>

              <div className="pt-1 flex items-center gap-2">
                <a
                  href={`tel:${store?.formattedPhone || '+79881637141'}`}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#D9A76A] hover:bg-[#E5CBA8] text-[#0E0A08] text-xs font-bold transition-all shadow active:scale-95 text-center whitespace-nowrap"
                >
                  <Phone className="h-3 w-3 fill-current" />
                  <span>Позвонить</span>
                </a>

                <a
                  href={`https://yandex.ru/maps/?pt=${store?.coordinates?.lng || 40.046895},${store?.coordinates?.lat || 44.609943}&z=17&l=map`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[#D9A76A] transition-all cursor-pointer flex-shrink-0"
                  title="Открыть в Яндекс.Картах"
                  aria-label="Маршрут на карте"
                >
                  <Navigation className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </div>

          {/* 3. Каталог кофе */}
          <div className="md:col-span-1 lg:col-span-2 space-y-3">
            <h4 className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-white font-mono">
              Каталог кофе
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <Link
                  href="/catalog"
                  className="text-[#8E8276] hover:text-white transition-colors block py-0.5 whitespace-nowrap"
                >
                  Все позиции
                </Link>
              </li>
              <li>
                <Link
                  href="/catalog/single-origin"
                  className="text-[#8E8276] hover:text-white transition-colors block py-0.5 whitespace-nowrap"
                >
                  Моносорта
                </Link>
              </li>
              <li>
                <Link
                  href="/catalog/espresso-blends"
                  className="text-[#8E8276] hover:text-white transition-colors block py-0.5 whitespace-nowrap"
                >
                  Эспрессо-бленды
                </Link>
              </li>
              <li>
                <Link
                  href="/catalog/drip-coffee"
                  className="text-[#8E8276] hover:text-white transition-colors block py-0.5 whitespace-nowrap"
                >
                  Дрип-пакеты
                </Link>
              </li>
              <li>
                <Link
                  href="/catalog/sets"
                  className="text-[#8E8276] hover:text-white transition-colors block py-0.5 whitespace-nowrap"
                >
                  Сеты & Наборы
                </Link>
              </li>
              <li>
                <Link
                  href="/catalog/accessories"
                  className="text-[#8E8276] hover:text-white transition-colors block py-0.5 whitespace-nowrap"
                >
                  Аксессуары & V60
                </Link>
              </li>
            </ul>
          </div>

          {/* 4. О бренде */}
          <div className="md:col-span-1 lg:col-span-2 space-y-3">
            <h4 className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-white font-mono">
              О бренде
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <Link
                  href="/coffee"
                  className="text-[#8E8276] hover:text-white transition-colors inline-flex items-center gap-1 py-0.5 whitespace-nowrap"
                >
                  <span>Гид по обжарке</span>
                  <ArrowUpRight className="h-3 w-3 opacity-60 text-[#D9A76A]" />
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-[#8E8276] hover:text-white transition-colors block py-0.5 whitespace-nowrap"
                >
                  Философия ТАВ
                </Link>
              </li>
              <li>
                <Link
                  href="/contacts"
                  className="text-[#8E8276] hover:text-white transition-colors block py-0.5 whitespace-nowrap"
                >
                  Контакты
                </Link>
              </li>
              <li>
                <Link
                  href="/contacts#wholesale"
                  className="text-[#8E8276] hover:text-white transition-colors inline-flex items-center gap-1 py-0.5 whitespace-nowrap"
                >
                  <span>Опт & HoReCa</span>
                  <ArrowUpRight className="h-3 w-3 opacity-60 text-[#D9A76A]" />
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-[#8E8276] hover:text-white transition-colors block py-0.5 whitespace-nowrap"
                >
                  Конфиденциальность
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-6 sm:pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#786D62]">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 sm:gap-4 text-center">
            <span>© {new Date().getFullYear()} ТАВ Coffee. Все права защищены.</span>
            <span className="hidden sm:inline text-stone-700">•</span>
            <Link href="/privacy" className="text-[#8E8276] hover:text-[#D9A76A] underline-offset-2 hover:underline transition-colors whitespace-nowrap">
              Политика конфиденциальности
            </Link>
          </div>
          <div className="text-center md:text-right text-[10px] sm:text-[11px] text-[#6E6459]">
            Спешелти кофе свежей обжарки • Майкоп
          </div>
        </div>
      </div>
    </footer>
  );
}
