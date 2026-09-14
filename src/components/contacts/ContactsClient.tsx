'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  MapPin,
  Clock,
  Phone,
  Send,
  Navigation,
  ExternalLink,
  MessageCircle,
  Mail,
  Copy,
  Check,
  Coffee,
  Package,
  Sparkles,
  ShieldCheck,
  Zap,
  ArrowRight,
  Car,
  Bus,
  Footprints,
  Heart,
  Gift,
  HelpCircle,
  Store,
} from 'lucide-react';
import { cn } from '@/lib/utils';

import { getStoreLiveStatus, StoreStatus } from '@/lib/utils/working-hours';
import { ShowroomZoneItem, TopicItem } from '@/lib/types/page-blocks';

interface ContactsClientProps {
  storeAddress: string;
  storePhone: string;
  storeFormattedPhone: string;
  workingHours?: string;
  telegramUrl?: string;
  whatsappUrl?: string;
  secondaryPhone?: string;
  secondaryFormattedPhone?: string;
  showroomContent?: Record<string, any>;
  showroomZones?: ShowroomZoneItem[];
  isShowroomActive?: boolean;
  mapContent?: Record<string, any>;
  isMapActive?: boolean;
  conciergeHubContent?: Record<string, any>;
  isConciergeHubActive?: boolean;
  conciergeContent?: Record<string, any>;
  inquiryTopics?: TopicItem[];
  isConciergeActive?: boolean;
  guestFaqContent?: Record<string, any>;
  isGuestFaqActive?: boolean;
}

export const TOPIC_ICON_MAP: Record<string, { icon: any; color: string }> = {
  coffee: { icon: Coffee, color: 'text-amber-400' },
  drip: { icon: Package, color: 'text-amber-300' },
  b2b: { icon: Sparkles, color: 'text-emerald-400' },
  other: { icon: HelpCircle, color: 'text-[#D9A76A]' },
  gift: { icon: Gift, color: 'text-pink-400' },
  phone: { icon: Phone, color: 'text-sky-400' },
};

const DEFAULT_SHOWROOM_ZONES: ShowroomZoneItem[] = [
  {
    id: 'facade',
    label: '🏛️ Фасад & Вход',
    title: 'Главный вход и парковка',
    desc: 'Удобный подъезд с улицы Васильева, бесплатная автостоянка прямо перед входом.',
    image: '/images/store-maykop.jpg',
    order: 1,
    isActive: true,
  },
  {
    id: 'interior',
    label: '☕ Зона спешелти кофе',
    title: 'Кофейная витрина и дегустация',
    desc: 'Коллекция свежеобжаренных зерен ТАВ, образцы ароматов и зона бесплатного жернового помола.',
    image: '/images/store-maykop-interior.jpg',
    order: 2,
    isActive: true,
  },
  {
    id: 'drip',
    label: '📦 Дрип-бар & Аксессуары',
    title: 'Дрип-пакеты и аксессуары Hario & Timemore',
    desc: 'Порционный кофе в индивидуальных саше с азотом, керамические воронки V60, ручные кофемолки и фильтры.',
    image: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?q=80&w=1200&auto=format&fit=crop',
    order: 3,
    isActive: true,
  },
];

const DEFAULT_INQUIRY_TOPICS: TopicItem[] = [
  {
    id: 'coffee',
    label: '☕ Смолоть кофе',
    title: 'Подготовить и смолоть кофе к приезду',
    placeholder: 'Например: Смолоть 250г Эфиопии Иргачефф под фильтр V60 к 18:30...',
    iconKey: 'coffee',
    order: 1,
    isActive: true,
  },
  {
    id: 'drip',
    label: '📦 Дрип-боксы',
    title: 'Забронировать набор дрип-кофе',
    placeholder: 'Например: Отложить 2 коробки ТАВ Drip Box Mix 10 шт...',
    iconKey: 'drip',
    order: 2,
    isActive: true,
  },
  {
    id: 'b2b',
    label: '💼 Опт & HoReCa',
    title: 'Оптовые поставки спешелти кофе и B2B',
    placeholder: 'Например: Интересует оптовый прайс ТАВ и условия поставки зерна в кофейню / офис...',
    iconKey: 'b2b',
    order: 3,
    isActive: true,
  },
  {
    id: 'other',
    label: '❓ Вопрос бариста',
    title: 'Задать персональный вопрос по зерну и завариванию',
    placeholder: 'Напишите ваш вопрос по обжарке, помолу или способам заваривания...',
    iconKey: 'other',
    order: 4,
    isActive: true,
  },
];

const DEFAULT_TRANSPORT_TIPS = [
  {
    icon: 'car',
    title: 'На автомобиле',
    desc: 'Удобный заезд с ул. Васильева. Бесплатная автостоянка прямо перед крыльцом.',
  },
  {
    icon: 'bus',
    title: 'Общественным транспортом',
    desc: 'Остановка «Улица 12-го Марта» (маршрутки и автобусы) — 4 минуты пешком (330 м).',
  },
  {
    icon: 'walk',
    title: 'Пешком',
    desc: 'Уютный район, яркая вывеска с подсветкой и вход с уровня тротуара.',
  },
];

const DEFAULT_PRIVILEGES = [
  {
    title: 'Помол 0 ₽',
    desc: 'Жернова Fiorenzato: под турку, эспрессо, фильтр.',
  },
  {
    title: 'Бронь 15 мин',
    desc: 'Соберем у кассы без очередей и предоплаты.',
  },
  {
    title: 'Боксы сладостей',
    desc: 'Подарочная упаковка моти, снеков и кофе.',
  },
  {
    title: 'Pet-friendly',
    desc: 'Всегда рады гостям с четвероногими друзьями.',
  },
];

const DEFAULT_FAQ_ITEMS = [
  {
    title: 'Дегустация ароматов кофе',
    desc: 'В зале открыты образцы зерен всех сортов свежей обжарки. Консультант расскажет о дескрипторах (шоколад, ягоды, тропики) и подберет сорт под ваш способ заваривания.',
  },
  {
    title: 'Свежесть обжарки и дата на пачке',
    desc: 'Мы обжариваем зерно еженедельно. На каждой пачке указана точная дата ростинга. Односторонний дегазационный клапан позволяет зерну дышать и сохранять весь букет эфирных масел.',
  },
  {
    title: 'Бесплатный профессиональный помол',
    desc: 'Перемалываем зерновой кофе прямо при вас на жерновой кофемолке совершенно бесплатно. Доступны любые степени помола: от джезвы и эспрессо до воронки V60 и френч-пресса.',
  },
  {
    title: 'Парковка и визиты с питомцами',
    desc: 'Перед входом в магазин оборудована бесплатная парковка для автомобилей. Кроме того, мы полностью pet-friendly пространство — всегда рады гостям с собаками.',
  },
];

export function ContactsClient({
  storeAddress,
  storePhone,
  storeFormattedPhone,
  workingHours = 'Ежедневно: 08:00 – 21:00',
  telegramUrl = 'https://t.me/tav_coffee',
  whatsappUrl = 'https://wa.me/79881637141',
  secondaryPhone = '+7 (999) 660-48-08',
  secondaryFormattedPhone = '+79996604808',
  showroomContent,
  showroomZones = [],
  isShowroomActive = true,
  mapContent,
  isMapActive = true,
  conciergeHubContent,
  isConciergeHubActive = true,
  conciergeContent,
  inquiryTopics = [],
  isConciergeActive = true,
  guestFaqContent,
  isGuestFaqActive = true,
}: ContactsClientProps) {
  const activeZones = showroomZones.length > 0 ? showroomZones : DEFAULT_SHOWROOM_ZONES;
  const activeTopics = inquiryTopics.length > 0 ? inquiryTopics : DEFAULT_INQUIRY_TOPICS;

  // 1. Live Store Status from DB workingHours
  const [storeStatus, setStoreStatus] = useState<{
    isOpen: boolean;
    statusText: string;
    subText: string;
  }>(() => {
    const live = getStoreLiveStatus(workingHours);
    return {
      isOpen: live.isOpen,
      statusText: live.statusText,
      subText: `Ждем вас на ул. Васильева, 2/1 (${live.todayHoursText})`,
    };
  });

  // 2. Interactive Gallery Tabs
  const [activeTab, setActiveTab] = useState<string>(activeZones[0]?.id || 'facade');

  // 3. Copy Address State
  const [isCopied, setIsCopied] = useState(false);

  // 4. Quick Pre-Order Terminal State
  const [selectedTopicId, setSelectedTopicId] = useState<string>(activeTopics[0]?.id || 'coffee');
  const [userName, setUserName] = useState('');
  const [userContact, setUserContact] = useState('');
  const [userComment, setUserComment] = useState('');
  const [agreePolicy, setAgreePolicy] = useState(false);
  const [showPolicyError, setShowPolicyError] = useState(false);

  useEffect(() => {
    const updateStatus = () => {
      const live = getStoreLiveStatus(workingHours);
      setStoreStatus({
        isOpen: live.isOpen,
        statusText: live.statusText,
        subText: `Ждем вас на ул. Васильева, 2/1 (${live.todayHoursText})`,
      });
    };

    updateStatus();
    const interval = setInterval(updateStatus, 60000);
    return () => clearInterval(interval);
  }, [workingHours]);

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(`г. Майкоп, ${storeAddress}`);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  const currentShowroom = activeZones.find((t) => t.id === activeTab) || activeZones[0] || DEFAULT_SHOWROOM_ZONES[0];
  const currentTopic = activeTopics.find((t) => t.id === selectedTopicId) || activeTopics[0] || DEFAULT_INQUIRY_TOPICS[0];

  const generateMessageText = () => {
    const topicTitle = currentTopic?.title || 'Запрос в пространство ТАВ';
    const namePart = userName ? `Здравствуйте! Меня зовут ${userName}.` : 'Здравствуйте!';
    const contactPart = userContact ? `Мой контакт: ${userContact}.` : '';
    const placeholderHint = currentTopic?.placeholder?.replace('Например: ', '') || '';
    const bodyPart = userComment || placeholderHint;
    return `${namePart}\nТема: ${topicTitle}\n${bodyPart}\n${contactPart}`.trim();
  };

  const getTelegramUrl = () => {
    const text = encodeURIComponent(generateMessageText());
    const base = telegramUrl.includes('?') ? telegramUrl.split('?')[0] : telegramUrl;
    return `${base}?text=${text}`;
  };

  const getWhatsappUrl = () => {
    const text = encodeURIComponent(generateMessageText());
    const base = whatsappUrl.includes('?') ? whatsappUrl.split('?')[0] : whatsappUrl;
    return `${base}?text=${text}`;
  };

  const transportTips =
    Array.isArray(mapContent?.transportTips) && mapContent.transportTips.length > 0
      ? mapContent.transportTips
      : DEFAULT_TRANSPORT_TIPS;

  const hubPrivileges =
    Array.isArray(conciergeHubContent?.privileges) && conciergeHubContent.privileges.length > 0
      ? conciergeHubContent.privileges
      : DEFAULT_PRIVILEGES;

  const faqItems =
    Array.isArray(guestFaqContent?.items) && guestFaqContent.items.length > 0
      ? guestFaqContent.items
      : DEFAULT_FAQ_ITEMS;

  return (
    <div className="space-y-10 sm:space-y-14 lg:space-y-16">
      
      {/* ────────────────────────────────────────────────────────────
          1. INTERACTIVE BOUTIQUE EXPLORER (Bento Canvas)
      ──────────────────────────────────────────────────────────── */}
      {isShowroomActive && (
        <section className="relative rounded-2xl sm:rounded-[32px] overflow-hidden bg-[#140E0A] border border-white/15 shadow-2xl">
          
          {/* Glow behind */}
          <div className="absolute top-0 right-1/3 w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] bg-amber-600/10 rounded-full blur-[140px] pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 items-stretch">
            
            {/* Left 7 Cols: Interactive Photo Showroom with Tab Switcher */}
            <div className="md:col-span-7 relative min-h-[280px] xs:min-h-[320px] sm:min-h-[460px] lg:min-h-full flex flex-col justify-between p-3.5 sm:p-8 overflow-hidden group">
              
              {/* Background Image with Transition */}
              <Image
                key={currentShowroom.id}
                src={currentShowroom.image}
                alt={currentShowroom.title}
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover object-center transition-all duration-700 ease-out group-hover:scale-105"
              />

              {/* Cinematic Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#140E0A] via-[#140E0A]/40 to-black/30 lg:bg-gradient-to-r lg:from-transparent lg:via-[#140E0A]/20 lg:to-[#140E0A]" />

              {/* Top Bar: Interactive Tab Chips */}
              <div className="relative z-10 flex flex-wrap gap-1.5 sm:gap-2">
                {activeZones.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      'px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-semibold backdrop-blur-md border transition-all cursor-pointer active:scale-95',
                      activeTab === tab.id
                        ? 'bg-[#B88B58] text-[#0E0A08] border-[#B88B58] shadow-[0_0_15px_rgba(184,139,88,0.5)] font-bold'
                        : 'bg-black/60 text-white/80 hover:text-white border-white/15 hover:bg-black/80'
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Bottom In-photo Caption */}
              <div className="relative z-10 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-black/70 backdrop-blur-md border border-white/10 text-white max-w-lg mt-auto space-y-0.5">
                <div className="text-[10px] sm:text-xs font-mono font-bold text-[#D9A76A] uppercase tracking-wider">
                  {currentShowroom.title}
                </div>
                <div className="text-[11px] sm:text-xs text-[#C4B9AD] leading-relaxed">
                  {currentShowroom.desc}
                </div>
              </div>

            </div>

            {/* Right 5 Cols: Smart Navigator & Visiting Details */}
            <div className="md:col-span-5 p-4 sm:p-9 flex flex-col justify-between space-y-4 sm:space-y-6 bg-[#140E0A]">
              
              <div className="space-y-4 sm:space-y-5">
                
                {/* Header & Live Status */}
                <div className="space-y-1.5 sm:space-y-2">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="text-[10px] sm:text-xs font-mono font-bold uppercase tracking-widest text-[#D9A76A]">
                      {showroomContent?.badge || 'Локация в Майкопе'}
                    </span>
                    
                    {/* Live Status Pill */}
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-white/[0.05] border border-white/10 text-[10px] sm:text-[11px] font-semibold text-white">
                      <span
                        className={cn(
                          'w-1.5 h-1.5 rounded-full flex-shrink-0',
                          storeStatus.isOpen ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                        )}
                      />
                      <span>{storeStatus.statusText}</span>
                    </div>
                  </div>

                  <h2 className="text-xl sm:text-3xl font-serif font-bold text-white tracking-tight">
                    {storeAddress}
                  </h2>
                  <p className="text-[11px] sm:text-xs text-[#8E8276]">
                    Остановка «Улица 12-го Марта» (330 м) • Удобный заезд с парковкой
                  </p>
                </div>

                {/* Working Hours & Telephones Box */}
                <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-white/[0.03] border border-white/10 space-y-2.5 text-xs">
                  <div className="flex items-start gap-2.5">
                    <Clock className="h-4 w-4 text-[#D9A76A] flex-shrink-0 mt-0.5" />
                    <div className="space-y-0.5">
                      <span className="font-semibold text-white block">График работы</span>
                      <span className="text-[#A89D91] text-[11px] sm:text-xs block">Пн–Пт: 08:30 – 20:30</span>
                      <span className="text-[#A89D91] text-[11px] sm:text-xs block">Сб–Вс: 10:00 – 18:00</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 pt-2 border-t border-white/5">
                    <Phone className="h-4 w-4 text-[#D9A76A] flex-shrink-0 mt-0.5" />
                    <div className="space-y-0.5">
                      <span className="font-semibold text-white block">Прямая связь</span>
                      <a
                        href={`tel:${storeFormattedPhone}`}
                        className="text-[#D9A76A] hover:underline font-bold text-xs sm:text-sm block"
                      >
                        {storePhone} <span className="font-normal text-[#8E8276] text-xs">(Магазин)</span>
                      </a>
                      <a
                        href={`tel:${secondaryFormattedPhone}`}
                        className="text-[#C4B9AD] hover:underline text-[11px] sm:text-xs block"
                      >
                        {secondaryPhone} <span className="text-[#8E8276]">(Справка)</span>
                      </a>
                    </div>
                  </div>
                </div>

                {/* Copy Address Button */}
                <button
                  type="button"
                  onClick={handleCopyAddress}
                  className={cn(
                    'w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 sm:py-3 rounded-xl text-xs font-bold transition-all cursor-pointer active:scale-95',
                    isCopied
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                      : 'bg-white/[0.05] hover:bg-white/[0.1] text-[#E5CBA8] border border-white/10 hover:border-[#D9A76A]/40'
                  )}
                >
                  {isCopied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                      <span>Адрес скопирован в буфер!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Скопировать точный адрес</span>
                    </>
                  )}
                </button>

              </div>

              {/* Route Action Buttons */}
              <div className="space-y-2 pt-3 sm:pt-4 border-t border-white/10">
                <a
                  href="https://yandex.ru/maps/-/CTDGNHK~"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-between rounded-xl bg-gradient-to-r from-[#C2905A] via-[#D9A76A] to-[#E5CBA8] hover:from-[#B8854F] hover:to-[#D9A76A] px-4 sm:px-5 py-3 sm:py-3.5 text-xs font-bold text-[#0E0A08] shadow-lg shadow-amber-950/50 transition-all cursor-pointer group active:scale-95"
                >
                  <div className="flex items-center gap-2">
                    <Navigation className="h-3.5 w-3.5 text-[#0E0A08]" />
                    <span>Маршрут в Яндекс Карты</span>
                  </div>
                  <ExternalLink className="h-3.5 w-3.5 text-[#0E0A08] group-hover:translate-x-0.5 transition-transform" />
                </a>

                <a
                  href={`https://2gis.ru/maykop/search/${encodeURIComponent(`Майкоп ${storeAddress}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 px-4 py-2.5 text-xs font-semibold text-[#C4B9AD] hover:text-white transition-colors active:scale-95"
                >
                  <span>Открыть локацию в 2ГИС</span>
                  <ExternalLink className="h-3 w-3 text-[#A89D91]" />
                </a>
              </div>

            </div>

          </div>

        </section>
      )}

      {/* ────────────────────────────────────────────────────────────
          2. INTERACTIVE YANDEX MAP (Майкоп, ул. Васильева, 2/1)
      ──────────────────────────────────────────────────────────── */}
      {isMapActive && (
        <section className="space-y-4 sm:space-y-6">
          
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 sm:gap-6">
            <div className="space-y-1.5 sm:space-y-2">
              <div className="inline-flex items-center gap-2 text-[10px] sm:text-xs font-mono font-bold uppercase tracking-[0.15em] sm:tracking-[0.2em] text-[#D9A76A]">
                <MapPin className="h-3.5 w-3.5 text-[#D9A76A]" />
                <span>{mapContent?.badge || 'ИНТЕРАКТИВНАЯ КАРТА • МАЙКОП'}</span>
              </div>
              <h2 className="text-xl sm:text-3xl lg:text-4xl font-serif font-bold text-white tracking-tight">
                {mapContent?.title || 'Как добраться в концепт-стор'}
              </h2>
              <p className="text-xs sm:text-sm text-[#A89D91]">
                {mapContent?.description ||
                  'Майкоп, ул. К.А. Васильева, 2/1 — бесплатная парковка перед входом, 330 м от остановки «Ул. 12-го Марта».'}
              </p>
            </div>

            {/* Quick External Map Buttons */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <a
                href={mapContent?.yandexDirectUrl || 'https://yandex.ru/maps/-/CTDGNHK~'}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-[#D9A76A] hover:bg-[#E5CBA8] text-[#0E0A08] text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer"
              >
                <Navigation className="h-3.5 w-3.5 text-[#0E0A08]" />
                <span>Яндекс Карты</span>
                <ExternalLink className="h-3 w-3 text-[#0E0A08]" />
              </a>

              <a
                href={
                  mapContent?.gisDirectUrl ||
                  `https://2gis.ru/maykop/search/${encodeURIComponent(`Майкоп ${storeAddress}`)}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-white text-xs font-semibold transition-all active:scale-95 cursor-pointer"
              >
                <span>2ГИС</span>
                <ExternalLink className="h-3 w-3 text-[#A89D91]" />
              </a>
            </div>
          </div>

          {/* Map Container */}
          <div className="relative rounded-2xl sm:rounded-[32px] overflow-hidden border border-white/15 bg-[#140E0A] shadow-2xl h-[360px] xs:h-[400px] sm:h-[500px] lg:h-[560px] group">
            
            {/* Yandex Map Iframe with Exact Coordinates (44.609943, 40.046895) */}
            <iframe
              src={
                mapContent?.yandexMapUrl ||
                'https://yandex.ru/map-widget/v1/?ll=40.046895%2C44.609943&z=17.2&pt=40.046895,44.609943,pm2rdm&mode=search&text=%D0%9C%D0%B0%D0%B9%D0%BA%D0%BE%D0%BF%2C%20%D1%83%D0%BB%D0%B8%D1%86%D0%B0%20%D0%92%D0%B0%D1%81%D0%B8%D0%BB%D1%8C%D0%B5%D0%B2%D0%B0%2C%202%2F1'
              }
              width="100%"
              height="100%"
              frameBorder="0"
              allowFullScreen={true}
              title="Интерактивная карта расположения концепт-стора ТАВ"
              className="w-full h-full filter saturate-[1.1] contrast-[1.05]"
            />

            {/* Overlaid Floating Info Card (Bottom-Left) */}
            <div className="absolute bottom-3 left-3 right-3 sm:right-auto sm:left-6 sm:bottom-6 z-10 max-w-sm p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-[#0E0A08]/90 backdrop-blur-xl border border-white/20 shadow-2xl space-y-2">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-lg bg-[#D9A76A]/20 flex items-center justify-center text-[#D9A76A]">
                    <Store className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-xs font-bold text-white">ТАВ Концепт-стор</span>
                </div>
                <div className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400 font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Открыто</span>
                </div>
              </div>

              <div className="text-[11px] text-[#C4B9AD] space-y-0.5">
                <p className="font-medium text-white">{storeAddress}</p>
                <p className="text-[#8E8276]">г. Майкоп, Республика Адыгея</p>
              </div>

              <div className="pt-1.5 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-[#D9A76A]">
                <span>Ежедневно 08:30–20:30</span>
                <a
                  href={mapContent?.yandexDirectUrl || 'https://yandex.ru/maps/-/CTDGNHK~'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline flex items-center gap-1 text-white font-bold"
                >
                  <span>Построить маршрут</span>
                  <ExternalLink className="h-2.5 w-2.5" />
                </a>
              </div>
            </div>

          </div>

          {/* Transport & Route Tips */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            {transportTips.map((tip: any, idx: number) => {
              const IconComp = tip.icon === 'bus' ? Bus : tip.icon === 'walk' ? Footprints : Car;
              return (
                <div key={idx} className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-white/[0.02] border border-white/10 space-y-1">
                  <div className="flex items-center gap-2 text-xs font-bold text-white">
                    <IconComp className="h-4 w-4 text-[#D9A76A]" />
                    <span>{tip.title}</span>
                  </div>
                  <p className="text-[11px] sm:text-xs text-[#8E8276] leading-relaxed">
                    {tip.desc}
                  </p>
                </div>
              );
            })}
          </div>

        </section>
      )}

      {/* ────────────────────────────────────────────────────────────
          3. DUAL CONCIERGE & PRIVILEGES HUB (📱 2-Col Mobile / 💻 Side-by-Side Tablet)
      ──────────────────────────────────────────────────────────── */}
      {isConciergeHubActive && (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8 items-stretch">
          
          {/* Left 6 Cols: Direct Concierge Channels */}
          <div className="md:col-span-1 lg:col-span-6 p-4 sm:p-7 md:p-8 lg:p-9 rounded-2xl sm:rounded-[32px] bg-gradient-to-br from-[#1A120D] via-[#140E0A] to-[#160F0B] border border-white/15 shadow-xl flex flex-col justify-between space-y-4 sm:space-y-6">
            
            <div className="space-y-3 sm:space-y-4">
              <div className="inline-flex items-center gap-2 text-[10px] sm:text-xs font-mono font-bold uppercase tracking-[0.15em] sm:tracking-[0.2em] text-[#D9A76A]">
                <Sparkles className="h-3.5 w-3.5 text-[#D9A76A]" />
                <span>{conciergeHubContent?.conciergeBadge || 'Персональный консьерж'}</span>
              </div>

              <div className="space-y-1">
                <h3 className="text-xl sm:text-3xl font-serif font-bold text-white tracking-tight">
                  {conciergeHubContent?.conciergeTitle || 'Прямая связь с залом'}
                </h3>
                <p className="text-xs sm:text-sm text-[#A89D91] leading-relaxed">
                  {conciergeHubContent?.conciergeDesc ||
                    'Консультанты ответят в течение нескольких минут, снимут видео новинок и отложат товар.'}
                </p>
              </div>

              {/* Channels 2-Col Grid on Mobile */}
              <div className="grid grid-cols-2 gap-2 sm:gap-3 pt-1">
                
                {/* Telegram */}
                <a
                  href={conciergeHubContent?.telegramUrl || telegramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/25 transition-all group block cursor-pointer active:scale-95"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg sm:rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center">
                      <Send className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </div>
                    <span className="text-[9px] sm:text-[10px] font-mono text-sky-400 font-bold uppercase">Online</span>
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-white group-hover:text-sky-300 transition-colors">
                    Telegram
                  </div>
                  <div className="text-[10px] sm:text-[11px] text-[#8E8276] truncate mt-0.5">
                    @konfetnica_store
                  </div>
                </a>

                {/* WhatsApp */}
                <a
                  href={conciergeHubContent?.whatsappUrl || whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/25 transition-all group block cursor-pointer active:scale-95"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg sm:rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                      <MessageCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </div>
                    <span className="text-[9px] sm:text-[10px] font-mono text-emerald-400 font-bold uppercase">WhatsApp</span>
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                    WhatsApp
                  </div>
                  <div className="text-[10px] sm:text-[11px] text-[#8E8276] truncate mt-0.5">
                    +7 (988) 163-71-41
                  </div>
                </a>

                {/* Phone call */}
                <a
                  href={`tel:${(conciergeHubContent?.phone || storePhone).replace(/[^+\d]/g, '')}`}
                  className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-[#B88B58]/10 hover:bg-[#B88B58]/20 border border-[#B88B58]/25 transition-all group block cursor-pointer active:scale-95"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg sm:rounded-xl bg-[#B88B58]/20 text-[#D9A76A] flex items-center justify-center">
                      <Phone className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </div>
                    <span className="text-[9px] sm:text-[10px] font-mono text-[#D9A76A] font-bold uppercase">Звонок</span>
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-white group-hover:text-[#D9A76A] transition-colors">
                    Телефон
                  </div>
                  <div className="text-[10px] sm:text-[11px] text-[#8E8276] truncate mt-0.5">
                    {conciergeHubContent?.phone || storePhone}
                  </div>
                </a>

                {/* B2B Email */}
                <a
                  href={`mailto:${conciergeHubContent?.email || 'info@konfetnica-store.ru'}`}
                  className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/25 transition-all group block cursor-pointer active:scale-95"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg sm:rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                      <Mail className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </div>
                    <span className="text-[9px] sm:text-[10px] font-mono text-amber-400 font-bold uppercase">B2B / Опт</span>
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                    Эл. почта
                  </div>
                  <div className="text-[10px] sm:text-[11px] text-[#8E8276] truncate mt-0.5">
                    {conciergeHubContent?.email || 'info@konfetnica-store.ru'}
                  </div>
                </a>

              </div>
            </div>

            <div className="text-[10px] sm:text-[11px] text-[#7D7166] pt-2 sm:pt-3 border-t border-white/5 flex items-center justify-between">
              <span>{conciergeHubContent?.bottomNoteLeft || 'Ответ: 5–10 мин'}</span>
              <span>{conciergeHubContent?.bottomNoteRight || 'Без выходных'}</span>
            </div>

          </div>

          {/* Right 6 Cols: Boutique Privileges */}
          <div className="md:col-span-1 lg:col-span-6 p-4 sm:p-7 md:p-8 lg:p-9 rounded-2xl sm:rounded-[32px] bg-gradient-to-br from-[#1A120D] via-[#140E0A] to-[#160F0B] border border-white/15 shadow-xl flex flex-col justify-between space-y-4 sm:space-y-6">
            
            <div className="space-y-3 sm:space-y-4">
              <div className="inline-flex items-center gap-2 text-[10px] sm:text-xs font-mono font-bold uppercase tracking-[0.15em] sm:tracking-[0.2em] text-[#D9A76A]">
                <ShieldCheck className="h-3.5 w-3.5 text-[#D9A76A]" />
                <span>{conciergeHubContent?.privilegesBadge || 'Сервис в концепт-сторе'}</span>
              </div>

              <div className="space-y-1">
                <h3 className="text-xl sm:text-3xl font-serif font-bold text-white tracking-tight">
                  {conciergeHubContent?.privilegesTitle || 'Привилегии для гостей'}
                </h3>
                <p className="text-xs sm:text-sm text-[#A89D91] leading-relaxed">
                  {conciergeHubContent?.privilegesDesc ||
                    'Каждый визит в пространство ТАВ продуман для вашего максимального комфорта.'}
                </p>
              </div>

              {/* Privileges 2-Col Grid on Mobile */}
              <div className="grid grid-cols-2 gap-2 sm:gap-3 pt-1">
                {hubPrivileges.map((item: any, idx: number) => {
                  const icons = [Coffee, Sparkles, Gift, Heart];
                  const IconComp = icons[idx % icons.length];
                  return (
                    <div key={idx} className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
                      <div className="flex items-center gap-2 text-xs font-bold text-white">
                        <IconComp className="h-3.5 w-3.5 text-[#D9A76A] flex-shrink-0" />
                        <span className="leading-tight">{item.title}</span>
                      </div>
                      <p className="text-[10px] sm:text-[11px] text-[#8E8276] leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="text-[10px] sm:text-[11px] text-[#7D7166] pt-2 sm:pt-3 border-t border-white/5 flex items-center justify-between">
              <span>Бесплатная парковка</span>
              <span>Wi-Fi для гостей</span>
            </div>

          </div>

        </section>
      )}

      {/* ────────────────────────────────────────────────────────────
          4. SMART PRE-ORDER TERMINAL ("Подготовим заказ к приезду")
      ──────────────────────────────────────────────────────────── */}
      {isConciergeActive && (
        <section className="relative rounded-2xl sm:rounded-[32px] overflow-hidden bg-gradient-to-b from-[#18110D] via-[#120C09] to-[#0E0A08] border border-white/15 p-4 sm:p-10 shadow-2xl space-y-6 sm:space-y-8">
          
          <div className="text-center max-w-2xl mx-auto space-y-1.5 sm:space-y-2">
            <div className="inline-flex items-center gap-2 text-[10px] sm:text-xs font-mono font-bold uppercase tracking-[0.15em] sm:tracking-[0.2em] text-[#D9A76A]">
              <Coffee className="h-3.5 w-3.5 text-[#D9A76A]" />
              <span>{conciergeContent?.badge || 'Экспресс-подготовка'}</span>
            </div>
            <h2 className="text-xl sm:text-3xl lg:text-4xl font-serif font-bold text-white tracking-tight">
              {conciergeContent?.title || 'Смолоть зерно или собрать дрип-сет к визиту?'}
            </h2>
            <p className="text-xs sm:text-sm text-[#A89D91]">
              {conciergeContent?.subtitle ||
                conciergeContent?.description ||
                'Выберите тему, укажите ваши пожелания, и мы подготовим заказ к вашему приезду в чате с консультантом.'}
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4 sm:space-y-6">
            
            {/* Step 1: Horizontal Topic Selector */}
            <div className="space-y-2">
              <label className="text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider text-[#D9A76A]">
                1. Выберите тему обращения:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5">
                {activeTopics.map((topic) => {
                  const isSelected = selectedTopicId === topic.id;
                  const iconInfo = TOPIC_ICON_MAP[topic.iconKey || 'other'] || TOPIC_ICON_MAP.other;
                  const IconComp = iconInfo.icon;

                  return (
                    <button
                      key={topic.id}
                      type="button"
                      onClick={() => setSelectedTopicId(topic.id)}
                      className={cn(
                        'p-2.5 sm:p-3 rounded-xl sm:rounded-2xl border text-left transition-all cursor-pointer active:scale-95 flex flex-col justify-between min-h-[64px] sm:min-h-[76px]',
                        isSelected
                          ? 'bg-[#B88B58]/20 border-[#D9A76A] shadow-[0_0_15px_rgba(217,167,106,0.25)]'
                          : 'bg-white/[0.03] hover:bg-white/[0.06] border-white/10 hover:border-white/20'
                      )}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <IconComp className={cn('h-4 w-4', isSelected ? 'text-[#D9A76A]' : iconInfo.color)} />
                        {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-[#D9A76A]" />}
                      </div>
                      <div className="text-[11px] sm:text-xs font-bold text-white leading-tight">
                        {topic.label}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Selected Topic Title & Dynamic Fields */}
            <div className="p-3.5 sm:p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3 sm:space-y-4">
              
              <div className="flex items-center gap-2 text-xs font-semibold text-[#D9A76A]">
                <Sparkles className="h-3.5 w-3.5" />
                <span>{currentTopic?.title}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Ваше имя (необязательно)"
                  className="w-full rounded-xl bg-black/40 border border-white/15 px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder:text-[#7D7166] focus:outline-none focus:border-[#D9A76A] transition-colors"
                />
                <input
                  type="text"
                  value={userContact}
                  onChange={(e) => setUserContact(e.target.value)}
                  placeholder="Телефон или @username (необязательно)"
                  className="w-full rounded-xl bg-black/40 border border-white/15 px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder:text-[#7D7166] focus:outline-none focus:border-[#D9A76A] transition-colors"
                />
              </div>

              <textarea
                rows={2}
                value={userComment}
                onChange={(e) => setUserComment(e.target.value)}
                placeholder={currentTopic?.placeholder || 'Укажите сорт кофе, степень помола или пожелания...'}
                className="w-full rounded-xl bg-black/40 border border-white/15 p-3.5 text-xs sm:text-sm text-white placeholder:text-[#7D7166] focus:outline-none focus:border-[#D9A76A] transition-colors resize-none leading-relaxed"
              />

              {/* Policy Consent Checkbox */}
              <div className="space-y-1 pt-1">
                <label className="flex items-start gap-2.5 cursor-pointer text-[11px] sm:text-xs text-[#A89D91] select-none">
                  <input
                    type="checkbox"
                    checked={agreePolicy}
                    onChange={(e) => {
                      setAgreePolicy(e.target.checked);
                      if (e.target.checked) setShowPolicyError(false);
                    }}
                    className="mt-0.5 h-4 w-4 rounded border-white/20 bg-black/40 text-[#D9A76A] focus:ring-0 focus:ring-offset-0 cursor-pointer"
                  />
                  <span>
                    Согласен на обработку персональных данных в соответствии с{' '}
                    <a href="/privacy" target="_blank" className="text-[#D9A76A] underline hover:text-[#E5CBA8]">
                      политикой конфиденциальности
                    </a>
                  </span>
                </label>
                {showPolicyError && (
                  <p className="text-[11px] text-red-400 pl-6.5">
                    Пожалуйста, подтвердите согласие с политикой конфиденциальности.
                  </p>
                )}
              </div>

              {/* Step 3: Messenger Dispatch Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-2.5">
                <a
                  href={agreePolicy ? getTelegramUrl() : '#'}
                  onClick={(e) => {
                    if (!agreePolicy) {
                      e.preventDefault();
                      setShowPolicyError(true);
                    }
                  }}
                  target={agreePolicy ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white px-4 py-3 text-xs sm:text-sm font-bold shadow-lg shadow-sky-950/40 transition-all active:scale-95 cursor-pointer text-center"
                >
                  <Send className="h-4 w-4" />
                  <span>Отправить в Telegram</span>
                </a>

                <a
                  href={agreePolicy ? getWhatsappUrl() : '#'}
                  onClick={(e) => {
                    if (!agreePolicy) {
                      e.preventDefault();
                      setShowPolicyError(true);
                    }
                  }}
                  target={agreePolicy ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-3 text-xs sm:text-sm font-bold shadow-lg shadow-emerald-950/40 transition-all active:scale-95 cursor-pointer text-center"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>Отправить в WhatsApp</span>
                </a>
              </div>

            </div>

          </div>

        </section>
      )}

      {/* ────────────────────────────────────────────────────────────
          5. BENTO GUIDE FAQ (4 Structured Visual Cards)
      ──────────────────────────────────────────────────────────── */}
      {isGuestFaqActive && (
        <section className="space-y-6 sm:space-y-8">
          
          <div className="text-center max-w-2xl mx-auto space-y-1 sm:space-y-2">
            <div className="inline-flex items-center gap-2 text-[10px] sm:text-xs font-mono font-bold uppercase tracking-[0.15em] sm:tracking-[0.2em] text-[#D9A76A]">
              <HelpCircle className="h-3.5 w-3.5 text-[#D9A76A]" />
              <span>{guestFaqContent?.badge || 'Справочник гостя'}</span>
            </div>
            <h2 className="text-xl sm:text-4xl font-serif font-bold text-white tracking-tight">
              {guestFaqContent?.title || 'Перед вашим визитом'}
            </h2>
            <p className="text-xs sm:text-sm text-[#A89D91]">
              {guestFaqContent?.subtitle ||
                'Ответы на популярные вопросы о покупках, дегустациях и сервисе в магазине.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-5">
            {faqItems.map((item: any, idx: number) => {
              const icons = [Coffee, Coffee, Sparkles, Car];
              const IconComp = icons[idx % icons.length];
              return (
                <div key={idx} className="p-4 sm:p-7 rounded-2xl sm:rounded-3xl bg-[#140E0A] border border-white/10 space-y-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg sm:rounded-xl bg-amber-500/15 text-[#D9A76A] flex items-center justify-center flex-shrink-0">
                      <IconComp className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-white font-serif">
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-[11px] sm:text-xs text-[#C4B9AD] leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>

        </section>
      )}

    </div>
  );
}
