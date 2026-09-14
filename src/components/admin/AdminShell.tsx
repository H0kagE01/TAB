'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Layers,
  Coffee,
  ShoppingBag,
  Settings,
  ExternalLink,
  LogOut,
  Menu,
  X,
  User,
  Sparkles,
  ChevronRight,
  FolderTree,
  Tag,
  LayoutGrid,
  Store,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { AuthSession } from '@/lib/auth';

interface AdminShellProps {
  children: React.ReactNode;
  session: AuthSession | null;
}

const navGroups = [
  {
    group: 'Основное',
    items: [
      { href: '/admin', label: 'Дашборд', icon: LayoutDashboard, exact: true },
      { href: '/admin/pages', label: 'Страницы и Блоки', icon: Layers },
      { href: '/admin/inquiries', label: 'Заказы и Заявки', icon: ShoppingBag },
    ],
  },
  {
    group: 'Каталог и Справочники',
    items: [
      { href: '/admin/products', label: 'Товары', icon: Coffee },
      { href: '/admin/categories', label: 'Категории', icon: FolderTree },
      { href: '/admin/brands', label: 'Бренды', icon: Tag },
      { href: '/admin/collections', label: 'Подборки', icon: LayoutGrid },
      { href: '/admin/stores', label: 'Магазины / Локации', icon: Store },
    ],
  },
  {
    group: 'Система',
    items: [
      { href: '/admin/settings', label: 'Настройки сайта', icon: Settings },
    ],
  },
];

export function AdminShell({ children, session }: AdminShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  // If on login page, render bare children
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  // If unauthenticated, redirect to login
  if (!session) {
    if (typeof window !== 'undefined') {
      router.push('/admin/login');
    }
    return null;
  }

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch('/api/admin/auth/logout', { method: 'POST' });
      router.push('/admin/login');
      router.refresh();
    } catch {
      setLoggingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0E0A08] text-white flex flex-col md:flex-row">
      
      {/* 1. DESKTOP SIDEBAR */}
      <aside className="hidden md:flex flex-col justify-between w-64 lg:w-72 bg-[#120D0A] border-r border-white/10 p-5 shrink-0 min-h-screen sticky top-0">
        <div className="space-y-7">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 px-2 pt-1">
            <div className="relative w-9 h-9 rounded-full overflow-hidden border border-[#D9A76A]/40 shadow-md">
              <Image
                src="/images/logo.jpg"
                alt="ТАВ"
                fill
                sizes="36px"
                className="object-cover"
              />
            </div>
            <div>
              <span className="text-lg font-black tracking-[0.2em] text-white uppercase font-sans block">
                ТАВ
              </span>
              <span className="text-[10px] font-mono text-[#D9A76A] tracking-wider uppercase block -mt-0.5">
                Admin Panel
              </span>
            </div>
          </div>

          {/* Navigation Groups */}
          <div className="space-y-5">
            {navGroups.map((group) => (
              <div key={group.group} className="space-y-1.5">
                <div className="px-3 text-[10px] font-mono font-bold uppercase tracking-wider text-[#8E8276]/80">
                  {group.group}
                </div>
                <nav className="space-y-1">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = item.exact
                      ? pathname === item.href
                      : pathname === item.href || pathname.startsWith(`${item.href}/`);

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          'flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all group',
                          isActive
                            ? 'bg-[#D9A76A] text-[#0E0A08] shadow-[0_0_16px_rgba(217,167,106,0.25)] font-bold'
                            : 'text-[#C4B9AD] hover:text-white hover:bg-white/[0.06]'
                        )}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className={cn('h-4 w-4', isActive ? 'text-[#0E0A08]' : 'text-[#8E8276] group-hover:text-[#D9A76A]')} />
                          <span>{item.label}</span>
                        </div>
                        {isActive && <ChevronRight className="h-3.5 w-3.5 text-[#0E0A08]" />}
                      </Link>
                    );
                  })}
                </nav>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom User Profile & External Store Link */}
        <div className="space-y-3 pt-4 border-t border-white/10">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-3 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-xs font-medium text-[#E5CBA8] transition-colors border border-white/5"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5 text-[#D9A76A]" />
              <span>Перейти на сайт</span>
            </div>
            <ExternalLink className="h-3.5 w-3.5 opacity-60" />
          </a>

          <div className="flex items-center justify-between px-2 pt-1">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-full bg-amber-950 border border-[#D9A76A]/40 flex items-center justify-center text-[#D9A76A] font-bold text-xs shrink-0">
                <User className="h-3.5 w-3.5" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-white truncate">
                  {session.name}
                </div>
                <div className="text-[10px] font-mono text-[#8E8276] truncate">
                  {session.email}
                </div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              disabled={loggingOut}
              title="Выйти"
              className="p-1.5 rounded-lg text-stone-400 hover:text-rose-400 hover:bg-rose-950/30 transition-colors cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

      </aside>

      {/* 2. MOBILE TOPBAR */}
      <header className="md:hidden flex items-center justify-between p-4 bg-[#120D0A] border-b border-white/10 sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <div className="relative w-7 h-7 rounded-full overflow-hidden border border-[#D9A76A]">
            <Image src="/images/logo.jpg" alt="ТАВ" fill className="object-cover" />
          </div>
          <span className="text-base font-black tracking-widest text-white uppercase">
            ТАВ ADMIN
          </span>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="/"
            target="_blank"
            className="p-2 rounded-xl bg-white/5 text-[#D9A76A]"
            title="На сайт"
          >
            <ExternalLink className="h-4 w-4" />
          </a>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-xl bg-white/5 text-white"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>

      {/* MOBILE DRAWER */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col justify-end"
          data-lenis-prevent="true"
          onClick={(e) => {
            if (e.target === e.currentTarget) setMobileOpen(false);
          }}
        >
          <div
            className="w-full bg-[#140E0B] border-t border-white/10 p-5 rounded-t-3xl space-y-4 max-h-[85vh] overflow-y-auto"
            data-lenis-prevent="true"
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="text-sm font-bold text-white uppercase font-mono">
                Навигация админки
              </span>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-1 text-stone-400"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              {navGroups.map((group) => (
                <div key={group.group} className="space-y-1">
                  <div className="px-3 text-[10px] font-mono font-bold uppercase text-[#8E8276]">
                    {group.group}
                  </div>
                  <nav className="space-y-1">
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = item.exact
                        ? pathname === item.href
                        : pathname === item.href || pathname.startsWith(`${item.href}/`);

                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setMobileOpen(false)}
                          className={cn(
                            'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors',
                            isActive
                              ? 'bg-[#D9A76A] text-[#0E0A08] font-bold'
                              : 'text-[#C4B9AD] hover:bg-white/5'
                          )}
                        >
                          <Icon className="h-4 w-4" />
                          <span>{item.label}</span>
                        </Link>
                      );
                    })}
                  </nav>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-white/10 flex items-center justify-between">
              <div className="text-xs text-[#8E8276] truncate">
                {session.email}
              </div>
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-rose-950/50 border border-rose-500/30 text-rose-300 text-xs font-bold"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Выйти</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. MAIN CONTENT CANVAS */}
      <main className="flex-1 min-w-0 bg-[#0E0A08] p-4 sm:p-7 lg:p-10 overflow-y-auto">
        <div className="mx-auto max-w-7xl">
          {children}
        </div>
      </main>

    </div>
  );
}
