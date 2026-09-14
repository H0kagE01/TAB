import React from 'react';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import {
  Layers,
  Coffee,
  ShoppingBag,
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  Eye,
  Store,
  Sparkles,
} from 'lucide-react';

import { mockProducts } from '@/lib/mock-data/products';
import { mockPages } from '@/lib/mock-data/pages';
import { mockCategories } from '@/lib/mock-data/categories';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  let productsCount = mockProducts.length;
  let outOfStockCount = mockProducts.filter((p) => !p.inStock).length;
  let pagesCount = mockPages.length;
  let blocksCount = mockPages.reduce((acc, p) => acc + p.blocks.length, 0);
  let inquiriesCount = 3;
  let newInquiriesCount = 1;
  let recentInquiries: any[] = [];
  let popularProducts: any[] = mockProducts
    .filter((p) => p.isPopular)
    .slice(0, 4)
    .map((p) => {
      const cat = mockCategories.find((c) => c.slug === p.category || c.id === p.category);
      return {
        ...p,
        price: Number(p.price),
        category: cat || { name: p.categoryName || 'Спешелти' },
      };
    });

  try {
    const [
      pCount,
      oosCount,
      pgCount,
      bCount,
      inqCount,
      newInqCount,
      rInquiries,
      popProducts,
    ] = await Promise.all([
      prisma.product.count(),
      prisma.product.count({ where: { inStock: false } }),
      prisma.page.count(),
      prisma.pageBlock.count(),
      prisma.inquiry.count(),
      prisma.inquiry.count({ where: { status: 'NEW' } }),
      prisma.inquiry.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          items: true,
          store: true,
        },
      }),
      prisma.product.findMany({
        where: { isPopular: true },
        take: 4,
        orderBy: { order: 'asc' },
        include: { category: true },
      }),
    ]);

    productsCount = pCount;
    outOfStockCount = oosCount;
    pagesCount = pgCount;
    blocksCount = bCount;
    inquiriesCount = inqCount;
    newInquiriesCount = newInqCount;
    recentInquiries = rInquiries;
    popularProducts = popProducts;
  } catch (err) {
    console.warn('DB unavailable on AdminDashboardPage, using mock fallback stats');
  }

  return (
    <div className="space-y-8">
      
      {/* 1. Header with Welcome & Quick CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-[#D9A76A]">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Панель управления ТАВ</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-serif text-white mt-1">
            Сводка и управление сайтом
          </h1>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#D9A76A] hover:bg-[#E5CBA8] text-[#0E0A08] text-xs font-bold transition-all shadow-md active:scale-95"
          >
            <Plus className="h-4 w-4" />
            <span>Добавить товар</span>
          </Link>
          <Link
            href="/admin/pages/home"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-white text-xs font-semibold transition-all"
          >
            <Layers className="h-4 w-4 text-[#D9A76A]" />
            <span>Редактор Главной</span>
          </Link>
        </div>
      </div>

      {/* 2. Metric Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1: Inquiries */}
        <Link
          href="/admin/inquiries"
          className="group p-5 rounded-2xl bg-[#140E0B] border border-white/10 hover:border-[#D9A76A]/50 transition-all duration-300 shadow-xl space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-[#D9A76A]">
              <ShoppingBag className="h-5 w-5" />
            </div>
            {newInquiriesCount > 0 ? (
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[11px] font-mono font-bold">
                {newInquiriesCount} новых
              </span>
            ) : (
              <span className="text-xs text-[#8E8276] font-mono">Все обработаны</span>
            )}
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black font-serif text-white">
              {inquiriesCount}
            </div>
            <div className="text-xs text-[#8E8276] font-medium mt-0.5">
              Всего заявок из корзины
            </div>
          </div>
        </Link>

        {/* Metric 2: Products */}
        <Link
          href="/admin/products"
          className="group p-5 rounded-2xl bg-[#140E0B] border border-white/10 hover:border-[#D9A76A]/50 transition-all duration-300 shadow-xl space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-[#D9A76A]/10 border border-[#D9A76A]/20 flex items-center justify-center text-[#D9A76A]">
              <Coffee className="h-5 w-5" />
            </div>
            {outOfStockCount > 0 ? (
              <span className="px-2.5 py-0.5 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300 text-[11px] font-mono font-bold">
                {outOfStockCount} нет в наличии
              </span>
            ) : (
              <span className="text-xs text-emerald-400 font-mono">Все в наличии</span>
            )}
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black font-serif text-white">
              {productsCount}
            </div>
            <div className="text-xs text-[#8E8276] font-medium mt-0.5">
              Товаров в каталоге
            </div>
          </div>
        </Link>

        {/* Metric 3: Pages & Blocks */}
        <Link
          href="/admin/pages"
          className="group p-5 rounded-2xl bg-[#140E0B] border border-white/10 hover:border-[#D9A76A]/50 transition-all duration-300 shadow-xl space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
              <Layers className="h-5 w-5" />
            </div>
            <span className="text-xs text-[#8E8276] font-mono">
              {blocksCount} блоков
            </span>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black font-serif text-white">
              {pagesCount}
            </div>
            <div className="text-xs text-[#8E8276] font-medium mt-0.5">
              Страниц в редакторе
            </div>
          </div>
        </Link>

        {/* Metric 4: Direct Site Link */}
        <a
          href="/"
          target="_blank"
          className="group p-5 rounded-2xl bg-gradient-to-br from-[#1C140F] to-[#120D0A] border border-[#D9A76A]/20 hover:border-[#D9A76A]/60 transition-all duration-300 shadow-xl space-y-3 flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-[#D9A76A]/15 border border-[#D9A76A]/30 flex items-center justify-center text-[#D9A76A]">
              <Eye className="h-5 w-5" />
            </div>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Online
            </span>
          </div>
          <div>
            <div className="text-sm font-bold text-white group-hover:text-[#D9A76A] transition-colors flex items-center gap-1.5">
              <span>Открыть витрину</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </div>
            <div className="text-xs text-[#8E8276] font-mono mt-0.5">
              Проверить изменения
            </div>
          </div>
        </a>

      </div>

      {/* 3. Two-Column Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Col: Recent Inquiries */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold font-serif text-white flex items-center gap-2">
              <ShoppingBag className="h-4 w-4 text-[#D9A76A]" />
              <span>Последние заявки клиентов</span>
            </h2>
            <Link
              href="/admin/inquiries"
              className="text-xs font-mono font-bold text-[#D9A76A] hover:underline"
            >
              Смотреть все →
            </Link>
          </div>

          <div className="rounded-2xl bg-[#140E0B] border border-white/10 divide-y divide-white/5 overflow-hidden shadow-xl">
            {recentInquiries.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#8E8276]">
                Новых заявок пока нет.
              </div>
            ) : (
              recentInquiries.map((inq) => {
                const statusColor =
                  inq.status === 'NEW'
                    ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                    : inq.status === 'IN_PROGRESS'
                    ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                    : inq.status === 'COMPLETED'
                    ? 'bg-stone-500/15 text-stone-300 border-stone-500/30'
                    : 'bg-rose-500/15 text-rose-400 border-rose-500/30';

                return (
                  <div
                    key={inq.id}
                    className="p-4 hover:bg-white/[0.02] transition-colors flex items-center justify-between gap-4"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-bold text-[#D9A76A]">
                          #{inq.orderNumber}
                        </span>
                        <span className="text-white text-xs font-semibold truncate">
                          {inq.customerName}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-mono border ${statusColor}`}
                        >
                          {inq.status === 'NEW'
                            ? 'Новая'
                            : inq.status === 'IN_PROGRESS'
                            ? 'В работе'
                            : inq.status === 'COMPLETED'
                            ? 'Выполнен'
                            : 'Отменен'}
                        </span>
                      </div>
                      <div className="text-[11px] text-[#8E8276] flex items-center gap-2">
                        <span>{inq.customerPhone}</span>
                        <span>•</span>
                        <span>{inq.items.length} поз.</span>
                        {inq.grindType && (
                          <>
                            <span>•</span>
                            <span className="text-[#C4B9AD]">Помол: {inq.grindType}</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-sm font-bold text-white font-mono">
                        {Number(inq.totalAmount).toLocaleString('ru-RU')} ₽
                      </div>
                      <div className="text-[10px] text-[#8E8276] font-mono">
                        {new Date(inq.createdAt).toLocaleDateString('ru-RU', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Col: Quick Page Links & Popular Products */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Quick Page Editors */}
          <div className="space-y-3">
            <h2 className="text-lg font-bold font-serif text-white flex items-center gap-2">
              <Layers className="h-4 w-4 text-[#D9A76A]" />
              <span>Быстрый переход к страницам</span>
            </h2>

            <div className="grid grid-cols-2 gap-2.5">
              <Link
                href="/admin/pages/home"
                className="p-3.5 rounded-xl bg-[#140E0B] border border-white/10 hover:border-[#D9A76A]/40 transition-all text-xs font-semibold text-white flex items-center justify-between group"
              >
                <span>Главная</span>
                <ChevronRight className="h-3.5 w-3.5 text-[#8E8276] group-hover:text-[#D9A76A]" />
              </Link>
              <Link
                href="/admin/pages/about"
                className="p-3.5 rounded-xl bg-[#140E0B] border border-white/10 hover:border-[#D9A76A]/40 transition-all text-xs font-semibold text-white flex items-center justify-between group"
              >
                <span>О бренде ТАВ</span>
                <ChevronRight className="h-3.5 w-3.5 text-[#8E8276] group-hover:text-[#D9A76A]" />
              </Link>
              <Link
                href="/admin/pages/coffee"
                className="p-3.5 rounded-xl bg-[#140E0B] border border-white/10 hover:border-[#D9A76A]/40 transition-all text-xs font-semibold text-white flex items-center justify-between group"
              >
                <span>Зерновой кофе</span>
                <ChevronRight className="h-3.5 w-3.5 text-[#8E8276] group-hover:text-[#D9A76A]" />
              </Link>
              <Link
                href="/admin/pages/contacts"
                className="p-3.5 rounded-xl bg-[#140E0B] border border-white/10 hover:border-[#D9A76A]/40 transition-all text-xs font-semibold text-white flex items-center justify-between group"
              >
                <span>Контакты</span>
                <ChevronRight className="h-3.5 w-3.5 text-[#8E8276] group-hover:text-[#D9A76A]" />
              </Link>
            </div>
          </div>

          {/* Popular Products Widget */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold font-serif text-white flex items-center gap-2">
                <Coffee className="h-4 w-4 text-[#D9A76A]" />
                <span>Популярные товары (на Главной)</span>
              </h2>
              <Link href="/admin/products" className="text-xs font-mono text-[#D9A76A] hover:underline">
                Все →
              </Link>
            </div>

            <div className="rounded-2xl bg-[#140E0B] border border-white/10 p-2 divide-y divide-white/5 shadow-xl">
              {popularProducts.map((p) => (
                <Link
                  key={p.id}
                  href={`/admin/products/${p.id}`}
                  className="p-2.5 hover:bg-white/[0.03] rounded-xl transition-colors flex items-center justify-between gap-3 text-xs"
                >
                  <div className="min-w-0">
                    <div className="font-semibold text-white truncate">{p.title}</div>
                    <div className="text-[10px] text-[#8E8276]">{p.category.name}</div>
                  </div>
                  <div className="font-mono font-bold text-[#D9A76A] shrink-0">
                    {Number(p.price).toLocaleString('ru-RU')} ₽
                  </div>
                </Link>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

function ChevronRight({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
