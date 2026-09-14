'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Grid, Search, ShoppingBag, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart } from '../inquiry/InquiryContext';
import { cn } from '@/lib/utils';

export function MobileBottomNav() {
  const pathname = usePathname();
  const { openCart, totalCount, cartBounceKey } = useCart();

  const navLinks = [
    {
      href: '/',
      label: 'Главная',
      icon: Home,
      isActive: pathname === '/',
    },
    {
      href: '/catalog',
      label: 'Каталог',
      icon: Grid,
      isActive: pathname.startsWith('/catalog') || pathname === '/coffee',
    },
    {
      href: '/search',
      label: 'Поиск',
      icon: Search,
      isActive: pathname === '/search',
    },
    {
      href: '/contacts',
      label: 'Контакты',
      icon: MapPin,
      isActive: pathname === '/contacts',
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden pointer-events-none pb-[env(safe-area-inset-bottom,0px)]">
      {/* Elevated Glass Container */}
      <nav
        aria-label="Мобильная навигация"
        className="pointer-events-auto mx-3 mb-2 rounded-2xl bg-[#120C09]/95 backdrop-blur-xl border border-white/15 shadow-[0_-4px_24px_rgba(0,0,0,0.7)] px-2 py-1.5 flex items-center justify-around"
      >
        {/* Main Links + Cart Button */}
        {navLinks.slice(0, 2).map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all relative flex-1 text-center min-w-0',
                item.isActive
                  ? 'text-[#D9A76A]'
                  : 'text-[#9E9284] hover:text-[#E0D8CE] active:scale-95'
              )}
            >
              <Icon className="h-5 w-5 mb-0.5" />
              <span className="text-[10px] font-medium tracking-tight truncate w-full">
                {item.label}
              </span>
              {item.isActive && (
                <motion.span
                  layoutId="bottomNavIndicator"
                  className="absolute bottom-0 w-4 h-0.5 bg-[#D9A76A] rounded-full"
                />
              )}
            </Link>
          );
        })}

        {/* Central Cart / Inquiry Quick Action */}
        <div className="flex-1 flex justify-center px-1">
          <motion.button
            key={cartBounceKey}
            animate={cartBounceKey > 0 ? { scale: [1, 1.25, 0.92, 1.1, 1] } : {}}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            type="button"
            onClick={() => openCart()}
            className="relative flex flex-col items-center justify-center -top-2 h-12 w-12 rounded-2xl bg-gradient-to-tr from-[#C2905A] via-[#D9A76A] to-[#E5CBA8] text-[#0E0A08] shadow-[0_4px_16px_rgba(217,167,106,0.45)] active:scale-95 cursor-pointer border border-[#E5CBA8]/40"
            aria-label="Корзина покупок"
          >
            <ShoppingBag className="h-5 w-5 stroke-[2.2]" />
            {totalCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 h-5 min-w-[20px] px-1 rounded-full bg-[#0E0A08] text-[#E5CBA8] border border-[#D9A76A] text-[10px] font-black flex items-center justify-center shadow-lg">
                {totalCount}
              </span>
            )}
          </motion.button>
        </div>

        {navLinks.slice(2).map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all relative flex-1 text-center min-w-0',
                item.isActive
                  ? 'text-[#D9A76A]'
                  : 'text-[#9E9284] hover:text-[#E0D8CE] active:scale-95'
              )}
            >
              <Icon className="h-5 w-5 mb-0.5" />
              <span className="text-[10px] font-medium tracking-tight truncate w-full">
                {item.label}
              </span>
              {item.isActive && (
                <motion.span
                  layoutId="bottomNavIndicator"
                  className="absolute bottom-0 w-4 h-0.5 bg-[#D9A76A] rounded-full"
                />
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
