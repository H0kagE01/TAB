'use client';

import React from 'react';
import { Award, ArrowRight } from 'lucide-react';

interface WholesaleBannerEditorProps {
  content: Record<string, any>;
  onChange: (field: string, val: any) => void;
}

export function WholesaleBannerEditor({
  content,
  onChange,
}: WholesaleBannerEditorProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#D9A76A]">
          Верхний бейдж / Шильдик
        </label>
        <input
          type="text"
          value={content?.badge || ''}
          onChange={(e) => onChange('badge', e.target.value)}
          placeholder="Оптовые поставки & HoReCa"
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
          placeholder="Кофе ТАВ для вашей кофейни, ресторана или офиса"
          className="w-full rounded-xl bg-[#1C1410] border border-white/10 py-2.5 px-3 text-xs font-bold text-white focus:outline-none focus:border-[#D9A76A]"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#8E8276]">
          Описание предложения
        </label>
        <textarea
          rows={3}
          value={content?.description || ''}
          onChange={(e) => onChange('description', e.target.value)}
          placeholder="Поставляем спешелти зерно свежей обжарки, настраиваем эспрессо-профили и обучаем персонал..."
          className="w-full rounded-xl bg-[#1C1410] border border-white/10 p-3 text-xs text-[#C4B9AD] focus:outline-none focus:border-[#D9A76A] leading-relaxed"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/5">
        <div className="space-y-1">
          <label className="text-[10px] font-mono text-[#D9A76A]">Текст кнопки</label>
          <input
            type="text"
            value={content?.buttonLabel || ''}
            onChange={(e) => onChange('buttonLabel', e.target.value)}
            placeholder="Запросить B2B прайс"
            className="w-full rounded-lg bg-[#1C1410] border border-white/10 py-2 px-2.5 text-xs text-white"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-mono text-[#8E8276]">Ссылка кнопки</label>
          <input
            type="text"
            value={content?.buttonHref || ''}
            onChange={(e) => onChange('buttonHref', e.target.value)}
            placeholder="https://t.me/tav_coffee или /b2b"
            className="w-full rounded-lg bg-[#1C1410] border border-white/10 py-2 px-2.5 text-xs font-mono text-[#E5CBA8]"
          />
        </div>
      </div>
    </div>
  );
}
