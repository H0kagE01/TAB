'use client';

import React from 'react';
import { ImageUpload } from '../ImageUpload';
import { MapPin, Navigation, Send, Phone, Sparkles } from 'lucide-react';

const DEFAULT_HIGHLIGHTS = [
  'Парковка перед входом',
  'Помол зерна 0 ₽',
  'Самовывоз 15 мин',
  'Pet-friendly',
];

interface ContactsHeroEditorProps {
  content: Record<string, any>;
  onChange: (field: string, val: any) => void;
}

export function ContactsHeroEditor({ content, onChange }: ContactsHeroEditorProps) {
  const highlights =
    Array.isArray(content?.highlights) && content.highlights.length === 4
      ? content.highlights
      : DEFAULT_HIGHLIGHTS;

  const updateHighlight = (idx: number, val: string) => {
    const next = [...highlights];
    next[idx] = val;
    onChange('highlights', next);
  };

  return (
    <div className="space-y-4">
      {/* 1. Badge & Subtitles */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#D9A76A]">
          Верхний шильдик / Локация
        </label>
        <input
          type="text"
          value={content?.badge || ''}
          onChange={(e) => onChange('badge', e.target.value)}
          placeholder="г. Майкоп, ул. К.А. Васильева, 2/1"
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
            value={content?.headline || ''}
            onChange={(e) => onChange('headline', e.target.value)}
            placeholder="Контакты и"
            className="w-full rounded-xl bg-[#1C1410] border border-white/10 py-2.5 px-3 text-xs font-bold text-white focus:outline-none focus:border-[#D9A76A]"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#E5CBA8]">
            Золотой акцент заголовка
          </label>
          <input
            type="text"
            value={content?.headlineHighlight || ''}
            onChange={(e) => onChange('headlineHighlight', e.target.value)}
            placeholder="пространство ТАВ"
            className="w-full rounded-xl bg-[#1C1410] border border-white/10 py-2.5 px-3 text-xs text-[#E5CBA8] italic focus:outline-none focus:border-[#D9A76A]"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#D9A76A]">
          Курсивный подзаголовок
        </label>
        <input
          type="text"
          value={content?.cursiveSubtitle || ''}
          onChange={(e) => onChange('cursiveSubtitle', e.target.value)}
          placeholder="Приходите за свежеобжаренным спешелти кофе и дегустацией"
          className="w-full rounded-xl bg-[#1C1410] border border-white/10 py-2.5 px-3 text-xs text-[#D9A76A] italic focus:outline-none focus:border-[#D9A76A]"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#8E8276]">
          Текст описания пространства
        </label>
        <textarea
          rows={3}
          value={content?.description || ''}
          onChange={(e) => onChange('description', e.target.value)}
          placeholder="Кофейное пространство в Майкопе: здесь можно вдохнуть ароматы свежих моносортов..."
          className="w-full rounded-xl bg-[#1C1410] border border-white/10 p-3 text-xs text-[#E5DDD3] focus:outline-none focus:border-[#D9A76A] leading-relaxed"
        />
      </div>

      {/* Background Image */}
      <ImageUpload
        value={content?.imageUrl || ''}
        onChange={(url) => onChange('imageUrl', url)}
        label="Фоновое изображение Hero"
        placeholder="/images/store-maykop-interior.jpg"
        aspectRatio="wide"
      />

      {/* 4 Service Highlights Pills */}
      <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-3">
        <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#D9A76A] block">
          4 сервисные плашки под кнопками
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {[0, 1, 2, 3].map((idx) => (
            <div key={idx} className="space-y-1">
              <span className="text-[10px] font-mono text-[#8E8276]">Плашка {idx + 1}</span>
              <input
                type="text"
                value={highlights[idx] || ''}
                onChange={(e) => updateHighlight(idx, e.target.value)}
                placeholder={DEFAULT_HIGHLIGHTS[idx]}
                className="w-full rounded-lg bg-[#1C1410] border border-white/10 py-1.5 px-2 text-xs text-white"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
