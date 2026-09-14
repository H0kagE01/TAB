'use client';

import React from 'react';
import { Compass, Sparkles, Clock, Layers, Plus, Trash2 } from 'lucide-react';

const DEFAULT_GRIND_METHODS = [
  {
    number: '01',
    title: 'Турка (Джезва)',
    subtitle: 'Экстра-тонкий (пыль)',
    fraction: '≈ 0.1 мм',
    desc: 'Помол в нежнейшую пудру для плотного напитка с густой бархатистой пенкой.',
    time: '2–3 мин',
  },
  {
    number: '02',
    title: 'Эспрессо',
    subtitle: 'Тонкий калиброванный',
    fraction: '≈ 0.3 мм',
    desc: 'Фракция под давление 9 бар рожковой или автоматической кофемашины.',
    time: '25–30 сек',
  },
  {
    number: '03',
    title: 'Гейзер (Moka)',
    subtitle: 'Средне-тонкий помол',
    fraction: '≈ 0.5 мм',
    desc: 'Размер песчинок тростникового сахара. Не забивает фильтр гейзера.',
    time: '3–4 мин',
  },
  {
    number: '04',
    title: 'Фильтр & V60',
    subtitle: 'Средний помол',
    fraction: '≈ 0.8 мм',
    desc: 'Для воронки V60, фильтр-кофеварок и кемекса. Раскрывает ягоды и цветы.',
    time: '3–3.5 мин',
  },
  {
    number: '05',
    title: 'Френч-пресс',
    subtitle: 'Крупный помол',
    fraction: '≈ 1.2 мм',
    desc: 'Крупные гранулы для долгого настаивания и Cold Brew без кофейной пыли.',
    time: '4–5 мин',
  },
];

interface GrindingStationEditorProps {
  content: Record<string, any>;
  onChange: (field: string, val: any) => void;
}

export function GrindingStationEditor({
  content,
  onChange,
}: GrindingStationEditorProps) {
  const methods =
    Array.isArray(content?.methods) && content.methods.length > 0
      ? content.methods
      : DEFAULT_GRIND_METHODS;

  const updateMethod = (idx: number, key: string, value: any) => {
    const next = [...methods];
    next[idx] = { ...(next[idx] || {}), [key]: value };
    onChange('methods', next);
  };

  const addMethod = () => {
    const nextNumber = String(methods.length + 1).padStart(2, '0');
    const next = [
      ...methods,
      {
        number: nextNumber,
        title: 'Новый способ',
        subtitle: 'Помол',
        fraction: '≈ 0.6 мм',
        desc: 'Описание помола и экстракции...',
        time: '3 мин',
      },
    ];
    onChange('methods', next);
  };

  const removeMethod = (idx: number) => {
    const next = methods.filter((_, i) => i !== idx);
    onChange('methods', next);
  };

  return (
    <div className="space-y-5">
      {/* 1. Header and Subtitles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#D9A76A]">
            Шильдик / Локация
          </label>
          <input
            type="text"
            value={content?.badge || ''}
            onChange={(e) => onChange('badge', e.target.value)}
            placeholder="Сервис в Майкопе • ул. К.А. Васильева, 2/1"
            className="w-full rounded-xl bg-[#1C1410] border border-white/10 py-2.5 px-3 text-xs text-white focus:outline-none focus:border-[#D9A76A]"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-white">
            Главный заголовок
          </label>
          <input
            type="text"
            value={content?.headline || ''}
            onChange={(e) => onChange('headline', e.target.value)}
            placeholder="Бесплатный помол зерна"
            className="w-full rounded-xl bg-[#1C1410] border border-white/10 py-2.5 px-3 text-xs font-bold text-white focus:outline-none focus:border-[#D9A76A]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#E5CBA8]">
            Курсивный акцент заголовка
          </label>
          <input
            type="text"
            value={content?.headlineHighlight || ''}
            onChange={(e) => onChange('headlineHighlight', e.target.value)}
            placeholder="под ваш способ заваривания"
            className="w-full rounded-xl bg-[#1C1410] border border-white/10 py-2.5 px-3 text-xs text-[#E5CBA8] italic focus:outline-none focus:border-[#D9A76A]"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#8E8276]">
            Текст описания сервиса
          </label>
          <input
            type="text"
            value={content?.description || ''}
            onChange={(e) => onChange('description', e.target.value)}
            placeholder="При покупке любого сорта мы бесплатно смолем зерно..."
            className="w-full rounded-xl bg-[#1C1410] border border-white/10 py-2.5 px-3 text-xs text-[#C4B9AD] focus:outline-none focus:border-[#D9A76A]"
          />
        </div>
      </div>

      {/* 2. Equipment Badges */}
      <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-[#D9A76A]" />
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#D9A76A]">
            Плашки оборудования (справа от заголовка)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3.5 rounded-xl bg-[#1C1410] border border-white/10 space-y-2">
            <span className="text-[10px] font-mono text-[#8E8276] block">Плашка 1 (Жернова)</span>
            <input
              type="text"
              value={content?.feature1?.title || ''}
              onChange={(e) =>
                onChange('feature1', { ...(content?.feature1 || {}), title: e.target.value })
              }
              placeholder="Жернова Fiorenzato"
              className="w-full rounded-lg bg-black/40 border border-white/10 py-1.5 px-2.5 text-xs font-bold text-white focus:outline-none focus:border-[#D9A76A]"
            />
            <input
              type="text"
              value={content?.feature1?.desc || ''}
              onChange={(e) =>
                onChange('feature1', { ...(content?.feature1 || {}), desc: e.target.value })
              }
              placeholder="Без перегрева и пыли."
              className="w-full rounded-lg bg-black/40 border border-white/10 py-1.5 px-2.5 text-[11px] text-[#C4B9AD] focus:outline-none focus:border-[#D9A76A]"
            />
          </div>

          <div className="p-3.5 rounded-xl bg-[#1C1410] border border-white/10 space-y-2">
            <span className="text-[10px] font-mono text-[#8E8276] block">Плашка 2 (Скорость)</span>
            <input
              type="text"
              value={content?.feature2?.title || ''}
              onChange={(e) =>
                onChange('feature2', { ...(content?.feature2 || {}), title: e.target.value })
              }
              placeholder="Помол за 60 секунд"
              className="w-full rounded-lg bg-black/40 border border-white/10 py-1.5 px-2.5 text-xs font-bold text-white focus:outline-none focus:border-[#D9A76A]"
            />
            <input
              type="text"
              value={content?.feature2?.desc || ''}
              onChange={(e) =>
                onChange('feature2', { ...(content?.feature2 || {}), desc: e.target.value })
              }
              placeholder="Свежий помол при вас."
              className="w-full rounded-lg bg-black/40 border border-white/10 py-1.5 px-2.5 text-[11px] text-[#C4B9AD] focus:outline-none focus:border-[#D9A76A]"
            />
          </div>
        </div>
      </div>

      {/* 3. Methods List */}
      <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-[#D9A76A]" />
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#D9A76A]">
              Карточки способов помола ({methods.length})
            </span>
          </div>
          <button
            type="button"
            onClick={addMethod}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#D9A76A]/20 hover:bg-[#D9A76A]/30 text-[#E5CBA8] text-xs font-bold transition-all cursor-pointer"
          >
            <Plus className="h-3 w-3" />
            <span>Добавить метод</span>
          </button>
        </div>

        <div className="space-y-3">
          {methods.map((m: any, idx: number) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-[#1C1410] border border-white/10 space-y-2.5 hover:border-white/20 transition-all"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-[#D9A76A]">
                    #{m.number || String(idx + 1).padStart(2, '0')}
                  </span>
                  <input
                    type="text"
                    value={m.number || ''}
                    onChange={(e) => updateMethod(idx, 'number', e.target.value)}
                    placeholder="01"
                    className="w-12 rounded-lg bg-black/40 border border-white/10 py-1 px-2 text-xs font-mono text-center text-[#D9A76A]"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={m.fraction || ''}
                    onChange={(e) => updateMethod(idx, 'fraction', e.target.value)}
                    placeholder="Фракция: ≈ 0.1 мм"
                    className="w-28 rounded-lg bg-black/40 border border-white/10 py-1 px-2 text-xs font-mono text-[#E5CBA8]"
                  />
                  <input
                    type="text"
                    value={m.time || ''}
                    onChange={(e) => updateMethod(idx, 'time', e.target.value)}
                    placeholder="Время: 2–3 мин"
                    className="w-28 rounded-lg bg-black/40 border border-white/10 py-1 px-2 text-xs font-mono text-white"
                  />
                  {methods.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeMethod(idx)}
                      className="p-1.5 text-[#8E8276] hover:text-red-400 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                      title="Удалить карточку"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  type="text"
                  value={m.title || ''}
                  onChange={(e) => updateMethod(idx, 'title', e.target.value)}
                  placeholder="Название метода (напр. Турка)"
                  className="rounded-lg bg-black/40 border border-white/10 py-1.5 px-2.5 text-xs font-bold text-white focus:outline-none focus:border-[#D9A76A]"
                />
                <input
                  type="text"
                  value={m.subtitle || ''}
                  onChange={(e) => updateMethod(idx, 'subtitle', e.target.value)}
                  placeholder="Подзаголовок помола (напр. Экстра-тонкий)"
                  className="rounded-lg bg-black/40 border border-white/10 py-1.5 px-2.5 text-xs text-[#D9A76A] focus:outline-none focus:border-[#D9A76A]"
                />
              </div>

              <textarea
                rows={2}
                value={m.desc || ''}
                onChange={(e) => updateMethod(idx, 'desc', e.target.value)}
                placeholder="Описание помола и результата в чашке..."
                className="w-full rounded-lg bg-black/40 border border-white/10 p-2 text-xs text-[#C4B9AD] focus:outline-none focus:border-[#D9A76A] leading-relaxed"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
