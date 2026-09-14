'use client';

import React from 'react';
import { Send, ShieldCheck, Plus, Trash2, MessageCircle, Phone, Mail, Sparkles, Coffee, Gift, Heart } from 'lucide-react';

const DEFAULT_PRIVILEGES = [
  {
    title: 'Помол 0 ₽',
    desc: 'Жернова Fiorenzato: под турку, эспрессо, фильтр.',
  },
  {
    title: 'Бронь 15 мин',
    desc: 'Соберем у кассы без очередей и предоплаты.',
  },
  {
    title: 'Боксы сладостей',
    desc: 'Подарочная упаковка моти, снеков и кофе.',
  },
  {
    title: 'Pet-friendly',
    desc: 'Всегда рады гостям с четвероногими друзьями.',
  },
];

interface ConciergeHubEditorProps {
  content: Record<string, any>;
  onChange: (field: string, val: any) => void;
}

export function ConciergeHubEditor({ content, onChange }: ConciergeHubEditorProps) {
  const privileges =
    Array.isArray(content?.privileges) && content.privileges.length > 0
      ? content.privileges
      : DEFAULT_PRIVILEGES;

  const updatePrivilege = (idx: number, key: string, val: any) => {
    const next = [...privileges];
    next[idx] = { ...(next[idx] || {}), [key]: val };
    onChange('privileges', next);
  };

  const addPrivilege = () => {
    const next = [
      ...privileges,
      {
        title: 'Новая привилегия',
        desc: 'Описание сервиса...',
      },
    ];
    onChange('privileges', next);
  };

  const removePrivilege = (idx: number) => {
    const next = privileges.filter((_, i) => i !== idx);
    onChange('privileges', next);
  };

  return (
    <div className="space-y-6">
      {/* LEFT COLUMN: DIRECT CONCIERGE CHANNELS */}
      <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-4">
        <div className="flex items-center gap-2 text-[#D9A76A]">
          <Send className="h-4 w-4" />
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider">
            Левая колонка: Прямая связь с залом (Персональный консьерж)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-[10px] font-mono text-[#8E8276]">Шильдик</label>
            <input
              type="text"
              value={content?.conciergeBadge || ''}
              onChange={(e) => onChange('conciergeBadge', e.target.value)}
              placeholder="Персональный консьерж"
              className="w-full rounded-lg bg-[#1C1410] border border-white/10 py-1.5 px-2.5 text-xs text-white"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-mono text-[#8E8276]">Заголовок</label>
            <input
              type="text"
              value={content?.conciergeTitle || ''}
              onChange={(e) => onChange('conciergeTitle', e.target.value)}
              placeholder="Прямая связь с залом"
              className="w-full rounded-lg bg-[#1C1410] border border-white/10 py-1.5 px-2.5 text-xs font-bold text-white"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-mono text-[#8E8276]">Описание</label>
          <textarea
            rows={2}
            value={content?.conciergeDesc || ''}
            onChange={(e) => onChange('conciergeDesc', e.target.value)}
            placeholder="Консультанты ответят в течение нескольких минут..."
            className="w-full rounded-lg bg-[#1C1410] border border-white/10 p-2 text-xs text-[#C4B9AD]"
          />
        </div>

        {/* Channels */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <div className="space-y-1">
            <label className="text-[10px] font-mono text-[#8E8276]">Telegram (ссылка / username)</label>
            <input
              type="text"
              value={content?.telegramUrl || ''}
              onChange={(e) => onChange('telegramUrl', e.target.value)}
              placeholder="https://t.me/tav_coffee"
              className="w-full rounded-lg bg-[#1C1410] border border-white/10 py-1.5 px-2.5 text-xs text-white"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-mono text-[#8E8276]">WhatsApp (ссылка)</label>
            <input
              type="text"
              value={content?.whatsappUrl || ''}
              onChange={(e) => onChange('whatsappUrl', e.target.value)}
              placeholder="https://wa.me/79881637141"
              className="w-full rounded-lg bg-[#1C1410] border border-white/10 py-1.5 px-2.5 text-xs text-white"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-mono text-[#8E8276]">Телефон магазина</label>
            <input
              type="text"
              value={content?.phone || ''}
              onChange={(e) => onChange('phone', e.target.value)}
              placeholder="+7 (988) 163-71-41"
              className="w-full rounded-lg bg-[#1C1410] border border-white/10 py-1.5 px-2.5 text-xs text-white"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-mono text-[#8E8276]">Email (B2B / Опт)</label>
            <input
              type="text"
              value={content?.email || ''}
              onChange={(e) => onChange('email', e.target.value)}
              placeholder="info@konfetnica-store.ru"
              className="w-full rounded-lg bg-[#1C1410] border border-white/10 py-1.5 px-2.5 text-xs text-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <div className="space-y-1">
            <label className="text-[10px] font-mono text-[#8E8276]">Нижняя сноска (слева)</label>
            <input
              type="text"
              value={content?.bottomNoteLeft || ''}
              onChange={(e) => onChange('bottomNoteLeft', e.target.value)}
              placeholder="Ответ: 5–10 мин"
              className="w-full rounded-lg bg-[#1C1410] border border-white/10 py-1.5 px-2.5 text-xs text-[#A89D91]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-mono text-[#8E8276]">Нижняя сноска (справа)</label>
            <input
              type="text"
              value={content?.bottomNoteRight || ''}
              onChange={(e) => onChange('bottomNoteRight', e.target.value)}
              placeholder="Без выходных"
              className="w-full rounded-lg bg-[#1C1410] border border-white/10 py-1.5 px-2.5 text-xs text-[#A89D91]"
            />
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: BOUTIQUE PRIVILEGES */}
      <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#D9A76A]">
            <ShieldCheck className="h-4 w-4" />
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider">
              Правая колонка: Сервис в концепт-сторе (Привилегии для гостей)
            </span>
          </div>

          <button
            type="button"
            onClick={addPrivilege}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#D9A76A]/20 hover:bg-[#D9A76A]/30 text-[#E5CBA8] text-xs font-bold transition-all cursor-pointer"
          >
            <Plus className="h-3 w-3" />
            <span>Добавить</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-[10px] font-mono text-[#8E8276]">Шильдик</label>
            <input
              type="text"
              value={content?.privilegesBadge || ''}
              onChange={(e) => onChange('privilegesBadge', e.target.value)}
              placeholder="Сервис в концепт-сторе"
              className="w-full rounded-lg bg-[#1C1410] border border-white/10 py-1.5 px-2.5 text-xs text-white"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-mono text-[#8E8276]">Заголовок</label>
            <input
              type="text"
              value={content?.privilegesTitle || ''}
              onChange={(e) => onChange('privilegesTitle', e.target.value)}
              placeholder="Привилегии для гостей"
              className="w-full rounded-lg bg-[#1C1410] border border-white/10 py-1.5 px-2.5 text-xs font-bold text-white"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-mono text-[#8E8276]">Описание</label>
          <textarea
            rows={2}
            value={content?.privilegesDesc || ''}
            onChange={(e) => onChange('privilegesDesc', e.target.value)}
            placeholder="Каждый визит в пространство ТАВ продуман..."
            className="w-full rounded-lg bg-[#1C1410] border border-white/10 p-2 text-xs text-[#C4B9AD]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
          {privileges.map((item: any, idx: number) => (
            <div key={idx} className="p-3 rounded-lg bg-[#1C1410] border border-white/10 space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <input
                  type="text"
                  value={item.title || ''}
                  onChange={(e) => updatePrivilege(idx, 'title', e.target.value)}
                  placeholder="Заголовок карточки"
                  className="flex-1 rounded-md bg-black/40 border border-white/10 py-1 px-2 text-xs font-bold text-white"
                />
                {privileges.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removePrivilege(idx)}
                    className="p-1 text-[#8E8276] hover:text-red-400"
                    title="Удалить"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                )}
              </div>
              <input
                type="text"
                value={item.desc || ''}
                onChange={(e) => updatePrivilege(idx, 'desc', e.target.value)}
                placeholder="Описание карточки..."
                className="w-full rounded-md bg-black/40 border border-white/10 py-1 px-2 text-[11px] text-[#C4B9AD]"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
