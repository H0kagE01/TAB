'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { 
  Search, 
  User, 
  ShoppingBag, 
  Menu, 
  X, 
  ChevronRight, 
  Coffee, 
  Sparkles, 
  Layers, 
  Wrench,
  Phone, 
  MapPin, 
  Clock 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../inquiry/InquiryContext';
import { cn } from '@/lib/utils';
import type { StoreLocation } from '@/types';
import { mockStores } from '@/lib/mock-data/stores';
import type { SiteSettingsData } from '@/lib/db/settings';

const defaultNavItems = [
  { href: '/catalog', label: 'Каталог' },
  { href: '/coffee', label: 'Зерновой кофе' },
  { href: '/about', label: 'О нас' },
  { href: '/contacts', label: 'Контакты' },
];

const mobileQuickCategories = [
  { href: '/catalog/single-origin', label: 'Моносорта', icon: Coffee, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
  { href: '/catalog/espresso-blends', label: 'Эспрессо-бленды', icon: Layers, color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/20' },
  { href: '/catalog/drip-coffee', label: 'Дрип-пакеты', icon: Sparkles, color: 'text-amber-300', bg: 'bg-amber-400/10 border-amber-400/20' },
  { href: '/catalog/accessories', label: 'Аксессуары', icon: Wrench, color: 'text-stone-300', bg: 'bg-stone-500/10 border-stone-500/20' },
];

interface HeaderProps {
  primaryStore?: StoreLocation;
  siteSettings?: SiteSettingsData;
}

export function Header({ primaryStore: primaryStoreProp, siteSettings }: HeaderProps = {}) {
  const pathname = usePathname();
  const { openCart, totalCount, cartBounceKey } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const primaryStore = primaryStoreProp ?? mockStores[0];
  const navItems = siteSettings?.headerMenu && siteSettings.headerMenu.length > 0 ? siteSettings.headerMenu : defaultNavItems;
  const displayPhone = siteSettings?.mainPhone || primaryStore.phone;
  const logoUrl = siteSettings?.logoUrl || '/images/logo.jpg';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300 w-full',
          isScrolled
            ? 'glass-header py-2.5 sm:py-3 shadow-2xl border-b border-[#B88B58]/15 bg-[#0E0A08]/90 backdrop-blur-xl'
            : 'bg-gradient-to-b from-[#0E0A08]/95 via-[#0E0A08]/60 to-transparent py-4 sm:py-5'
        )}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3 sm:gap-6">
          
          {/* Logo with Emblem & Monogram ТАВ */}
          <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group flex-shrink-0">
            <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden border border-[#D9A76A]/40 shadow-md group-hover:border-[#D9A76A] transition-all flex-shrink-0">
              <Image
                src={logoUrl}
                alt="ТАВ Logo"
                fill
                sizes="36px"
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <span className="text-lg sm:text-2xl font-black tracking-[0.18em] sm:tracking-[0.25em] text-[#F7F4EF] uppercase font-sans group-hover:text-[#D9A76A] transition-colors select-none">
              ТАВ
            </span>
          </Link>

          {/* Center Navigation (Tablet & Desktop) */}
          <nav className="hidden md:flex items-center gap-3 lg:gap-6 xl:gap-8 flex-shrink-0">
            {navItems.map((item) => {
              const isActive =
                item.href === '/catalog'
                  ? pathname === '/catalog' || (pathname.startsWith('/catalog/') && !pathname.includes('drip-coffee'))
                  : pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'text-[11px] lg:text-xs xl:text-sm font-semibold tracking-wider transition-colors relative py-1 px-1.5 sm:px-2 rounded-lg whitespace-nowrap uppercase',
                    isActive
                      ? 'text-[#D9A76A] font-bold'
                      : 'text-[#C4B9AD] hover:text-white hover:bg-white/5'
                  )}
                >
                  {item.label}
                  {isActive && (
                    <motion.span
                      layoutId="activeNavIndicator"
                      className="absolute bottom-0 left-1 right-1 h-[2px] bg-[#D9A76A] rounded-full"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Icons (Search, Cart/Inquiry Badge, Mobile Menu) */}
          <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
            
            {/* Search Toggle / Form */}
            {searchOpen ? (
              <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                <input
                  type="text"
                  placeholder="Поиск кофе, нот, помола..."
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-40 sm:w-60 rounded-full bg-[#1C1410] border border-[#B88B58]/40 py-1.5 pl-8 pr-7 text-xs text-white placeholder:text-stone-500 focus:outline-none focus:border-[#B88B58]"
                />
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#B88B58]" />
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 hover:text-white p-1"
                  aria-label="Закрыть поиск"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </form>
            ) : (
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="p-2 sm:p-2.5 rounded-full text-[#C4B9AD] hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                aria-label="Поиск по кофе"
              >
                <Search className="h-5 w-5" />
              </button>
            )}

            {/* Inquiry / Shopping Bag with live counter and spring bounce animation */}
            <motion.button
              key={cartBounceKey}
              animate={cartBounceKey > 0 ? { scale: [1, 1.25, 0.9, 1.12, 1], rotate: [0, -8, 8, -4, 0] } : {}}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              type="button"
              onClick={() => openCart()}
              className="relative p-2 sm:p-2.5 rounded-full text-[#C4B9AD] hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
              aria-label="Корзина заказов"
              title="Открыть корзину"
            >
              <ShoppingBag className="h-5 w-5" />
              {totalCount > 0 && (
                <span className="absolute top-0.5 right-0.5 h-4 min-w-[16px] px-1 rounded-full bg-[#D9A76A] text-[#0E0A08] text-[10px] font-black flex items-center justify-center shadow-md animate-in zoom-in duration-200">
                  {totalCount}
                </span>
              )}
            </motion.button>

            {/* Mobile Menu Button (Only for phone screens < 768px) */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-[#C4B9AD] hover:text-white hover:bg-white/5 cursor-pointer"
              aria-label={mobileMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-[70] md:hidden flex flex-col justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-md"
              onClick={() => setMobileMenuOpen(false)}
            />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 280 }}
              className="relative w-full max-w-sm ml-auto h-full bg-[#120C09] border-l border-[#B88B58]/20 shadow-2xl flex flex-col justify-between p-5 sm:p-6 z-10 overflow-y-auto"
            >
              <div className="space-y-6">
                {/* Header inside drawer */}
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="relative w-8 h-8 rounded-full overflow-hidden border border-[#D9A76A]">
                      <Image
                        src="/images/logo.jpg"
                        alt="ТАВ Logo"
                        fill
                        sizes="32px"
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <span className="text-xl font-black tracking-[0.2em] text-white uppercase block">
                        ТАВ
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="rounded-full p-2 text-stone-400 hover:bg-white/10 hover:text-white cursor-pointer"
                    aria-label="Закрыть"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Mobile Search Input */}
                <form onSubmit={handleSearchSubmit} className="relative">
                  <input
                    type="text"
                    placeholder="Поиск кофе, нот, помола..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-xl border border-[#B88B58]/30 bg-[#1A120D] py-2.5 pl-9 pr-3 text-sm text-white placeholder:text-stone-500 focus:outline-none focus:border-[#B88B58]"
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#B88B58]" />
                </form>

                {/* Quick Category Shortcuts */}
                <div className="space-y-2">
                  <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#8E8276]">
                    Категории:
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {mobileQuickCategories.map((cat) => {
                      const CatIcon = cat.icon;
                      return (
                        <Link
                          key={cat.href}
                          href={cat.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className={cn(
                            'p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all',
                            cat.bg,
                            'hover:scale-[1.02] active:scale-95'
                          )}
                        >
                          <CatIcon className={cn('h-4 w-4 flex-shrink-0', cat.color)} />
                          <span className="text-[#F7F4EF] truncate">{cat.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>

                {/* Main Navigation Links */}
                <nav className="space-y-1 pt-2 border-t border-white/10">
                  {navItems.map((item) => {
                    const isActive = pathname === item.href || (item.href === '/catalog' && pathname.startsWith('/catalog'));
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={cn(
                          'flex items-center justify-between py-3 px-3 rounded-xl text-sm font-medium transition-colors',
                          isActive
                            ? 'bg-[#B88B58]/15 text-[#E5CBA8] font-bold border border-[#B88B58]/30'
                            : 'text-[#E6DEC8] hover:bg-white/5 hover:text-white'
                        )}
                      >
                        <span>{item.label}</span>
                        <ChevronRight className="h-4 w-4 text-[#8E8276]" />
                      </Link>
                    );
                  })}
                </nav>

                {/* Store Info & Direct Phone Contact */}
                <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2.5 text-xs text-[#C4B9AD]">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 font-semibold text-white">
                      <MapPin className="h-3.5 w-3.5 text-[#D9A76A]" />
                      <span>{primaryStore.city}</span>
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      {primaryStore.workingHours.split(',')[0]}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#8E8276] leading-snug">
                    {primaryStore.address}
                  </p>
                  <a
                    href={`tel:${primaryStore.formattedPhone}`}
                    className="inline-flex items-center gap-2 text-xs font-bold text-[#D9A76A] hover:underline pt-1"
                  >
                    <Phone className="h-3.5 w-3.5" />
                    <span>{primaryStore.phone}</span>
                  </a>
                </div>
              </div>

              {/* Bottom CTA in Drawer */}
              <div className="pt-6 border-t border-white/10 space-y-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openCart();
                  }}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#D9A76A] hover:bg-[#E5CBA8] py-3 text-center text-sm font-bold text-[#0E0A08] shadow-lg transition-colors cursor-pointer"
                >
                  <ShoppingBag className="h-4 w-4" />
                  <span>Корзина {totalCount > 0 && `(${totalCount})`}</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
