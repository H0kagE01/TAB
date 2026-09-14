'use client';

import React, { useState } from 'react';
import {
  Store,
  ChevronDown,
  Plus,
  Trash2,
  ChevronUp,
  Image as ImageIcon,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';
import { ShowroomZoneItem } from '@/lib/types/page-blocks';
import { ImageUpload } from '../ImageUpload';

interface BoutiqueShowcaseEditorProps {
  content?: Record<string, any>;
  zones?: ShowroomZoneItem[];
  onChange: (fieldOrZones: string | ShowroomZoneItem[], val?: any) => void;
}

export function BoutiqueShowcaseEditor({
  content,
  zones: propZones,
  onChange,
}: BoutiqueShowcaseEditorProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const zones: ShowroomZoneItem[] =
    propZones ||
    (Array.isArray(content?.zones) ? content.zones : []);

  const handleZonesChange = (nextZones: ShowroomZoneItem[]) => {
    if (typeof onChange === 'function') {
      if (propZones !== undefined) {
        (onChange as (zones: ShowroomZoneItem[]) => void)(nextZones);
      } else {
        (onChange as (field: string, val: any) => void)('zones', nextZones);
      }
    }
  };

  const updateZone = (index: number, patch: Partial<ShowroomZoneItem>) => {
    const updated = zones.map((z, i) => (i === index ? { ...z, ...patch } : z));
    handleZonesChange(updated);
  };

  const addZone = () => {
    const newZone: ShowroomZoneItem = {
      id: `zone-${Date.now()}`,
      label: '🏛️ Новая локация',
      title: 'Название зоны концепт-стора',
      desc: 'Подробное описание витрины или зоны обслуживания.',
      image: '/images/store-maykop-interior.jpg',
      order: zones.length + 1,
      isActive: true,
    };
    handleZonesChange([...zones, newZone]);
    setExpandedIndex(zones.length);
  };

  const removeZone = (index: number) => {
    const filtered = zones.filter((_, i) => i !== index);
    handleZonesChange(filtered);
    if (expandedIndex === index) setExpandedIndex(null);
  };

  const moveZone = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= zones.length) return;
    const reordered = [...zones];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(targetIndex, 0, moved);
    handleZonesChange(reordered.map((z, idx) => ({ ...z, order: idx + 1 })));
    setExpandedIndex(targetIndex);
  };

  return (
    <div className="space-y-4">
      {/* Optional Section Header if content prop is provided */}
      {content && (
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] font-mono text-[#8E8276]">Шильдик секции</label>
              <input
                type="text"
                value={content?.badge || ''}
                onChange={(e) =>
                  (onChange as (field: string, val: any) => void)('badge', e.target.value)
                }
                placeholder="Локация в Майкопе"
                className="w-full rounded-lg bg-[#1C1410] border border-white/10 py-1.5 px-2.5 text-xs text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono text-[#8E8276]">Заголовок секции</label>
              <input
                type="text"
                value={content?.title || ''}
                onChange={(e) =>
                  (onChange as (field: string, val: any) => void)('title', e.target.value)
                }
                placeholder="Витрины и интерьер шоурума"
                className="w-full rounded-lg bg-[#1C1410] border border-white/10 py-1.5 px-2.5 text-xs font-bold text-white"
              />
            </div>
          </div>
        </div>
      )}

      {/* Zones Accordion List */}
      <div className="space-y-3 p-4 rounded-2xl bg-white/[0.02] border border-white/10">
        <div className="flex items-center justify-between pb-1 border-b border-white/5">
          <label className="text-xs font-mono font-bold uppercase tracking-wider text-[#D9A76A] flex items-center gap-2">
            <Store className="h-4 w-4" />
            <span>Зоны и витрины шоурума ({zones.length})</span>
          </label>
          <button
            type="button"
            onClick={addZone}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#D9A76A]/20 hover:bg-[#D9A76A]/30 text-[#E5CBA8] text-xs font-bold transition-all border border-[#D9A76A]/40 cursor-pointer active:scale-95"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Добавить зону</span>
          </button>
        </div>

        <div className="space-y-2.5">
          {zones.map((zone, idx) => {
            const isExpanded = expandedIndex === idx;

            return (
              <div
                key={zone.id || idx}
                className={`rounded-xl border transition-all overflow-hidden ${
                  zone.isActive !== false
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
                    {zone.image && (
                      <img
                        src={zone.image}
                        alt=""
                        className="w-8 h-8 rounded-lg object-cover flex-shrink-0 opacity-70"
                      />
                    )}
                    <div className="flex items-center gap-2 truncate">
                      <span className="text-xs font-bold text-white">
                        {zone.label || `Зона ${idx + 1}`}
                      </span>
                      <span className="text-[10px] font-mono text-[#8E8276] truncate">
                        {zone.title}
                      </span>
                    </div>
                  </button>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => moveZone(idx, 'up')}
                      className="p-1 rounded hover:bg-white/10 text-[#8E8276] hover:text-white disabled:opacity-20 cursor-pointer"
                      title="Поднять выше"
                    >
                      <ChevronUp className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === zones.length - 1}
                      onClick={() => moveZone(idx, 'down')}
                      className="p-1 rounded hover:bg-white/10 text-[#8E8276] hover:text-white disabled:opacity-20 cursor-pointer"
                      title="Опустить ниже"
                    >
                      <ChevronDown className="h-3.5 w-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => updateZone(idx, { isActive: zone.isActive === false })}
                      className="p-1 rounded text-stone-400 hover:text-white cursor-pointer"
                      title={zone.isActive !== false ? 'Активна' : 'Скрыта'}
                    >
                      {zone.isActive !== false ? (
                        <ToggleRight className="h-4 w-4 text-emerald-400" />
                      ) : (
                        <ToggleLeft className="h-4 w-4 text-stone-600" />
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => removeZone(idx)}
                      className="p-1 rounded hover:bg-red-500/20 text-[#8E8276] hover:text-red-400 cursor-pointer transition-colors"
                      title="Удалить зону"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* Body */}
                {isExpanded && (
                  <div className="p-4 space-y-3.5 border-t border-white/5 bg-black/20">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono text-[#8E8276]">
                          Текст кнопки-вкладки (с эмодзи)
                        </label>
                        <input
                          type="text"
                          value={zone.label}
                          onChange={(e) => updateZone(idx, { label: e.target.value })}
                          placeholder="🏛️ Фасад & Вход"
                          className="w-full rounded-lg bg-[#1C1410] border border-white/10 py-2 px-2.5 text-xs text-white font-medium"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-mono text-[#8E8276]">
                          Заголовок витрины
                        </label>
                        <input
                          type="text"
                          value={zone.title}
                          onChange={(e) => updateZone(idx, { title: e.target.value })}
                          placeholder="Главный вход и парковка"
                          className="w-full rounded-lg bg-[#1C1410] border border-white/10 py-2 px-2.5 text-xs text-white"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-[#8E8276]">
                        Описание зоны
                      </label>
                      <textarea
                        rows={2}
                        value={zone.desc}
                        onChange={(e) => updateZone(idx, { desc: e.target.value })}
                        placeholder="Удобный подъезд с улицы Васильева..."
                        className="w-full rounded-lg bg-[#1C1410] border border-white/10 p-2.5 text-xs text-[#C4B9AD] resize-none leading-relaxed"
                      />
                    </div>

                    <ImageUpload
                      value={zone.image}
                      onChange={(url) => updateZone(idx, { image: url })}
                      label="Фотография зоны"
                      placeholder="/images/store-maykop.jpg или https://..."
                      aspectRatio="video"
                      compact
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
