'use client';

import React, { useState } from 'react';
import { Coffee, ChevronDown, Sparkles, SlidersHorizontal, Tag } from 'lucide-react';
import { RoastProfileItem } from '@/lib/types/page-blocks';
import { AdminProduct } from '../BlockEditorClient';

interface RoastGuideEditorProps {
  profiles: RoastProfileItem[];
  allProducts: AdminProduct[];
  onChange: (profiles: RoastProfileItem[]) => void;
}

const DEFAULT_PROFILES: RoastProfileItem[] = [
  {
    levelKey: 'light',
    title: 'Светлая обжарка (Light)',
    badge: 'Для ценителей',
    subtitle: 'Цветы, бергамот и сочные спелые фрукты',
    description: 'Раскрывает истинный терруар и природную сочность кофейной ягоды.',
    flavorNotes: ['Бергамот', 'Жасмин', 'Белый персик', 'Лайм'],
    recommendedBrew: 'V60 воронка, Кемекс, Аэропресс, Фильтр-кофеварка',
    acidity: 5,
    body: 2,
    sweetness: 4,
    bitterness: 1,
    recommendedProductId: null,
  },
  {
    levelKey: 'medium',
    title: 'Средняя обжарка (Medium)',
    badge: 'Хит & Баланс',
    subtitle: 'Карамель, молочный шоколад и баланс',
    description: 'Самый гармоничный и универсальный профиль.',
    flavorNotes: ['Молочный шоколад', 'Карамель', 'Красное яблоко', 'Фундук'],
    recommendedBrew: 'Гейзерная кофеварка (Moka), Автоматическая кофемашина, Чашка, Эспрессо',
    acidity: 3,
    body: 4,
    sweetness: 5,
    bitterness: 2,
    recommendedProductId: null,
  },
  {
    levelKey: 'dark',
    title: 'Тёмная обжарка (Dark Espresso)',
    badge: 'Классика',
    subtitle: 'Плотное тело, темный шоколад и какао',
    description: 'Густой, плотный и маслянистый эспрессо-профиль без лишней кислотности.',
    flavorNotes: ['Тёмный шоколад', 'Жареный фундук', 'Патока', 'Какао'],
    recommendedBrew: 'Классический эспрессо, Капучино, Латте, Турка (Джезва)',
    acidity: 1,
    body: 5,
    sweetness: 3,
    bitterness: 4,
    recommendedProductId: null,
  },
];

export function RoastGuideEditor({
  profiles = [],
  allProducts = [],
  onChange,
}: RoastGuideEditorProps) {
  const currentProfiles = profiles && profiles.length === 3 ? profiles : DEFAULT_PROFILES;
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const updateProfile = (index: number, patch: Partial<RoastProfileItem>) => {
    const updated = currentProfiles.map((p, i) => (i === index ? { ...p, ...patch } : p));
    onChange(updated);
  };

  return (
    <div className="space-y-3 p-4 rounded-2xl bg-white/[0.02] border border-white/10">
      <div className="flex items-center justify-between pb-1 border-b border-white/5">
        <label className="text-xs font-mono font-bold uppercase tracking-wider text-[#D9A76A] flex items-center gap-2">
          <Coffee className="h-4 w-4" />
          <span>Профили обжарки (3 уровня)</span>
        </label>
        <span className="text-[10px] font-mono text-[#8E8276]">
          Light • Medium • Dark
        </span>
      </div>

      <div className="space-y-2.5">
        {currentProfiles.map((profile, idx) => {
          const isExpanded = expandedIndex === idx;
          const levelName =
            profile.levelKey === 'light'
              ? 'Светлая обжарка (Light)'
              : profile.levelKey === 'medium'
              ? 'Средняя обжарка (Medium)'
              : 'Тёмная обжарка (Dark Espresso)';

          return (
            <div
              key={profile.levelKey}
              className="rounded-xl border border-white/10 overflow-hidden bg-[#140E0B]"
            >
              {/* Header Toggle */}
              <button
                type="button"
                onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                className="w-full flex items-center justify-between p-3.5 bg-white/[0.02] hover:bg-white/[0.05] transition-colors text-left"
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={`w-3 h-3 rounded-full ${
                      profile.levelKey === 'light'
                        ? 'bg-amber-300'
                        : profile.levelKey === 'medium'
                        ? 'bg-amber-600'
                        : 'bg-amber-950 border border-amber-400/60'
                    }`}
                  />
                  <span className="text-xs font-bold text-white">{levelName}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 text-[#D9A76A] border border-white/10">
                    {profile.badge || 'Бейдж'}
                  </span>
                </div>
                <ChevronDown
                  className={`h-4 w-4 text-[#8E8276] transition-transform duration-200 ${
                    isExpanded ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Body */}
              {isExpanded && (
                <div className="p-4 space-y-4 border-t border-white/5 bg-black/20">
                  {/* Title & Badge */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-[#8E8276]">
                        Заголовок профиля
                      </label>
                      <input
                        type="text"
                        value={profile.title}
                        onChange={(e) => updateProfile(idx, { title: e.target.value })}
                        className="w-full rounded-lg bg-[#1C1410] border border-white/10 py-2 px-2.5 text-xs text-white font-medium"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-[#8E8276]">
                        Шильдик / Бейдж
                      </label>
                      <input
                        type="text"
                        value={profile.badge}
                        onChange={(e) => updateProfile(idx, { badge: e.target.value })}
                        placeholder="Например: Хит & Баланс"
                        className="w-full rounded-lg bg-[#1C1410] border border-white/10 py-2 px-2.5 text-xs text-white"
                      />
                    </div>
                  </div>

                  {/* Subtitle */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-[#8E8276]">
                      Краткое вкусовое направление (подзаголовок)
                    </label>
                    <input
                      type="text"
                      value={profile.subtitle}
                      onChange={(e) => updateProfile(idx, { subtitle: e.target.value })}
                      placeholder="Карамель, молочный шоколад и баланс"
                      className="w-full rounded-lg bg-[#1C1410] border border-white/10 py-2 px-2.5 text-xs text-[#E5CBA8] font-medium"
                    />
                  </div>

                  {/* Description */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-[#8E8276]">
                      Полное описание профиля
                    </label>
                    <textarea
                      rows={2}
                      value={profile.description}
                      onChange={(e) => updateProfile(idx, { description: e.target.value })}
                      className="w-full rounded-lg bg-[#1C1410] border border-white/10 p-2.5 text-xs text-[#C4B9AD] resize-none leading-relaxed"
                    />
                  </div>

                  {/* Flavor Notes (comma-separated editor) */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-[#8E8276] flex items-center gap-1.5">
                      <Tag className="h-3 w-3" />
                      <span>Дескрипторы вкуса (через запятую)</span>
                    </label>
                    <input
                      type="text"
                      value={(profile.flavorNotes || []).join(', ')}
                      onChange={(e) => {
                        const notes = e.target.value
                          .split(',')
                          .map((s) => s.trim())
                          .filter(Boolean);
                        updateProfile(idx, { flavorNotes: notes });
                      }}
                      placeholder="Молочный шоколад, Карамель, Красное яблоко, Фундук"
                      className="w-full rounded-lg bg-[#1C1410] border border-white/10 py-2 px-2.5 text-xs text-white"
                    />
                  </div>

                  {/* Recommended Brew Methods */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-[#8E8276]">
                      Рекомендованные методы заваривания
                    </label>
                    <input
                      type="text"
                      value={profile.recommendedBrew}
                      onChange={(e) => updateProfile(idx, { recommendedBrew: e.target.value })}
                      placeholder="V60 воронка, Кемекс, Аэропресс, Фильтр-кофеварка"
                      className="w-full rounded-lg bg-[#1C1410] border border-white/10 py-2 px-2.5 text-xs text-white"
                    />
                  </div>

                  {/* Sensory Sliders (1 to 5) */}
                  <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 space-y-3">
                    <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#D9A76A] flex items-center gap-1.5">
                      <SlidersHorizontal className="h-3.5 w-3.5" />
                      <span>Сенсорный баланс профиля (шкала 1 – 5)</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {/* Acidity */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px] font-mono">
                          <span className="text-[#C4B9AD]">Кислотность:</span>
                          <span className="text-white font-bold">{profile.acidity}/5</span>
                        </div>
                        <input
                          type="range"
                          min={1}
                          max={5}
                          value={profile.acidity}
                          onChange={(e) => updateProfile(idx, { acidity: Number(e.target.value) })}
                          className="w-full accent-amber-400 cursor-pointer"
                        />
                      </div>

                      {/* Sweetness */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px] font-mono">
                          <span className="text-[#C4B9AD]">Сладость:</span>
                          <span className="text-white font-bold">{profile.sweetness}/5</span>
                        </div>
                        <input
                          type="range"
                          min={1}
                          max={5}
                          value={profile.sweetness}
                          onChange={(e) => updateProfile(idx, { sweetness: Number(e.target.value) })}
                          className="w-full accent-[#B88B58] cursor-pointer"
                        />
                      </div>

                      {/* Body */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px] font-mono">
                          <span className="text-[#C4B9AD]">Плотность:</span>
                          <span className="text-white font-bold">{profile.body}/5</span>
                        </div>
                        <input
                          type="range"
                          min={1}
                          max={5}
                          value={profile.body}
                          onChange={(e) => updateProfile(idx, { body: Number(e.target.value) })}
                          className="w-full accent-orange-500 cursor-pointer"
                        />
                      </div>

                      {/* Bitterness */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px] font-mono">
                          <span className="text-[#C4B9AD]">Горчинка:</span>
                          <span className="text-white font-bold">{profile.bitterness}/5</span>
                        </div>
                        <input
                          type="range"
                          min={1}
                          max={5}
                          value={profile.bitterness}
                          onChange={(e) => updateProfile(idx, { bitterness: Number(e.target.value) })}
                          className="w-full accent-stone-400 cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Recommended Product Link (Relational Product.id) */}
                  <div className="space-y-1.5 p-3 rounded-xl bg-gradient-to-r from-amber-950/20 to-transparent border border-amber-500/20">
                    <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#D9A76A]">
                      Рекомендованный товар (Флагманский лот профиля)
                    </label>
                    <select
                      value={profile.recommendedProductId || ''}
                      onChange={(e) =>
                        updateProfile(idx, {
                          recommendedProductId: e.target.value || null,
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
                      Привязка осуществляется по уникальному ID товара в БД. Изменение URL или названия товара в каталоге не нарушит работу ссылки.
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
