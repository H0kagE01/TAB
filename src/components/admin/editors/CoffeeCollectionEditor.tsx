'use client';

import React, { useState, useMemo } from 'react';
import { LayoutGrid, SlidersHorizontal, Package, Search, Plus, Trash2, ChevronUp, ChevronDown, X } from 'lucide-react';
import { AdminProduct } from '../BlockEditorClient';

interface CoffeeCollectionEditorProps {
  content: Record<string, any>;
  allProducts: AdminProduct[];
  onChange: (field: string, val: any) => void;
}

export function CoffeeCollectionEditor({
  content,
  allProducts = [],
  onChange,
}: CoffeeCollectionEditorProps) {
  const [search, setSearch] = useState('');

  const mode = content?.mode || 'auto';
  const selectedProductIds: string[] = Array.isArray(content?.productIds) ? content.productIds : [];

  // Filter available products for manual picking
  const filteredProducts = useMemo(() => {
    const q = search.toLowerCase().trim();
    return allProducts.filter((p) => {
      const matchQuery = !q || p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
      return matchQuery;
    });
  }, [allProducts, search]);

  const selectedProducts = useMemo(() => {
    return selectedProductIds
      .map((id) => allProducts.find((p) => p.id === id))
      .filter(Boolean) as AdminProduct[];
  }, [selectedProductIds, allProducts]);

  const toggleProduct = (id: string) => {
    if (selectedProductIds.includes(id)) {
      onChange('productIds', selectedProductIds.filter((x) => x !== id));
    } else {
      onChange('productIds', [...selectedProductIds, id]);
    }
  };

  const moveUp = (idx: number) => {
    if (idx === 0) return;
    const next = [...selectedProductIds];
    [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
    onChange('productIds', next);
  };

  const moveDown = (idx: number) => {
    if (idx === selectedProductIds.length - 1) return;
    const next = [...selectedProductIds];
    [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
    onChange('productIds', next);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header & Text Fields */}
      <div className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#D9A76A]">
            Верхний бейдж / Шильдик
          </label>
          <input
            type="text"
            value={content?.badge || ''}
            onChange={(e) => onChange('badge', e.target.value)}
            placeholder="Свежая обжарка в наличии"
            className="w-full rounded-xl bg-[#1C1410] border border-white/10 py-2.5 px-3 text-xs text-white focus:outline-none focus:border-[#D9A76A]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-white">
              Главный заголовок
            </label>
            <input
              type="text"
              value={content?.title || ''}
              onChange={(e) => onChange('title', e.target.value)}
              placeholder="Кофейная коллекция ТАВ"
              className="w-full rounded-xl bg-[#1C1410] border border-white/10 py-2.5 px-3 text-xs font-bold text-white focus:outline-none focus:border-[#D9A76A]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#8E8276]">
              Подзаголовок (опционально)
            </label>
            <input
              type="text"
              value={content?.subtitle || ''}
              onChange={(e) => onChange('subtitle', e.target.value)}
              placeholder="Оставьте пустым или укажите пояснение к сортам..."
              className="w-full rounded-xl bg-[#1C1410] border border-white/10 py-2.5 px-3 text-xs text-[#C4B9AD] focus:outline-none focus:border-[#D9A76A]"
            />
          </div>
        </div>
      </div>

      {/* 2. Roast Tabs Configuration */}
      <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-[#D9A76A]" />
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#D9A76A]">
              Вкладки фильтрации по обжарке
            </span>
          </div>

          <label className="flex items-center gap-2 cursor-pointer text-xs text-[#E5DDD3]">
            <input
              type="checkbox"
              checked={content?.showTabs !== false}
              onChange={(e) => onChange('showTabs', e.target.checked)}
              className="rounded accent-[#D9A76A]"
            />
            <span>Показывать переключатель обжарки</span>
          </label>
        </div>

        {content?.showTabs !== false && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-[#8E8276]">Таб 1 (Все)</span>
              <input
                type="text"
                value={content?.tabAllLabel || ''}
                onChange={(e) => onChange('tabAllLabel', e.target.value)}
                placeholder="Все сорта"
                className="w-full rounded-lg bg-[#1C1410] border border-white/10 py-1.5 px-2.5 text-xs text-white"
              />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-[#8E8276]">Таб 2 (Светлая)</span>
              <input
                type="text"
                value={content?.tabLightLabel || ''}
                onChange={(e) => onChange('tabLightLabel', e.target.value)}
                placeholder="Светлая"
                className="w-full rounded-lg bg-[#1C1410] border border-white/10 py-1.5 px-2.5 text-xs text-white"
              />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-[#8E8276]">Таб 3 (Средняя)</span>
              <input
                type="text"
                value={content?.tabMediumLabel || ''}
                onChange={(e) => onChange('tabMediumLabel', e.target.value)}
                placeholder="Средняя"
                className="w-full rounded-lg bg-[#1C1410] border border-white/10 py-1.5 px-2.5 text-xs text-white"
              />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-[#8E8276]">Таб 4 (Тёмная)</span>
              <input
                type="text"
                value={content?.tabDarkLabel || ''}
                onChange={(e) => onChange('tabDarkLabel', e.target.value)}
                placeholder="Тёмная"
                className="w-full rounded-lg bg-[#1C1410] border border-white/10 py-1.5 px-2.5 text-xs text-white"
              />
            </div>
          </div>
        )}
      </div>

      {/* 3. Product Selection & Display Options */}
      <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-[#D9A76A]" />
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#D9A76A]">
              Товары в коллекции
            </span>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-[#140E0B] border border-white/10 text-xs">
            <button
              type="button"
              onClick={() => onChange('mode', 'auto')}
              className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                mode === 'auto'
                  ? 'bg-[#D9A76A] text-[#0E0A08] shadow'
                  : 'text-[#8E8276] hover:text-white'
              }`}
            >
              Авто-режим (Все сорта)
            </button>
            <button
              type="button"
              onClick={() => onChange('mode', 'manual')}
              className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                mode === 'manual'
                  ? 'bg-[#D9A76A] text-[#0E0A08] shadow'
                  : 'text-[#8E8276] hover:text-white'
              }`}
            >
              Ручной выбор ({selectedProducts.length})
            </button>
          </div>
        </div>

        {/* Display Limits & Sort in Auto Mode */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-[#8E8276]">Максимум карточек (Лимит)</span>
            <select
              value={content?.limit || 0}
              onChange={(e) => onChange('limit', Number(e.target.value))}
              className="w-full rounded-lg bg-[#1C1410] border border-white/10 py-2 px-2.5 text-xs text-white"
            >
              <option value={0}>Все доступные сорта (без ограничений)</option>
              <option value={4}>4 товара</option>
              <option value={8}>8 товаров</option>
              <option value={12}>12 товаров</option>
              <option value={16}>16 товаров</option>
            </select>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-mono text-[#8E8276]">Сортировка товаров</span>
            <select
              value={content?.sortBy || 'default'}
              onChange={(e) => onChange('sortBy', e.target.value)}
              className="w-full rounded-lg bg-[#1C1410] border border-white/10 py-2 px-2.5 text-xs text-white"
            >
              <option value="default">По умолчанию (как в каталоге)</option>
              <option value="popular">Сначала популярные (isPopular)</option>
              <option value="new">Сначала новинки (isNew)</option>
              <option value="price_asc">По возрастанию цены</option>
              <option value="price_desc">По убыванию цены</option>
            </select>
          </div>
        </div>

        {/* Manual Product Selection Panel */}
        {mode === 'manual' && (
          <div className="space-y-4 pt-2 border-t border-white/10">
            {/* Selected Products List with reordering */}
            {selectedProducts.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono text-[#D9A76A]">
                  <span>Выбранные сорта ({selectedProducts.length})</span>
                  <button
                    type="button"
                    onClick={() => onChange('productIds', [])}
                    className="text-[#8E8276] hover:text-red-400 text-[10px]"
                  >
                    Очистить всё
                  </button>
                </div>

                <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
                  {selectedProducts.map((p, idx) => (
                    <div
                      key={p.id}
                      className="flex items-center justify-between gap-2 p-2 rounded-xl bg-[#1C1410] border border-white/10"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-xs font-mono text-[#D9A76A] w-5 text-center">
                          {idx + 1}
                        </span>
                        {p.images?.[0] ? (
                          <img
                            src={p.images[0]}
                            alt={p.title}
                            className="w-8 h-8 rounded-lg object-cover bg-black"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-xs">
                            ☕
                          </div>
                        )}
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-white truncate">{p.title}</div>
                          <div className="text-[10px] text-[#8E8276]">
                            {p.category} • {p.price} ₽
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => moveUp(idx)}
                          disabled={idx === 0}
                          className="p-1 rounded text-[#8E8276] hover:text-white disabled:opacity-20 cursor-pointer"
                          title="Выше"
                        >
                          <ChevronUp className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveDown(idx)}
                          disabled={idx === selectedProducts.length - 1}
                          className="p-1 rounded text-[#8E8276] hover:text-white disabled:opacity-20 cursor-pointer"
                          title="Ниже"
                        >
                          <ChevronDown className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleProduct(p.id)}
                          className="p-1 rounded text-[#8E8276] hover:text-red-400 cursor-pointer"
                          title="Удалить"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Product Picker Search & List */}
            <div className="space-y-2 pt-1">
              <span className="text-[10px] font-mono text-[#8E8276] block">
                Добавить сорт из базы товаров:
              </span>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#8E8276]" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Поиск товара по названию или категории..."
                  className="w-full rounded-xl bg-black/40 border border-white/10 pl-9 pr-3 py-2 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                {filteredProducts.map((p) => {
                  const isSelected = selectedProductIds.includes(p.id);
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => toggleProduct(p.id)}
                      className={`p-2 rounded-xl border text-left flex items-center justify-between gap-2 transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#D9A76A]/15 border-[#D9A76A] text-white'
                          : 'bg-[#1C1410] border-white/5 text-[#C4B9AD] hover:border-white/15'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        {p.images?.[0] ? (
                          <img
                            src={p.images[0]}
                            alt={p.title}
                            className="w-7 h-7 rounded-lg object-cover bg-black"
                          />
                        ) : (
                          <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-xs">
                            ☕
                          </div>
                        )}
                        <div className="min-w-0">
                          <div className="text-xs font-semibold truncate text-white">{p.title}</div>
                          <div className="text-[10px] text-[#8E8276]">{p.price} ₽</div>
                        </div>
                      </div>

                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded-md shrink-0 ${
                          isSelected
                            ? 'bg-[#D9A76A] text-[#0E0A08] font-bold'
                            : 'bg-white/5 text-[#8E8276]'
                        }`}
                      >
                        {isSelected ? '✓ Выбран' : '+ Добавить'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 4. Bottom Button / CTA Settings */}
      <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#D9A76A]">
            Кнопка под каталогом (CTA)
          </span>
          <label className="flex items-center gap-2 cursor-pointer text-xs text-[#E5DDD3]">
            <input
              type="checkbox"
              checked={content?.showButton === true}
              onChange={(e) => onChange('showButton', e.target.checked)}
              className="rounded accent-[#D9A76A]"
            />
            <span>Показывать кнопку перехода в каталог</span>
          </label>
        </div>

        {content?.showButton && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-[#8E8276]">Текст кнопки</span>
              <input
                type="text"
                value={content?.buttonLabel || ''}
                onChange={(e) => onChange('buttonLabel', e.target.value)}
                placeholder="Смотреть весь каталог кофе"
                className="w-full rounded-lg bg-[#1C1410] border border-white/10 py-2 px-2.5 text-xs text-white"
              />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-[#8E8276]">Ссылка кнопки</span>
              <input
                type="text"
                value={content?.buttonHref || ''}
                onChange={(e) => onChange('buttonHref', e.target.value)}
                placeholder="/catalog"
                className="w-full rounded-lg bg-[#1C1410] border border-white/10 py-2 px-2.5 text-xs font-mono text-[#8E8276]"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
