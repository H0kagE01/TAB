import React from 'react';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import {
  Layers,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Search,
  Eye,
} from 'lucide-react';

import { mockPages } from '@/lib/mock-data/pages';

export const dynamic = 'force-dynamic';

export default async function AdminPagesListPage() {
  let pages: any[] = mockPages;

  try {
    const dbPages = await prisma.page.findMany({
      orderBy: { slug: 'asc' },
      include: {
        blocks: {
          orderBy: { order: 'asc' },
        },
      },
    });
    if (dbPages && dbPages.length > 0) {
      pages = dbPages;
    }
  } catch (err) {
    console.warn('DB unavailable in AdminPagesListPage, using mock fallback:', err);
  }

  const pageIcons: Record<string, string> = {
    home: '🏠',
    about: '✨',
    coffee: '☕',
    contacts: '📍',
    privacy: '📜',
  };

  return (
    <div className="space-y-7">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-[#D9A76A]">
            <Layers className="h-3.5 w-3.5" />
            <span>Конструктор контента</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-serif text-white mt-1">
            Страницы и Блоки сайта
          </h1>
          <p className="text-xs text-[#8E8276] mt-1">
            Выберите страницу, чтобы редактировать любые блоки, тексты, картинки и SEO
          </p>
        </div>
      </div>

      {/* Pages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {pages.map((page) => {
          const publicUrl = page.slug === 'home' ? '/' : `/${page.slug}`;
          const activeBlocksCount = page.blocks.filter((b: any) => b.isActive).length;

          return (
            <div
              key={page.id}
              className="rounded-3xl bg-[#140E0B] border border-white/10 hover:border-[#D9A76A]/40 transition-all duration-300 p-6 flex flex-col justify-between space-y-6 shadow-xl group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-3xl">{pageIcons[page.slug] || '📄'}</span>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-[#D9A76A] text-[11px] font-mono font-bold">
                      {activeBlocksCount} / {page.blocks.length} блоков
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono">
                      Опубликована
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="text-lg font-bold font-serif text-white group-hover:text-[#E5CBA8] transition-colors">
                    {page.title}
                  </h3>
                  <div className="text-xs font-mono text-[#8E8276]">
                    URL: <span className="text-[#C4B9AD]">{publicUrl}</span>
                  </div>
                </div>

                {/* Blocks preview pills */}
                <div className="space-y-1.5 pt-2">
                  <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#8E8276]">
                    Секции на странице:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {page.blocks.map((b: any) => (
                      <span
                        key={b.id}
                        className={`text-[10px] px-2 py-0.5 rounded-md border ${
                          b.isActive
                            ? 'bg-white/[0.04] border-white/10 text-[#C4B9AD]'
                            : 'bg-white/[0.01] border-white/5 text-stone-600 line-through'
                        }`}
                      >
                        {b.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3">
                <a
                  href={publicUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-[#8E8276] hover:text-white transition-colors"
                  title="Посмотреть на сайте"
                >
                  <Eye className="h-4 w-4" />
                </a>

                <Link
                  href={`/admin/pages/${page.slug}`}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#D9A76A] hover:bg-[#E5CBA8] text-[#0E0A08] text-xs font-bold transition-all shadow active:scale-95 text-center"
                >
                  <span>Редактировать блоки</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
