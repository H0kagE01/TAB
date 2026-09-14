'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Coffee,
  Plus,
  Search,
  Edit2,
  Trash2,
  ExternalLink,
  Check,
  X,
  Sparkles,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface AdminProductRow {
  id: string;
  slug: string;
  title: string;
  categoryId: string;
  categoryName: string;
  brandName: string | null;
  countryName: string | null;
  flagEmoji: string | null;
  price: number;
  oldPrice: number | null;
  inStock: boolean;
  isNew: boolean;
  isPopular: boolean;
  isFeatured: boolean;
  images: string[];
  roastLevel: string | null;
  variety: string | null;
  qScore: number | null;
}

export function ProductsManagerClient({
  initialProducts,
  categories,
}: {
  initialProducts: AdminProductRow[];
  categories: any[];
  brands: any[];
  countries: any[];
}) {
  const [products, setProducts] = useState<AdminProductRow[]>(initialProducts);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  // Toggle inStock — uses PATCH to update only the inStock field
  // (PUT would require brandId/countryId which AdminProductRow doesn't carry)
  const toggleStock = async (product: AdminProductRow) => {
    const updated = !product.inStock;
    setProducts((prev) =>
      prev.map((p) => (p.id === product.id ? { ...p, inStock: updated } : p))
    );

    try {
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inStock: updated }),
      });
      if (!res.ok) throw new Error();
      showToast('success', updated ? 'Товар отмечен «В наличии»' : 'Товар отмечен «Нет в наличии»');
    } catch {
      // Revert optimistic update on error
      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? { ...p, inStock: product.inStock } : p))
      );
      showToast('error', 'Не удалось обновить наличие');
    }
  };

  // Delete product
  const handleDelete = async (productId: string, title: string) => {
    if (!confirm(`Вы уверены, что хотите удалить товар «${title}»?`)) return;

    try {
      const res = await fetch(`/api/admin/products/${productId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();

      setProducts((prev) => prev.filter((p) => p.id !== productId));
      showToast('success', `Товар «${title}» удален`);
    } catch {
      showToast('error', 'Ошибка при удалении товара');
    }
  };

  // Filtered
  const filteredProducts = products.filter((p) => {
    const matchesCat = selectedCategory === 'all' || p.categoryId === selectedCategory;
    const q = search.toLowerCase().trim();
    const matchesSearch =
      !q ||
      p.title.toLowerCase().includes(q) ||
      (p.variety && p.variety.toLowerCase().includes(q)) ||
      (p.countryName && p.countryName.toLowerCase().includes(q));

    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-5 duration-200">
          <div
            className={cn(
              'px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-xs font-semibold backdrop-blur-xl border',
              toast.type === 'success'
                ? 'bg-emerald-950/90 text-emerald-300 border-emerald-500/30'
                : 'bg-rose-950/90 text-rose-300 border-rose-500/30'
            )}
          >
            {toast.type === 'success' ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            ) : (
              <AlertCircle className="h-4 w-4 text-rose-400" />
            )}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-[#D9A76A]">
            <Coffee className="h-3.5 w-3.5" />
            <span>Каталог ТАВ</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-serif text-white mt-1">
            Управление товарами
          </h1>
          <p className="text-xs text-[#8E8276] mt-1">
            Всего позиций: {products.length} • Отображается: {filteredProducts.length}
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-[#C2905A] via-[#D9A76A] to-[#E5CBA8] hover:brightness-105 active:scale-95 text-[#0E0A08] text-xs font-bold transition-all shadow-[0_0_20px_rgba(217,167,106,0.35)] cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Добавить новый товар</span>
        </Link>
      </div>

      {/* Filters & Search Row */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8E8276]" />
          <input
            type="text"
            placeholder="Поиск по названию, сорту, стране..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl bg-[#140E0B] border border-white/10 py-2.5 pl-10 pr-4 text-xs text-white placeholder:text-stone-600 focus:outline-none focus:border-[#D9A76A]"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          <button
            onClick={() => setSelectedCategory('all')}
            className={cn(
              'px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer',
              selectedCategory === 'all'
                ? 'bg-[#D9A76A] text-[#0E0A08] font-bold'
                : 'bg-[#140E0B] border border-white/10 text-[#C4B9AD] hover:text-white'
            )}
          >
            Все ({products.length})
          </button>
          {categories.map((cat) => {
            const count = products.filter((p) => p.categoryId === cat.id).length;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={cn(
                  'px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer',
                  selectedCategory === cat.id
                    ? 'bg-[#D9A76A] text-[#0E0A08] font-bold'
                    : 'bg-[#140E0B] border border-white/10 text-[#C4B9AD] hover:text-white'
                )}
              >
                {cat.name} ({count})
              </button>
            );
          })}
        </div>

      </div>

      {/* Products Table */}
      <div className="rounded-2xl bg-[#140E0B] border border-white/10 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#1B120E] text-[10px] font-mono uppercase tracking-wider text-[#8E8276] border-b border-white/10">
              <tr>
                <th className="p-4">Товар</th>
                <th className="p-4">Категория</th>
                <th className="p-4">Страна & Грейдинг</th>
                <th className="p-4">Цена</th>
                <th className="p-4 text-center">Наличие</th>
                <th className="p-4 text-right">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-[#C4B9AD]">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-xs text-[#8E8276]">
                    Товары не найдены.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-white/[0.02] transition-colors">
                    
                    {/* Image & Title */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-[#1A120D] border border-white/10 shrink-0">
                          {product.images && product.images[0] && product.images[0].trim() ? (
                            <Image
                              src={product.images[0]}
                              alt={product.title}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[#D9A76A]/40">
                              <Coffee className="h-5 w-5" />
                            </div>
                          )}
                        </div>

                        <div className="min-w-0 space-y-0.5">
                          <Link
                            href={`/admin/products/${product.id}`}
                            className="font-bold text-white hover:text-[#D9A76A] transition-colors truncate block text-sm font-serif"
                          >
                            {product.title}
                          </Link>
                          {product.variety && (
                            <div className="text-[11px] text-[#8E8276] truncate">
                              {product.variety}
                            </div>
                          )}
                          <div className="flex items-center gap-1.5 pt-0.5">
                            {product.isNew && (
                              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                                NEW
                              </span>
                            )}
                            {product.isPopular && (
                              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-amber-500/20 text-[#D9A76A] border border-amber-500/30">
                                HIT
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/10 text-xs text-white">
                        {product.categoryName}
                      </span>
                    </td>

                    {/* Country & SCA Score */}
                    <td className="p-4 space-y-1">
                      {product.countryName && (
                        <div className="flex items-center gap-1.5 text-xs text-white">
                          <span>{product.flagEmoji}</span>
                          <span>{product.countryName}</span>
                        </div>
                      )}
                      {product.qScore && (
                        <div className="text-[11px] font-mono text-[#D9A76A]">
                          SCA: {product.qScore}
                        </div>
                      )}
                    </td>

                    {/* Price */}
                    <td className="p-4">
                      <div className="font-mono font-bold text-white text-sm">
                        {product.price.toLocaleString('ru-RU')} ₽
                      </div>
                      {product.oldPrice && (
                        <div className="text-[10px] text-stone-500 line-through font-mono">
                          {product.oldPrice.toLocaleString('ru-RU')} ₽
                        </div>
                      )}
                    </td>

                    {/* In Stock Toggle */}
                    <td className="p-4 text-center">
                      <button
                        onClick={() => toggleStock(product)}
                        className={cn(
                          'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-bold transition-all cursor-pointer border',
                          product.inStock
                            ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/25'
                            : 'bg-rose-500/15 border-rose-500/30 text-rose-400 hover:bg-rose-500/25'
                        )}
                        title="Нажмите, чтобы изменить наличие"
                      >
                        <span className={cn('w-1.5 h-1.5 rounded-full', product.inStock ? 'bg-emerald-400' : 'bg-rose-400')} />
                        <span>{product.inStock ? 'В наличии' : 'Нет'}</span>
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <a
                          href={`/product/${product.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-stone-400 hover:text-white transition-colors"
                          title="Открыть на сайте"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>

                        <Link
                          href={`/admin/products/${product.id}`}
                          className="p-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-[#D9A76A] hover:bg-amber-500/20 transition-colors"
                          title="Редактировать"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </Link>

                        <button
                          onClick={() => handleDelete(product.id, product.title)}
                          className="p-2 rounded-lg bg-white/[0.04] hover:bg-rose-950/40 text-stone-400 hover:text-rose-400 transition-colors cursor-pointer"
                          title="Удалить"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
