'use client';

import React, { useState } from 'react';
import {
  Globe,
  ChevronDown,
  Plus,
  Trash2,
  ChevronUp,
  Image as ImageIcon,
  Tag,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';
import { TerroirItem } from '@/lib/types/page-blocks';
import { AdminProduct } from '../BlockEditorClient';
import { ImageUpload } from '../ImageUpload';

export interface AdminCountry {
  id: string;
  name: string;
  code: string;
  flagEmoji?: string | null;
}

interface TerroirAtlasEditorProps {
  items: TerroirItem[];
  allCountries: AdminCountry[];
  allProducts: AdminProduct[];
  onChange: (items: TerroirItem[]) => void;
}

export function TerroirAtlasEditor({
  items = [],
  allCountries = [],
  allProducts = [],
  onChange,
}: TerroirAtlasEditorProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const updateItem = (index: number, patch: Partial<TerroirItem>) => {
    const updated = items.map((it, i) => (i === index ? { ...it, ...patch } : it));
    onChange(updated);
  };

  const addItem = () => {
    const defaultCountry = allCountries[0];
    const newItem: TerroirItem = {
      id: `terroir-${Date.now()}`,
      countryId: defaultCountry?.id || '',
      region: 'Новый регион',
      continent: 'Восточная Африка',
      altitude: '1800 – 2000 м',
      process: 'Мытая обработка (Washed)',
      sommelierNotes: 'Описание терруара и вкусового профиля.',
      flavorNotes: ['Цитрус', 'Цветы', 'Карамель'],
      imageUrl: 'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?q=80&w=1200&auto=format&fit=crop',
      productId: null,
      order: items.length + 1,
      isActive: true,
    };
    onChange([...items, newItem]);
    setExpandedIndex(items.length);
  };

  const removeItem = (index: number) => {
    const filtered = items.filter((_, i) => i !== index);
    onChange(filtered);
    if (expandedIndex === index) setExpandedIndex(null);
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;
    const reordered = [...items];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(targetIndex, 0, moved);
    onChange(reordered.map((it, idx) => ({ ...it, order: idx + 1 })));
    setExpandedIndex(targetIndex);
  };

  return (
    <div className="space-y-3 p-4 rounded-2xl bg-white/[0.02] border border-white/10">
      <div className="flex items-center justify-between pb-1 border-b border-white/5">
        <label className="text-xs font-mono font-bold uppercase tracking-wider text-[#D9A76A] flex items-center gap-2">
          <Globe className="h-4 w-4" />
          <span>Карточки терруаров ({items.length})</span>
        </label>
        <button
          type="button"
          onClick={addItem}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#D9A76A]/20 hover:bg-[#D9A76A]/30 text-[#E5CBA8] text-xs font-bold transition-all border border-[#D9A76A]/40 cursor-pointer active:scale-95"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Добавить терруар</span>
        </button>
      </div>

      <div className="space-y-2.5">
        {items.map((item, idx) => {
          const isExpanded = expandedIndex === idx;
          const country = allCountries.find((c) => c.id === item.countryId);
          const product = allProducts.find((p) => p.id === item.productId);

          return (
            <div
              key={item.id || idx}
              className={`rounded-xl border transition-all overflow-hidden ${
                item.isActive !== false
                  ? 'border-white/10 bg-[#140E0B]'
                  : 'border-white/5 bg-[#100B09]/50 opacity-60'
              }`}
            >
              {/* Header Bar */}
              <div className="flex items-center justify-between p-3 bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
                <button
                  type="button"
                  onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                  className="flex items-center gap-2.5 flex-1 text-left min-w-0"
                >
                  <span className="text-base flex-shrink-0">
                    {country?.flagEmoji || '🌍'}
                  </span>
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-xs font-bold text-white">
                      {country?.name || item.region || `Терруар ${idx + 1}`}
                    </span>
                    <span className="text-[10px] font-mono text-[#8E8276] truncate">
                      ({item.region})
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 text-[#D9A76A] border border-white/10 hidden sm:inline">
                      {item.altitude}
                    </span>
                  </div>
                </button>

                {/* Actions: Move, Toggle Active, Delete */}
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => moveItem(idx, 'up')}
                    className="p-1 rounded hover:bg-white/10 text-[#8E8276] hover:text-white disabled:opacity-20 cursor-pointer"
                    title="Поднять выше"
                  >
                    <ChevronUp className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    disabled={idx === items.length - 1}
                    onClick={() => moveItem(idx, 'down')}
                    className="p-1 rounded hover:bg-white/10 text-[#8E8276] hover:text-white disabled:opacity-20 cursor-pointer"
                    title="Опустить ниже"
                  >
                    <ChevronDown className="h-3.5 w-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => updateItem(idx, { isActive: item.isActive === false })}
                    className="p-1 rounded text-stone-400 hover:text-white cursor-pointer"
                    title={item.isActive !== false ? 'Активен' : 'Скрыт'}
                  >
                    {item.isActive !== false ? (
                      <ToggleRight className="h-4 w-4 text-emerald-400" />
                    ) : (
                      <ToggleLeft className="h-4 w-4 text-stone-600" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => removeItem(idx)}
                    className="p-1 rounded hover:bg-red-500/20 text-[#8E8276] hover:text-red-400 cursor-pointer transition-colors"
                    title="Удалить карточку"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Body */}
              {isExpanded && (
                <div className="p-4 space-y-4 border-t border-white/5 bg-black/20">
                  {/* Country & Region */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-[#D9A76A]">
                        Страна происхождения (Связь с Country в БД)
                      </label>
                      <select
                        value={item.countryId}
                        onChange={(e) => updateItem(idx, { countryId: e.target.value })}
                        className="w-full rounded-lg bg-[#1C1410] border border-white/10 py-2 px-2.5 text-xs text-white focus:outline-none focus:border-[#D9A76A]"
                      >
                        <option value="">-- Выберите страну --</option>
                        {allCountries.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.flagEmoji ? `${c.flagEmoji} ` : ''}
                            {c.name} ({c.code})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-[#8E8276]">
                        Регион произрастания
                      </label>
                      <input
                        type="text"
                        value={item.region}
                        onChange={(e) => updateItem(idx, { region: e.target.value })}
                        placeholder="Например: Иргачиф (Yirgacheffe)"
                        className="w-full rounded-lg bg-[#1C1410] border border-white/10 py-2 px-2.5 text-xs text-white"
                      />
                    </div>
                  </div>

                  {/* Continent, Altitude, Process */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-[#8E8276]">
                        Континент / Часть света
                      </label>
                      <input
                        type="text"
                        value={item.continent}
                        onChange={(e) => updateItem(idx, { continent: e.target.value })}
                        placeholder="Восточная Африка"
                        className="w-full rounded-lg bg-[#1C1410] border border-white/10 py-2 px-2.5 text-xs text-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-[#8E8276]">
                        Высота произрастания
                      </label>
                      <input
                        type="text"
                        value={item.altitude}
                        onChange={(e) => updateItem(idx, { altitude: e.target.value })}
                        placeholder="1900 – 2200 м"
                        className="w-full rounded-lg bg-[#1C1410] border border-white/10 py-2 px-2.5 text-xs text-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-[#8E8276]">
                        Способ обработки
                      </label>
                      <input
                        type="text"
                        value={item.process}
                        onChange={(e) => updateItem(idx, { process: e.target.value })}
                        placeholder="Мытая обработка (Washed)"
                        className="w-full rounded-lg bg-[#1C1410] border border-white/10 py-2 px-2.5 text-xs text-white"
                      />
                    </div>
                  </div>

                  {/* Sommelier Notes */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-[#8E8276]">
                      Заметка шеф-сомелье ТАВ
                    </label>
                    <textarea
                      rows={2}
                      value={item.sommelierNotes}
                      onChange={(e) => updateItem(idx, { sommelierNotes: e.target.value })}
                      className="w-full rounded-lg bg-[#1C1410] border border-white/10 p-2.5 text-xs text-[#C4B9AD] resize-none leading-relaxed"
                    />
                  </div>

                  {/* Flavor Descriptors */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-[#8E8276] flex items-center gap-1.5">
                      <Tag className="h-3 w-3" />
                      <span>Дескрипторы вкуса (через запятую)</span>
                    </label>
                    <input
                      type="text"
                      value={(item.flavorNotes || []).join(', ')}
                      onChange={(e) => {
                        const notes = e.target.value
                          .split(',')
                          .map((s) => s.trim())
                          .filter(Boolean);
                        updateItem(idx, { flavorNotes: notes });
                      }}
                      placeholder="Бергамот, Жасмин, Белый персик, Лайм"
                      className="w-full rounded-lg bg-[#1C1410] border border-white/10 py-2 px-2.5 text-xs text-white"
                    />
                  </div>

                  {/* Image Upload & Preview */}
                  <ImageUpload
                    value={item.imageUrl}
                    onChange={(url) => updateItem(idx, { imageUrl: url })}
                    label="Фоновое изображение терруара"
                    placeholder="https://images.unsplash.com/..."
                    aspectRatio="wide"
                    compact
                  />

                  {/* Associated Product (Relational Product.id) */}
                  <div className="space-y-1.5 p-3 rounded-xl bg-gradient-to-r from-amber-950/20 to-transparent border border-amber-500/20">
                    <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#D9A76A]">
                      Привязанный сорт в каталоге (Кнопка «Смотреть сорт»)
                    </label>
                    <select
                      value={item.productId || ''}
                      onChange={(e) =>
                        updateItem(idx, {
                          productId: e.target.value || null,
                        })
                      }
                      className="w-full rounded-lg bg-[#1C1410] border border-white/10 py-2 px-2.5 text-xs text-white focus:outline-none focus:border-[#D9A76A]"
                    >
                      <option value="">-- Не привязан (по умолчанию) --</option>
                      {allProducts.map((prod) => (
                        <option key={prod.id} value={prod.id}>
                          {prod.title} ({prod.price} ₽) {prod.inStock ? '' : '— нет в наличии'}
                        </option>
                      ))}
                    </select>
                    <p className="text-[10px] font-mono text-[#8E8276]">
                      Привязка сохраняется по ID товара. Вы можете переименовывать товар в каталоге без риска поломать ссылку.
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
