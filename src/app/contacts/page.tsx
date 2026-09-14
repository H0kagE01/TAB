import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import {
  MapPin,
  Phone,
  Navigation,
  ExternalLink,
  Send,
  ShieldCheck,
  Zap,
  Coffee,
  Car,
  ArrowRight,
  Award,
} from 'lucide-react';
import { getMainStore } from '@/lib/db/stores';
import { getSiteSettings } from '@/lib/db/settings';
import { ContactsClient } from '@/components/contacts/ContactsClient';
import { getResolvedContactsPage, getPageWithBlocks } from '@/lib/db/pages';

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageWithBlocks('contacts');
  return {
    title: page?.seoTitle || 'Контакты и пространство в Майкопе | ТАВ',
    description:
      page?.seoDescription ||
      'Адрес, телефон и режим работы флагманского пространства ТАВ в Майкопе: ул. К.А. Васильева, 2/1. Маршрут в Яндекс Картах и 2ГИС, связь с бариста в Telegram и WhatsApp.',
    keywords: page?.seoKeywords || undefined,
  };
}

export default async function ContactsPage() {
  const [contactsPageData, mainStore, siteSettings] = await Promise.all([
    getResolvedContactsPage(),
    getMainStore(),
    getSiteSettings(),
  ]);

  const {
    page,
    heroContent,
    isHeroActive,
    showroomContent,
    isShowroomActive,
    showroomZones,
    mapContent,
    isMapActive,
    conciergeHubContent,
    isConciergeHubActive,
    conciergeContent,
    isConciergeActive,
    inquiryTopics,
    guestFaqContent,
    isGuestFaqActive,
    wholesaleContent,
    isWholesaleActive,
  } = contactsPageData;

  const displayPhone = siteSettings.mainPhone || mainStore.phone;
  const displayFormattedPhone = displayPhone.replace(/[^+\d]/g, '');
  const displayTelegramUrl = siteSettings.telegramUrl || 'https://t.me/tav_coffee';
  const displayWhatsappUrl = siteSettings.whatsappUrl || 'https://wa.me/79881637141';

  const defaultHighlights = [
    'Парковка перед входом',
    'Помол зерна 0 ₽',
    'Самовывоз 15 мин',
    'Pet-friendly',
  ];
  const highlights =
    Array.isArray(heroContent.highlights) && heroContent.highlights.length === 4
      ? heroContent.highlights
      : defaultHighlights;

  return (
    <div className="min-h-screen bg-[#0E0A08] text-white pb-12 sm:pb-20 w-full max-w-full overflow-x-hidden">
      
      {/* 1. HERO SECTION */}
      {isHeroActive && (
        <section className="relative overflow-hidden pt-20 pb-12 sm:pt-36 sm:pb-24 border-b border-white/10 bg-[#0E0A08]">
          
          {/* Backdrop */}
          <div className="absolute inset-0 pointer-events-none -z-0">
            <Image
              src={heroContent.imageUrl || "/images/store-maykop-interior.jpg"}
              alt="Интерьер ТАВ в Майкопе"
              fill
              priority
              className="object-cover object-center opacity-30 scale-105 filter blur-[1.5px]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0E0A08] via-[#0E0A08]/85 to-[#0E0A08]/90" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(217,167,106,0.18)_0%,rgba(14,10,8,0.95)_75%)]" />
          </div>

          {/* Ambient Glows */}
          <div className="absolute top-1/4 right-1/4 w-[350px] sm:w-[600px] h-[350px] sm:h-[500px] bg-[#D9A76A]/15 rounded-full blur-[140px] pointer-events-none" />

          <div className="relative z-10 mx-auto max-w-7xl px-3.5 sm:px-6 lg:px-8 w-full">
            <div className="max-w-4xl space-y-5 sm:space-y-8">
              
              {/* Top Location Overline */}
              <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/[0.05] border border-white/10 backdrop-blur-md text-[10px] sm:text-xs font-mono font-bold uppercase tracking-[0.15em] sm:tracking-[0.2em] text-[#E5CBA8] flex-wrap">
                <MapPin className="h-3.5 w-3.5 text-[#D9A76A] flex-shrink-0" />
                <span>{heroContent.badge || `г. ${mainStore.city || 'Майкоп'}, ${mainStore.address}`}</span>
                <span className="text-white/30 hidden xs:inline">•</span>
                <span className="text-[#D9A76A]">ПРОСТРАНСТВО ТАВ</span>
              </div>

              {/* Headline */}
              <div className="space-y-2 sm:space-y-3">
                <h1 className="text-3xl xs:text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight text-white leading-[1.08]">
                  {heroContent.headline ? (
                    <>
                      <span>{heroContent.headline} </span>
                      {heroContent.headlineHighlight && (
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D9A76A] via-amber-300 to-[#B88B58]">
                          {heroContent.headlineHighlight}
                        </span>
                      )}
                    </>
                  ) : (
                    <>
                      Контакты и <br />
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D9A76A] via-amber-300 to-[#B88B58]">
                        пространство ТАВ
                      </span>
                    </>
                  )}
                </h1>
                {(heroContent.cursiveSubtitle || !heroContent.headline) && (
                  <div className="font-cursive text-lg xs:text-xl sm:text-3xl lg:text-4xl text-[#D9A76A] tracking-wide pt-0.5">
                    {heroContent.cursiveSubtitle || 'Приходите за свежеобжаренным спешелти кофе и дегустацией'}
                  </div>
                )}
              </div>

              {/* Description */}
              <p className="text-[#C4B9AD] text-xs sm:text-base lg:text-lg leading-relaxed max-w-2xl font-normal">
                {heroContent.description ||
                  'Кофейное пространство в Майкопе: здесь можно вдохнуть ароматы свежих моносортов, подобрать дрип-пакеты в поездку, приобрести аксессуары Hario и бесплатно смолоть зерно под любой метод.'}
              </p>

              {/* Quick Hero Actions */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3.5 pt-1 sm:pt-2">
                <a
                  href={`https://yandex.ru/maps/?pt=${mainStore.coordinates.lng},${mainStore.coordinates.lat}&z=17&l=map`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-[#C2905A] via-[#D9A76A] to-[#E5CBA8] hover:from-[#B8854F] hover:to-[#D9A76A] px-6 sm:px-7 py-3.5 sm:py-4 text-xs sm:text-sm font-bold text-[#0E0A08] shadow-[0_0_25px_rgba(217,167,106,0.35)] active:scale-95 transition-all cursor-pointer group text-center"
                >
                  <Navigation className="h-4 w-4 text-[#0E0A08] flex-shrink-0" />
                  <span>Маршрут в Яндекс Карты</span>
                  <ExternalLink className="h-3.5 w-3.5 text-[#0E0A08] group-hover:translate-x-0.5 transition-transform flex-shrink-0" />
                </a>

                <a
                  href={displayTelegramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 px-5 sm:px-6 py-3.5 sm:py-4 text-xs sm:text-sm font-bold text-white hover:text-[#D9A76A] active:scale-95 transition-all cursor-pointer text-center"
                >
                  <Send className="h-4 w-4 text-sky-400 flex-shrink-0" />
                  <span>Написать в Telegram</span>
                </a>

                <a
                  href={`tel:${displayFormattedPhone}`}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 px-4 sm:px-5 py-3 sm:py-4 text-xs sm:text-sm font-semibold text-[#C4B9AD] hover:text-white active:scale-95 transition-all cursor-pointer text-center"
                >
                  <Phone className="h-4 w-4 text-[#D9A76A] flex-shrink-0" />
                  <span>{displayPhone}</span>
                </a>
              </div>

              {/* Service Highlights */}
              <div className="pt-2 flex flex-wrap gap-2 text-[11px] sm:text-xs text-[#E0D8CE]">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 backdrop-blur-md">
                  <Car className="h-3.5 w-3.5 text-[#D9A76A] flex-shrink-0" />
                  <span>{highlights[0]}</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 backdrop-blur-md">
                  <Coffee className="h-3.5 w-3.5 text-[#D9A76A] flex-shrink-0" />
                  <span>{highlights[1]}</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 backdrop-blur-md">
                  <Zap className="h-3.5 w-3.5 text-amber-400 flex-shrink-0" />
                  <span>{highlights[2]}</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 backdrop-blur-md">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0" />
                  <span>{highlights[3]}</span>
                </span>
              </div>

            </div>
          </div>

        </section>
      )}

      {/* 2. MAIN BOUTIQUE, MAP, CONCIERGE, TERMINAL & FAQ */}
      <section className="py-10 sm:py-14 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ContactsClient
            storeAddress={mainStore.address}
            storePhone={displayPhone}
            storeFormattedPhone={displayFormattedPhone}
            workingHours={mainStore.workingHours}
            telegramUrl={displayTelegramUrl}
            whatsappUrl={displayWhatsappUrl}
            showroomContent={showroomContent}
            showroomZones={showroomZones}
            isShowroomActive={isShowroomActive}
            mapContent={mapContent}
            isMapActive={isMapActive}
            conciergeHubContent={conciergeHubContent}
            isConciergeHubActive={isConciergeHubActive}
            conciergeContent={conciergeContent}
            inquiryTopics={inquiryTopics}
            isConciergeActive={isConciergeActive}
            guestFaqContent={guestFaqContent}
            isGuestFaqActive={isGuestFaqActive}
          />
        </div>
      </section>

      {/* 3. WHOLESALE & B2B CALLOUT BANNER */}
      {isWholesaleActive && (
        <section id="wholesale" className="py-10 sm:py-14 lg:py-16 border-t border-white/10 bg-gradient-to-b from-[#0E0A08] to-[#140E0A]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="relative rounded-2xl sm:rounded-[32px] overflow-hidden bg-gradient-to-br from-[#241710] via-[#17100C] to-[#1F140E] border border-[#D9A76A]/30 p-5 sm:p-14 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8">
              
              <div className="absolute top-0 right-0 w-80 h-80 bg-[#D9A76A]/20 rounded-full blur-[100px] pointer-events-none" />

              <div className="relative z-10 space-y-2 sm:space-y-3 text-center md:text-left max-w-2xl">
                <div className="inline-flex items-center gap-2 text-[10px] sm:text-xs font-mono font-bold uppercase tracking-[0.15em] sm:tracking-[0.2em] text-[#D9A76A]">
                  <Award className="h-3.5 w-3.5 text-[#D9A76A]" />
                  <span>{wholesaleContent.badge || 'Оптовые поставки & HoReCa'}</span>
                </div>
                <h3 className="text-xl sm:text-4xl font-black text-white font-serif tracking-tight leading-snug">
                  {wholesaleContent.title || 'Кофе ТАВ для вашей кофейни, ресторана или офиса'}
                </h3>
                <p className="text-xs sm:text-sm text-[#C4B9AD] leading-relaxed">
                  {wholesaleContent.description ||
                    'Поставляем спешелти зерно свежей обжарки, настраиваем эспрессо-профили и обучаем персонал. Свяжитесь с нами для получения оптового каталога и образцов.'}
                </p>
              </div>

              <a
                href={wholesaleContent.buttonHref || displayTelegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="relative z-10 inline-flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-[#C2905A] via-[#D9A76A] to-[#E5CBA8] hover:from-[#B8854F] hover:to-[#D9A76A] px-6 sm:px-8 py-3.5 sm:py-4 text-xs sm:text-sm font-bold text-[#0E0A08] shadow-[0_0_30px_rgba(217,167,106,0.4)] active:scale-95 transition-all cursor-pointer flex-shrink-0 group w-full sm:w-auto text-center"
              >
                <span>{wholesaleContent.buttonLabel || 'Запросить B2B прайс'}</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>
        </section>
      )}

    </div>
  );
}
