'use client';

import React from 'react';
import { MapPin, Navigation, Car, Clock, Plus, Trash2 } from 'lucide-react';

const DEFAULT_TRANSPORT_TIPS = [
  {
    icon: 'car',
    title: 'На автомобиле',
    desc: 'Удобный заезд с ул. Васильева. Бесплатная автостоянка прямо перед крыльцом.',
  },
  {
    icon: 'bus',
    title: 'Общественным транспортом',
    desc: 'Остановка «Улица 12-го Марта» (маршрутки и автобусы) — 4 минуты пешком (330 м).',
  },
  {
    icon: 'walk',
    title: 'Пешком',
    desc: 'Уютный район, яркая вывеска с подсветкой и вход с уровня тротуара.',
  },
];

interface MapSectionEditorProps {
  content: Record<string, any>;
  onChange: (field: string, val: any) => void;
}

export function MapSectionEditor({ content, onChange }: MapSectionEditorProps) {
  const tips =
    Array.isArray(content?.transportTips) && content.transportTips.length > 0
      ? content.transportTips
      : DEFAULT_TRANSPORT_TIPS;

  const updateTip = (idx: number, key: string, val: any) => {
    const next = [...tips];
    next[idx] = { ...(next[idx] || {}), [key]: val };
    onChange('transportTips', next);
  };

  const addTip = () => {
    const next = [
      ...tips,
      {
        icon: 'navigation',
        title: 'Новый маршрут',
        desc: 'Описание маршрута...',
      },
    ];
    onChange('transportTips', next);
  };

  const removeTip = (idx: number) => {
    const next = tips.filter((_, i) => i !== idx);
    onChange('transportTips', next);
  };

  return (
    <div className="space-y-5">
      {/* 1. Header Texts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#D9A76A]">
            Шильдик секции
          </label>
          <input
            type="text"
            value={content?.badge || ''}
            onChange={(e) => onChange('badge', e.target.value)}
            placeholder="ИНТЕРАКТИВНАЯ КАРТА • МАЙКОП"
            className="w-full rounded-xl bg-[#1C1410] border border-white/10 py-2.5 px-3 text-xs text-white focus:outline-none focus:border-[#D9A76A]"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-white">
            Главный заголовок
          </label>
          <input
            type="text"
            value={content?.title || ''}
            onChange={(e) => onChange('title', e.target.value)}
            placeholder="Как добраться в концепт-стор"
            className="w-full rounded-xl bg-[#1C1410] border border-white/10 py-2.5 px-3 text-xs font-bold text-white focus:outline-none focus:border-[#D9A76A]"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#8E8276]">
          Описание / Ориентиры
        </label>
        <textarea
          rows={2}
          value={content?.description || ''}
          onChange={(e) => onChange('description', e.target.value)}
          placeholder="Майкоп, ул. К.А. Васильева, 2/1 — бесплатная парковка перед входом..."
          className="w-full rounded-xl bg-[#1C1410] border border-white/10 p-2.5 text-xs text-[#C4B9AD] focus:outline-none focus:border-[#D9A76A]"
        />
      </div>

      {/* 2. Map URLs */}
      <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-3">
        <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#D9A76A] block">
          Ссылки и виджет карты
        </span>

        <div className="space-y-1.5">
          <label className="text-[10px] font-mono text-[#8E8276]">
            Ссылка виджета Яндекс Карт (iframe)
          </label>
          <input
            type="text"
            value={content?.yandexMapUrl || ''}
            onChange={(e) => onChange('yandexMapUrl', e.target.value)}
            placeholder="https://yandex.ru/map-widget/v1/?ll=40.046895%2C44.609943&z=17.2..."
            className="w-full rounded-lg bg-[#1C1410] border border-white/10 py-1.5 px-2.5 text-xs font-mono text-[#E5CBA8]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-[10px] font-mono text-[#8E8276]">
              Прямая ссылка на Яндекс Карты (кнопка)
            </label>
            <input
              type="text"
              value={content?.yandexDirectUrl || ''}
              onChange={(e) => onChange('yandexDirectUrl', e.target.value)}
              placeholder="https://yandex.ru/maps/-/CTDGNHK~"
              className="w-full rounded-lg bg-[#1C1410] border border-white/10 py-1.5 px-2.5 text-xs font-mono text-white"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-mono text-[#8E8276]">
              Прямая ссылка на 2ГИС (кнопка)
            </label>
            <input
              type="text"
              value={content?.gisDirectUrl || ''}
              onChange={(e) => onChange('gisDirectUrl', e.target.value)}
              placeholder="https://2gis.ru/maykop/search/..."
              className="w-full rounded-lg bg-[#1C1410] border border-white/10 py-1.5 px-2.5 text-xs font-mono text-white"
            />
          </div>
        </div>
      </div>

      {/* 3. Transport Tips */}
      <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#D9A76A]">
            Карточки транспорта под картой ({tips.length})
          </span>
          <button
            type="button"
            onClick={addTip}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#D9A76A]/20 hover:bg-[#D9A76A]/30 text-[#E5CBA8] text-xs font-bold transition-all cursor-pointer"
          >
            <Plus className="h-3 w-3" />
            <span>Добавить маршрут</span>
          </button>
        </div>

        <div className="space-y-2.5">
          {tips.map((tip: any, idx: number) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-[#1C1410] border border-white/10 space-y-2 hover:border-white/20 transition-all"
            >
              <div className="flex items-center justify-between gap-2">
                <input
                  type="text"
                  value={tip.title || ''}
                  onChange={(e) => updateTip(idx, 'title', e.target.value)}
                  placeholder="Название (напр. На автомобиле)"
                  className="flex-1 rounded-md bg-black/40 border border-white/10 py-1.5 px-2.5 text-xs font-bold text-white focus:outline-none focus:border-[#D9A76A]"
                />
                {tips.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeTip(idx)}
                    className="p-1.5 text-[#8E8276] hover:text-red-400 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                    title="Удалить"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
              <textarea
                rows={2}
                value={tip.desc || ''}
                onChange={(e) => updateTip(idx, 'desc', e.target.value)}
                placeholder="Описание маршрута..."
                className="w-full rounded-md bg-black/40 border border-white/10 p-2 text-xs text-[#C4B9AD] leading-relaxed focus:outline-none focus:border-[#D9A76A]"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
