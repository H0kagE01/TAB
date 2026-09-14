'use client';

import React from 'react';
import { HelpCircle, Plus, Trash2 } from 'lucide-react';

const DEFAULT_FAQ_ITEMS = [
  {
    title: 'Дегустация ароматов кофе',
    desc: 'В зале открыты образцы зерен всех сортов свежей обжарки. Консультант расскажет о дескрипторах (шоколад, ягоды, тропики) и подберет сорт под ваш способ заваривания.',
  },
  {
    title: 'Свежесть обжарки и дата на пачке',
    desc: 'Мы обжариваем зерно еженедельно. На каждой пачке указана точная дата ростинга. Односторонний дегазационный клапан позволяет зерну дышать и сохранять весь букет эфирных масел.',
  },
  {
    title: 'Бесплатный профессиональный помол',
    desc: 'Перемалываем зерновой кофе прямо при вас на жерновой кофемолке совершенно бесплатно. Доступны любые степени помола: от джезвы и эспрессо до воронки V60 и френч-пресса.',
  },
  {
    title: 'Парковка и визиты с питомцами',
    desc: 'Перед входом в магазин оборудована бесплатная парковка для автомобилей. Кроме того, мы полностью pet-friendly пространство — всегда рады гостям с собаками.',
  },
];

interface GuestFaqEditorProps {
  content: Record<string, any>;
  onChange: (field: string, val: any) => void;
}

export function GuestFaqEditor({ content, onChange }: GuestFaqEditorProps) {
  const items =
    Array.isArray(content?.items) && content.items.length > 0
      ? content.items
      : DEFAULT_FAQ_ITEMS;

  const updateItem = (idx: number, key: string, val: any) => {
    const next = [...items];
    next[idx] = { ...(next[idx] || {}), [key]: val };
    onChange('items', next);
  };

  const addItem = () => {
    const next = [
      ...items,
      {
        title: 'Новый вопрос / совет',
        desc: 'Подробный ответ...',
      },
    ];
    onChange('items', next);
  };

  const removeItem = (idx: number) => {
    const next = items.filter((_, i) => i !== idx);
    onChange('items', next);
  };

  return (
    <div className="space-y-5">
      {/* Header Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#D9A76A]">
            Шильдик
          </label>
          <input
            type="text"
            value={content?.badge || ''}
            onChange={(e) => onChange('badge', e.target.value)}
            placeholder="Справочник гостя"
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
            placeholder="Перед вашим визитом"
            className="w-full rounded-xl bg-[#1C1410] border border-white/10 py-2.5 px-3 text-xs font-bold text-white focus:outline-none focus:border-[#D9A76A]"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#8E8276]">
          Подзаголовок / Описание
        </label>
        <textarea
          rows={2}
          value={content?.subtitle || ''}
          onChange={(e) => onChange('subtitle', e.target.value)}
          placeholder="Ответы на популярные вопросы о покупках, дегустациях и сервисе в магазине..."
          className="w-full rounded-xl bg-[#1C1410] border border-white/10 p-2.5 text-xs text-[#C4B9AD] focus:outline-none focus:border-[#D9A76A]"
        />
      </div>

      {/* FAQ Items */}
      <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4 text-[#D9A76A]" />
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#D9A76A]">
              Карточки справочника ({items.length})
            </span>
          </div>

          <button
            type="button"
            onClick={addItem}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#D9A76A]/20 hover:bg-[#D9A76A]/30 text-[#E5CBA8] text-xs font-bold transition-all cursor-pointer"
          >
            <Plus className="h-3 w-3" />
            <span>Добавить карточку</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {items.map((item: any, idx: number) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-[#1C1410] border border-white/10 space-y-2 hover:border-white/20 transition-all"
            >
              <div className="flex items-center justify-between gap-2">
                <input
                  type="text"
                  value={item.title || ''}
                  onChange={(e) => updateItem(idx, 'title', e.target.value)}
                  placeholder="Заголовок карточки"
                  className="flex-1 rounded-lg bg-black/40 border border-white/10 py-1.5 px-2.5 text-xs font-bold text-white focus:outline-none focus:border-[#D9A76A]"
                />
                {items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeItem(idx)}
                    className="p-1.5 text-[#8E8276] hover:text-red-400 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                    title="Удалить"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
              <textarea
                rows={3}
                value={item.desc || ''}
                onChange={(e) => updateItem(idx, 'desc', e.target.value)}
                placeholder="Текст пояснения или совета..."
                className="w-full rounded-lg bg-black/40 border border-white/10 p-2 text-xs text-[#C4B9AD] leading-relaxed focus:outline-none focus:border-[#D9A76A]"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
