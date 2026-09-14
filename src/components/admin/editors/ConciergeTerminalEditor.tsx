'use client';

import React, { useState } from 'react';
import {
  MessageSquare,
  ChevronDown,
  Plus,
  Trash2,
  ChevronUp,
  ToggleLeft,
  ToggleRight,
  Coffee,
  Package,
  Sparkles,
  HelpCircle,
  Gift,
  Phone,
} from 'lucide-react';
import { TopicItem } from '@/lib/types/page-blocks';

const ICON_OPTIONS = [
  { key: 'coffee', label: '☕ Кофе / Зерно', icon: Coffee },
  { key: 'drip', label: '📦 Дрип-пакеты / Коробки', icon: Package },
  { key: 'b2b', label: '💼 Опт / B2B / HoReCa', icon: Sparkles },
  { key: 'other', label: '❓ Вопрос бариста', icon: HelpCircle },
  { key: 'gift', label: '🎁 Подарки / Наборы', icon: Gift },
  { key: 'phone', label: '📞 Консультация / Звонок', icon: Phone },
];

interface ConciergeTerminalEditorProps {
  content?: Record<string, any>;
  topics?: TopicItem[];
  onChange: (fieldOrTopics: string | TopicItem[], val?: any) => void;
}

export function ConciergeTerminalEditor({
  content,
  topics: propTopics,
  onChange,
}: ConciergeTerminalEditorProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const topics: TopicItem[] =
    propTopics ||
    (Array.isArray(content?.topics) ? content.topics : []);

  const handleTopicsChange = (nextTopics: TopicItem[]) => {
    if (typeof onChange === 'function') {
      if (propTopics !== undefined) {
        (onChange as (topics: TopicItem[]) => void)(nextTopics);
      } else {
        (onChange as (field: string, val: any) => void)('topics', nextTopics);
      }
    }
  };

  const updateTopic = (index: number, patch: Partial<TopicItem>) => {
    const updated = topics.map((t, i) => (i === index ? { ...t, ...patch } : t));
    handleTopicsChange(updated);
  };

  const addTopic = () => {
    const newTopic: TopicItem = {
      id: `topic-${Date.now()}`,
      label: '☕ Новая тема',
      title: 'Заголовок темы в сообщении',
      placeholder: 'Например: Текст подсказки для гостя...',
      iconKey: 'coffee',
      order: topics.length + 1,
      isActive: true,
    };
    handleTopicsChange([...topics, newTopic]);
    setExpandedIndex(topics.length);
  };

  const removeTopic = (index: number) => {
    const filtered = topics.filter((_, i) => i !== index);
    handleTopicsChange(filtered);
    if (expandedIndex === index) setExpandedIndex(null);
  };

  const moveTopic = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= topics.length) return;
    const reordered = [...topics];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(targetIndex, 0, moved);
    handleTopicsChange(reordered.map((t, idx) => ({ ...t, order: idx + 1 })));
    setExpandedIndex(targetIndex);
  };

  return (
    <div className="space-y-4">
      {/* Header Fields if content prop provided */}
      {content && (
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] font-mono text-[#8E8276]">Шильдик</label>
              <input
                type="text"
                value={content?.badge || ''}
                onChange={(e) =>
                  (onChange as (field: string, val: any) => void)('badge', e.target.value)
                }
                placeholder="Экспресс-подготовка"
                className="w-full rounded-lg bg-[#1C1410] border border-white/10 py-1.5 px-2.5 text-xs text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono text-[#8E8276]">Заголовок</label>
              <input
                type="text"
                value={content?.title || ''}
                onChange={(e) =>
                  (onChange as (field: string, val: any) => void)('title', e.target.value)
                }
                placeholder="Смолоть зерно или собрать дрип-сет к визиту?"
                className="w-full rounded-lg bg-[#1C1410] border border-white/10 py-1.5 px-2.5 text-xs font-bold text-white"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-mono text-[#8E8276]">Описание</label>
            <textarea
              rows={2}
              value={content?.subtitle || content?.description || ''}
              onChange={(e) =>
                (onChange as (field: string, val: any) => void)('subtitle', e.target.value)
              }
              placeholder="Выберите тему, укажите ваши пожелания..."
              className="w-full rounded-lg bg-[#1C1410] border border-white/10 p-2 text-xs text-[#C4B9AD]"
            />
          </div>
        </div>
      )}

      {/* Topics Accordion List */}
      <div className="space-y-3 p-4 rounded-2xl bg-white/[0.02] border border-white/10">
        <div className="flex items-center justify-between pb-1 border-b border-white/5">
          <label className="text-xs font-mono font-bold uppercase tracking-wider text-[#D9A76A] flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            <span>Темы обращений и быстрого заказа ({topics.length})</span>
          </label>
          <button
            type="button"
            onClick={addTopic}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#D9A76A]/20 hover:bg-[#D9A76A]/30 text-[#E5CBA8] text-xs font-bold transition-all border border-[#D9A76A]/40 cursor-pointer active:scale-95"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Добавить тему</span>
          </button>
        </div>

        <div className="space-y-2.5">
          {topics.map((topic, idx) => {
            const isExpanded = expandedIndex === idx;
            const currentIcon = ICON_OPTIONS.find((o) => o.key === topic.iconKey) || ICON_OPTIONS[3];
            const IconComp = currentIcon.icon;

            return (
              <div
                key={topic.id || idx}
                className={`rounded-xl border transition-all overflow-hidden ${
                  topic.isActive !== false
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
                    <span className="p-1 rounded bg-white/5 text-[#D9A76A] flex-shrink-0">
                      <IconComp className="h-4 w-4" />
                    </span>
                    <div className="flex items-center gap-2 truncate">
                      <span className="text-xs font-bold text-white">
                        {topic.label || `Тема ${idx + 1}`}
                      </span>
                      <span className="text-[10px] font-mono text-[#8E8276] truncate">
                        ({topic.title})
                      </span>
                    </div>
                  </button>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => moveTopic(idx, 'up')}
                      className="p-1 rounded hover:bg-white/10 text-[#8E8276] hover:text-white disabled:opacity-20 cursor-pointer"
                      title="Поднять выше"
                    >
                      <ChevronUp className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === topics.length - 1}
                      onClick={() => moveTopic(idx, 'down')}
                      className="p-1 rounded hover:bg-white/10 text-[#8E8276] hover:text-white disabled:opacity-20 cursor-pointer"
                      title="Опустить ниже"
                    >
                      <ChevronDown className="h-3.5 w-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => updateTopic(idx, { isActive: topic.isActive === false })}
                      className="p-1 rounded text-stone-400 hover:text-white cursor-pointer"
                      title={topic.isActive !== false ? 'Активна' : 'Скрыта'}
                    >
                      {topic.isActive !== false ? (
                        <ToggleRight className="h-4 w-4 text-emerald-400" />
                      ) : (
                        <ToggleLeft className="h-4 w-4 text-stone-600" />
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => removeTopic(idx)}
                      className="p-1 rounded hover:bg-red-500/20 text-[#8E8276] hover:text-red-400 cursor-pointer transition-colors"
                      title="Удалить тему"
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
                          Текст кнопки выбора темы (с эмодзи)
                        </label>
                        <input
                          type="text"
                          value={topic.label}
                          onChange={(e) => updateTopic(idx, { label: e.target.value })}
                          placeholder="☕ Смолоть кофе"
                          className="w-full rounded-lg bg-[#1C1410] border border-white/10 py-2 px-2.5 text-xs text-white font-medium"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-mono text-[#8E8276]">
                          Иконка темы
                        </label>
                        <select
                          value={topic.iconKey}
                          onChange={(e) => updateTopic(idx, { iconKey: e.target.value })}
                          className="w-full rounded-lg bg-[#1C1410] border border-white/10 py-2 px-2.5 text-xs text-white focus:outline-none focus:border-[#D9A76A]"
                        >
                          {ICON_OPTIONS.map((opt) => (
                            <option key={opt.key} value={opt.key}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-[#8E8276]">
                        Заголовок темы в тексте отправляемого сообщения
                      </label>
                      <input
                        type="text"
                        value={topic.title}
                        onChange={(e) => updateTopic(idx, { title: e.target.value })}
                        placeholder="Подготовить и смолоть кофе к приезду"
                        className="w-full rounded-lg bg-[#1C1410] border border-white/10 py-2 px-2.5 text-xs text-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-[#8E8276]">
                        Текст подсказки (placeholder) в поле комментария
                      </label>
                      <textarea
                        rows={2}
                        value={topic.placeholder}
                        onChange={(e) => updateTopic(idx, { placeholder: e.target.value })}
                        placeholder="Например: Смолоть 250г Эфиопии..."
                        className="w-full rounded-lg bg-[#1C1410] border border-white/10 p-2.5 text-xs text-[#C4B9AD] resize-none leading-relaxed"
                      />
                    </div>
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
