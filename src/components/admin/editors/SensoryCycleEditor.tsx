'use client';

import React from 'react';
import { Sparkles, Clock, ShieldCheck, Plus, Trash2 } from 'lucide-react';

const DEFAULT_SENSORY_PHASES = [
  {
    days: '1–3 ДЕНЬ',
    title: 'Фаза активной дегазации',
    desc: 'Выход углекислого газа после ростера. Вкус зерна только начинает структурироваться.',
    highlight: false,
  },
  {
    days: '4–21 ДЕНЬ',
    title: '✨ Пик вкусоароматики',
    desc: 'Максимум эфирных масел, сочная чистая кислотность и шелковистое тело в чашке.',
    highlight: true,
  },
  {
    days: '30+ ДНЕЙ',
    title: 'Медленное угасание',
    desc: 'Постепенное окисление тонких ягодных и цветочных дескрипторов.',
    highlight: false,
  },
];

const DEFAULT_SENSORY_FEATURES = [
  {
    tag1: 'TOP 10% УРОЖАЯ',
    tag2: '84+ SCA',
    title: '100% Specialty Arabica',
    desc: 'Ручной селекционный сбор ягод без дефектов. Прозрачное происхождение каждого микролота.',
  },
  {
    tag1: 'БАРЬЕРНАЯ ФОЛЬГА',
    tag2: 'WICOvalves',
    title: 'Клапан дегазации & Zip-Lock',
    desc: 'Трехслойный металлизированный барьер блокирует кислород, сохраняя 1000+ эфирных соединений.',
  },
  {
    tag1: 'В МАГАЗИНЕ',
    tag2: 'МАЙКОП',
    title: 'Помол в подарок на Васильева, 2/1',
    desc: 'Бесплатно смолем любую пачку на калиброванных жерновах под ваш девайс.',
  },
];

interface SensoryCycleEditorProps {
  content: Record<string, any>;
  onChange: (field: string, val: any) => void;
}

export function SensoryCycleEditor({
  content,
  onChange,
}: SensoryCycleEditorProps) {
  const phases =
    Array.isArray(content?.phases) && content.phases.length > 0
      ? content.phases
      : DEFAULT_SENSORY_PHASES;

  const features =
    Array.isArray(content?.features) && content.features.length > 0
      ? content.features
      : DEFAULT_SENSORY_FEATURES;

  const updatePhase = (idx: number, key: string, value: any) => {
    const next = [...phases];
    next[idx] = { ...(next[idx] || {}), [key]: value };
    onChange('phases', next);
  };

  const updateFeature = (idx: number, key: string, value: any) => {
    const next = [...features];
    next[idx] = { ...(next[idx] || {}), [key]: value };
    onChange('features', next);
  };

  return (
    <div className="space-y-5">
      {/* 1. Section Header */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#D9A76A]">
            Шильдик секции
          </label>
          <input
            type="text"
            value={content?.badge || ''}
            onChange={(e) => onChange('badge', e.target.value)}
            placeholder="Сенсорный контроль и стандарты"
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
            placeholder="Почему кофе ТАВ"
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
            placeholder="раскрывается иначе"
            className="w-full rounded-xl bg-[#1C1410] border border-white/10 py-2.5 px-3 text-xs text-[#E5CBA8] italic focus:outline-none focus:border-[#D9A76A]"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#8E8276]">
            Текст описания манифеста
          </label>
          <input
            type="text"
            value={content?.description || ''}
            onChange={(e) => onChange('description', e.target.value)}
            placeholder="Мы относимся к спешелти-кофе как к живому продукту..."
            className="w-full rounded-xl bg-[#1C1410] border border-white/10 py-2.5 px-3 text-xs text-[#C4B9AD] focus:outline-none focus:border-[#D9A76A]"
          />
        </div>
      </div>

      {/* 2. Left Column: Freshness Window & 3 Phases */}
      <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-4">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-[#D9A76A]" />
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#D9A76A]">
            Левая карточка: «Золотое окно свежести» и фазы дегазации
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-[#8E8276]">Заголовок окна свежести</span>
            <input
              type="text"
              value={content?.freshnessTitle || ''}
              onChange={(e) => onChange('freshnessTitle', e.target.value)}
              placeholder="«Золотое окно свежести»"
              className="w-full rounded-lg bg-[#1C1410] border border-white/10 py-2 px-2.5 text-xs font-bold text-white focus:outline-none focus:border-[#D9A76A]"
            />
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-mono text-[#8E8276]">Бейдж окна пика</span>
            <input
              type="text"
              value={content?.freshnessBadge || ''}
              onChange={(e) => onChange('freshnessBadge', e.target.value)}
              placeholder="Пик: 4–21 день"
              className="w-full rounded-lg bg-[#1C1410] border border-white/10 py-2 px-2.5 text-xs font-mono text-[#E5CBA8] focus:outline-none focus:border-[#D9A76A]"
            />
          </div>
        </div>

        <div className="space-y-1">
          <span className="text-[10px] font-mono text-[#8E8276]">Описание окна свежести</span>
          <textarea
            rows={2}
            value={content?.freshnessDesc || ''}
            onChange={(e) => onChange('freshnessDesc', e.target.value)}
            placeholder="Свой истинный букет, сочную сладость и плотную пенку crema..."
            className="w-full rounded-lg bg-[#1C1410] border border-white/10 p-2.5 text-xs text-[#C4B9AD] focus:outline-none focus:border-[#D9A76A]"
          />
        </div>

        {/* 3 Degassing Phases */}
        <div className="space-y-2.5 pt-2">
          <span className="text-[10px] font-mono text-[#8E8276] block">
            3 фазы созревания зерна после ростера:
          </span>
          {phases.map((ph: any, idx: number) => (
            <div
              key={idx}
              className="p-3 rounded-lg bg-[#1C1410] border border-white/10 space-y-1.5 hover:border-white/20 transition-all"
            >
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={ph.days || ''}
                  onChange={(e) => updatePhase(idx, 'days', e.target.value)}
                  placeholder="1–3 ДЕНЬ"
                  className="w-28 rounded-md bg-black/40 border border-white/10 py-1 px-2 text-xs font-mono text-[#D9A76A]"
                />
                <input
                  type="text"
                  value={ph.title || ''}
                  onChange={(e) => updatePhase(idx, 'title', e.target.value)}
                  placeholder="Название фазы (напр. Фаза активной дегазации)"
                  className="flex-1 rounded-md bg-black/40 border border-white/10 py-1 px-2 text-xs font-bold text-white"
                />
              </div>
              <input
                type="text"
                value={ph.desc || ''}
                onChange={(e) => updatePhase(idx, 'desc', e.target.value)}
                placeholder="Пояснение к вкусу на этом этапе..."
                className="w-full rounded-md bg-black/40 border border-white/10 py-1 px-2 text-[11px] text-[#C4B9AD]"
              />
            </div>
          ))}
        </div>

        {/* Bottom Shelf Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-[#8E8276]">Нижняя плашка (Текст слева)</span>
            <input
              type="text"
              value={content?.shelfBanner?.leftText || ''}
              onChange={(e) =>
                onChange('shelfBanner', {
                  ...(content?.shelfBanner || {}),
                  leftText: e.target.value,
                })
              }
              placeholder="На полках в Майкопе:"
              className="w-full rounded-lg bg-[#1C1410] border border-white/10 py-1.5 px-2.5 text-xs text-[#D9A76A]"
            />
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-[#8E8276]">Нижняя плашка (Текст справа)</span>
            <input
              type="text"
              value={content?.shelfBanner?.rightText || ''}
              onChange={(e) =>
                onChange('shelfBanner', {
                  ...(content?.shelfBanner || {}),
                  rightText: e.target.value,
                })
              }
              placeholder="Всегда свежая обжарка не старше 7–14 дней"
              className="w-full rounded-lg bg-[#1C1410] border border-white/10 py-1.5 px-2.5 text-xs text-white"
            />
          </div>
        </div>
      </div>

      {/* 3. Right Column: 3 Quality Standards Cards */}
      <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-[#D9A76A]" />
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#D9A76A]">
            Правая колонка: 3 карточки стандартов качества
          </span>
        </div>

        <div className="space-y-3">
          {features.map((feat: any, idx: number) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-[#1C1410] border border-white/10 space-y-2 hover:border-white/20 transition-all"
            >
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={feat.tag1 || ''}
                  onChange={(e) => updateFeature(idx, 'tag1', e.target.value)}
                  placeholder="Тег 1 (напр. TOP 10% УРОЖАЯ)"
                  className="w-40 rounded-md bg-black/40 border border-white/10 py-1 px-2 text-[10px] font-mono text-[#E5CBA8]"
                />
                <input
                  type="text"
                  value={feat.tag2 || ''}
                  onChange={(e) => updateFeature(idx, 'tag2', e.target.value)}
                  placeholder="Тег 2 (напр. 84+ SCA)"
                  className="w-32 rounded-md bg-black/40 border border-white/10 py-1 px-2 text-[10px] font-mono text-[#D9A76A]"
                />
                <input
                  type="text"
                  value={feat.title || ''}
                  onChange={(e) => updateFeature(idx, 'title', e.target.value)}
                  placeholder="Заголовок карточки (напр. 100% Specialty Arabica)"
                  className="flex-1 rounded-md bg-black/40 border border-white/10 py-1 px-2 text-xs font-bold text-white"
                />
              </div>
              <textarea
                rows={2}
                value={feat.desc || ''}
                onChange={(e) => updateFeature(idx, 'desc', e.target.value)}
                placeholder="Описание стандарта..."
                className="w-full rounded-md bg-black/40 border border-white/10 p-2 text-xs text-[#C4B9AD] leading-relaxed"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
