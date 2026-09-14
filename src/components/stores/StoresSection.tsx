'use client';

import React from 'react';
import Image from 'next/image';
import {
  Phone,
  Clock,
  Navigation,
  ExternalLink,
  Coffee,
  Zap,
  ShieldCheck,
  Sparkles,
  Car,
} from 'lucide-react';
import { mockStores } from '@/lib/mock-data/stores';
import type { StoreLocation } from '@/types';

interface StoresSectionProps {
  store?: StoreLocation;
  badge?: string;
  headline?: string;
  headlineHighlight?: string;
  description?: string;
  photoUrl?: string;
  address?: string;
  workingHours?: string;
  phone?: string;
  formattedPhone?: string;
  phoneNote?: string;
  contactsSubheading?: string;
  busStop?: string;
  topBadgeOpen?: string;
  topBadgeParking?: string;
  pill1?: string;
  pill2?: string;
  pill3?: string;
  yandexMapsUrl?: string;
  yandexMapsBtnText?: string;
  twoGisUrl?: string;
  twoGisBtnText?: string;
}

export function StoresSection({
  store: storeProp,
  badge = 'Ждём вас в гости',
  headline = 'Пространство ТАВ',
  headlineHighlight = 'в Майкопе',
  description = 'Приходите за выбором свежеобжаренного зерна, дегустацией ароматов моносортов, подбором дрип-пакетов и профессиональным помолом.',
  photoUrl: photoUrlProp,
  address: addressProp,
  workingHours: workingHoursProp,
  phone: phoneProp,
  formattedPhone: formattedPhoneProp,
  phoneNote = '(Звонок бариста)',
  contactsSubheading = 'Адрес и контакты',
  busStop = 'Остановка «Улица 12-го Марта» (330 м) • Удобный подъезд с ул. Васильева',
  topBadgeOpen = 'Открыто для вас',
  topBadgeParking = 'Парковка 0 ₽',
  pill1 = 'Помол 0 ₽',
  pill2 = 'Бронь 15 мин',
  pill3 = 'Pet-friendly',
  yandexMapsUrl: yandexMapsUrlProp,
  yandexMapsBtnText = 'Маршрут в Яндекс Карты',
  twoGisUrl: twoGisUrlProp,
  twoGisBtnText = 'Открыть в 2ГИС',
}: StoresSectionProps = {}) {
  const store = storeProp ?? mockStores[0];
  const photoUrl = photoUrlProp || store.photoUrl;
  const address = addressProp || store.address;
  const workingHours = workingHoursProp || store.workingHours;
  const phone = phoneProp || store.phone;
  const formattedPhone = formattedPhoneProp || store.formattedPhone || phone.replace(/\D/g, '');
  const yandexMapsUrl = yandexMapsUrlProp || store.yandexMapsUrl || 'https://yandex.ru/maps/-/CTDGNHK~';
  const twoGisUrl =
    twoGisUrlProp ||
    store.twoGisUrl ||
    `https://2gis.ru/maykop/search/${encodeURIComponent(`Майкоп ${address}`)}`;

  return (
    <section className="relative py-10 sm:py-14 lg:py-16 bg-[#0E0A08] text-white border-b border-[#1E1712] overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] sm:w-[700px] h-[350px] sm:h-[500px] bg-amber-950/15 rounded-full blur-[120px] sm:blur-[160px] pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8 space-y-2 sm:space-y-3">
          <div className="inline-flex items-center gap-2 text-[11px] sm:text-xs font-mono font-bold uppercase tracking-[0.15em] sm:tracking-[0.2em] text-[#D9A76A]">
            <Sparkles className="h-3.5 w-3.5 text-[#D9A76A]" />
            <span>{badge}</span>
          </div>

          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-serif text-white tracking-tight leading-[1.15]">
            {headline} <br />
            <span className="italic font-normal text-[#E5CBA8]">{headlineHighlight}</span>
          </h2>

          <p className="text-[#A89D91] text-xs sm:text-sm md:text-base leading-relaxed">
            {description}
          </p>
        </div>

        {/* Unified Panoramic Store Card */}
        <div className="relative rounded-2xl sm:rounded-[32px] overflow-hidden bg-[#140E0A] border border-white/15 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-12 items-stretch">
            
            {/* Left 6 Cols: Facade Photo */}
            <div className="md:col-span-6 lg:col-span-6 relative min-h-[300px] sm:min-h-[380px] md:min-h-full overflow-hidden group">
              <Image
                src={photoUrl}
                alt="Пространство ТАВ в Майкопе"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover object-center group-hover:scale-105 transition-transform duration-1000 ease-out"
              />
              
              {/* Cinematic Vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#140E0A] via-[#140E0A]/30 to-black/30 md:bg-gradient-to-r md:from-transparent md:via-[#140E0A]/20 md:to-[#140E0A]" />

              {/* In-photo Top Badge */}
              <div className="absolute top-4 sm:top-5 left-4 sm:left-5 right-4 sm:right-5 flex items-center justify-between">
                <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[11px] sm:text-xs font-semibold text-white">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{topBadgeOpen}</span>
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[11px] sm:text-xs font-mono text-[#D9A76A]">
                  <Car className="h-3.5 w-3.5" />
                  <span>{topBadgeParking}</span>
                </div>
              </div>
            </div>

            {/* Right 6 Cols: Details */}
            <div className="md:col-span-6 lg:col-span-6 p-5 sm:p-7 md:p-8 flex flex-col justify-between space-y-4 sm:space-y-5 bg-[#140E0A]">
              
              {/* Store Title & Address */}
              <div className="space-y-1.5 sm:space-y-2">
                <div className="inline-flex items-center gap-2 text-[10px] sm:text-xs font-mono font-bold uppercase tracking-widest text-[#D9A76A]">
                  <Sparkles className="h-3.5 w-3.5 text-[#D9A76A]" />
                  <span>{contactsSubheading}</span>
                </div>
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-serif font-bold text-white tracking-tight">
                  {address}
                </h3>
                <p className="text-xs text-[#8E8276]">
                  {busStop}
                </p>
              </div>

              {/* Information Bento Box */}
              <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-white/[0.03] border border-white/10 space-y-3 text-xs">
                
                {/* Hours */}
                <div className="flex items-start gap-2.5">
                  <Clock className="h-4 w-4 text-[#D9A76A] flex-shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <span className="font-semibold text-white block">График работы</span>
                    <span className="text-[#A89D91] text-[11px] sm:text-xs block">{workingHours}</span>
                  </div>
                </div>

                {/* Direct Phone */}
                <div className="flex items-start gap-2.5 pt-2 border-t border-white/5">
                  <Phone className="h-4 w-4 text-[#D9A76A] flex-shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <span className="font-semibold text-white block">Телефон</span>
                    <a
                      href={`tel:${formattedPhone}`}
                      className="text-[#D9A76A] hover:underline font-bold text-xs sm:text-sm block"
                    >
                      {phone} <span className="font-normal text-[#8E8276] text-xs">{phoneNote}</span>
                    </a>
                  </div>
                </div>

                {/* Service Pills */}
                <div className="pt-2 border-t border-white/5 flex flex-wrap gap-1.5 text-[10px] sm:text-[11px]">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/10 text-[#E0D8CE]">
                    <Coffee className="h-3 w-3 text-[#D9A76A]" />
                    <span>{pill1}</span>
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/10 text-[#E0D8CE]">
                    <Zap className="h-3 w-3 text-amber-400" />
                    <span>{pill2}</span>
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/10 text-[#E0D8CE]">
                    <ShieldCheck className="h-3 w-3 text-emerald-400" />
                    <span>{pill3}</span>
                  </span>
                </div>
              </div>

              {/* Action Buttons: Fast Navigation */}
              <div className="space-y-2 pt-1 sm:pt-2 border-t border-white/10">
                <a
                  href={yandexMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-between rounded-xl sm:rounded-2xl bg-gradient-to-r from-[#C2905A] via-[#D9A76A] to-[#E5CBA8] hover:from-[#B8854F] hover:to-[#D9A76A] px-4 sm:px-5 py-3 sm:py-3.5 text-xs sm:text-sm font-bold text-[#0E0A08] shadow-xl shadow-amber-950/60 transition-all duration-300 group/btn cursor-pointer active:scale-95"
                >
                  <div className="flex items-center gap-2">
                    <Navigation className="h-4 w-4 text-[#0E0A08]" />
                    <span>{yandexMapsBtnText}</span>
                  </div>
                  <div className="h-6 w-6 sm:h-7 sm:w-7 rounded-lg sm:rounded-xl bg-black/15 flex items-center justify-center group-hover/btn:translate-x-1 transition-transform">
                    <ExternalLink className="h-3.5 w-3.5 text-[#0E0A08]" />
                  </div>
                </a>

                <a
                  href={twoGisUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl sm:rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 px-4 py-2.5 sm:py-3 text-xs font-semibold text-[#C4B9AD] hover:text-white transition-colors active:scale-95"
                >
                  <span>{twoGisBtnText}</span>
                  <ExternalLink className="h-3 w-3 text-[#A89D91]" />
                </a>
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
