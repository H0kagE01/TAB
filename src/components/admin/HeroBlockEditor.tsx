'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Star,
  ExternalLink,
  Plus,
  Minus,
  Coffee,
  Loader2,
  AlertCircle,
  Info,
} from 'lucide-react';

interface AdminProduct {
  id: string;
  title: string;
  price: number;
  inStock: boolean;
  isFeatured: boolean;
  isPopular: boolean;
  category: { name: string; slug: string } | null;
  images: string[];
}

export function HeroBlockEditor() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toggling, setToggling] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/products');
      if (!res.ok) throw new Error('Не удалось загрузить товары');
      const data = await res.json();
      setProducts(data.products || []);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const toggleFeatured = async (product: AdminProduct) => {
    setToggling(product.id);
    try {
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFeatured: !product.isFeatured }),
      });
      if (!res.ok) throw new Error('Ошибка обновления');
      setProducts((prev) =>
        prev.map((p) =>
          p.id === product.id ? { ...p, isFeatured: !p.isFeatured } : p
        )
      );
    } catch {
      // silent
    } finally {
      setToggling(null);
    }
  };

  const featuredProducts = products.filter((p) => p.isFeatured);
  const otherProducts = products.filter((p) => !p.isFeatured);

  if (loading) {
    return (
      <div className="flex items-center gap-2 py-6 text-[#8E8276] text-xs">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>Загрузка товаров...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 py-4 text-rose-400 text-xs">
        <AlertCircle className="h-4 w-4" />
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div className="space-y-5">

      {/* Info banner */}
      <div className="flex items-start gap-3 p-3.5 rounded-xl bg-amber-500/8 border border-amber-500/20 text-xs text-[#E5CBA8]">
        <Info className="h-4 w-4 text-[#D9A76A] flex-shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <p className="font-semibold">Карусель Hero управляется через список товаров</p>
          <p className="text-[#A89D91] leading-relaxed">
            Товары, отмеченные как «Избранные», автоматически появляются в Hero-карусели на главной.
            Рекомендуется держать 3–5 товаров. Порядок определяется полем «Порядок» в редакторе товара.
          </p>
        </div>
      </div>

      {/* Featured products — shown in hero */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#D9A76A]">
            В карусели Hero ({featuredProducts.length})
          </span>
          {featuredProducts.length === 0 && (
            <span className="text-[10px] text-rose-400 font-mono">Добавьте хотя бы 1 товар</span>
          )}
        </div>

        {featuredProducts.length === 0 ? (
          <div className="py-6 rounded-xl border border-dashed border-white/10 flex flex-col items-center gap-2 text-[#8E8276]">
            <Coffee className="h-8 w-8 opacity-30" />
            <p className="text-xs">Нет избранных товаров. Добавьте ниже.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {featuredProducts.map((product) => (
              <div
                key={product.id}
                className="flex items-center gap-3 p-3 rounded-xl bg-amber-500/5 border border-amber-500/20"
              >
                {/* Thumbnail */}
                <div className="h-10 w-10 rounded-lg overflow-hidden bg-[#1C1410] border border-white/10 flex-shrink-0">
                  {product.images[0] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={product.images[0]} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <Coffee className="h-5 w-5 m-auto mt-2.5 text-[#8E8276]" />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-white truncate">{product.title}</p>
                  <p className="text-[10px] text-[#8E8276]">
                    {product.category?.name} · {product.price} ₽
                    {!product.inStock && <span className="text-rose-400 ml-1">· Нет в наличии</span>}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <Link
                    href={`/admin/products/${product.id}`}
                    target="_blank"
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[#8E8276] hover:text-white transition-colors"
                    title="Редактировать товар"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Link>
                  <button
                    type="button"
                    onClick={() => toggleFeatured(product)}
                    disabled={toggling === product.id}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/20 text-rose-400 text-[10px] font-semibold transition-all disabled:opacity-50 cursor-pointer"
                    title="Убрать из Hero"
                  >
                    {toggling === product.id ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <Minus className="h-3 w-3" />
                    )}
                    <span>Убрать</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="border-t border-white/5" />

      {/* Other products — not in hero */}
      <div className="space-y-2">
        <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#8E8276]">
          Добавить в карусель ({otherProducts.length} товаров)
        </span>
        <div className="space-y-1.5 max-h-[360px] overflow-y-auto pr-1 custom-scrollbar">
          {otherProducts.map((product) => (
            <div
              key={product.id}
              className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors"
            >
              {/* Thumbnail */}
              <div className="h-8 w-8 rounded-lg overflow-hidden bg-[#1C1410] border border-white/8 flex-shrink-0">
                {product.images[0] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={product.images[0]} alt="" className="h-full w-full object-cover" />
                ) : (
                  <Coffee className="h-4 w-4 m-auto mt-2 text-[#8E8276]" />
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-medium text-[#C4B9AD] truncate">{product.title}</p>
                <p className="text-[9px] text-[#8E8276]">
                  {product.category?.name} · {product.price} ₽
                </p>
              </div>

              {/* Add button */}
              <button
                type="button"
                onClick={() => toggleFeatured(product)}
                disabled={toggling === product.id}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-[#D9A76A] text-[10px] font-semibold transition-all disabled:opacity-50 cursor-pointer flex-shrink-0"
                title="Добавить в Hero"
              >
                {toggling === product.id ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <Plus className="h-3 w-3" />
                )}
                <span>В Hero</span>
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
