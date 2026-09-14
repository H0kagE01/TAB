'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Layers,
  ArrowLeft,
  Eye,
  Save,
  ChevronUp,
  ChevronDown,
  Trash2,
  Plus,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  Globe,
  Settings2,
  ChevronRight,
  Search,
  Package,
  LayoutGrid,
  ExternalLink,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { HeroBlockEditor } from './HeroBlockEditor';
import { RoastGuideEditor } from './editors/RoastGuideEditor';
import { TerroirAtlasEditor, AdminCountry } from './editors/TerroirAtlasEditor';
import { BoutiqueShowcaseEditor } from './editors/BoutiqueShowcaseEditor';
import { ConciergeTerminalEditor } from './editors/ConciergeTerminalEditor';
import { GrindingStationEditor } from './editors/GrindingStationEditor';
import { CoffeeCollectionEditor } from './editors/CoffeeCollectionEditor';
import { SensoryCycleEditor } from './editors/SensoryCycleEditor';
import { ContactsHeroEditor } from './editors/ContactsHeroEditor';
import { MapSectionEditor } from './editors/MapSectionEditor';
import { ConciergeHubEditor } from './editors/ConciergeHubEditor';
import { GuestFaqEditor } from './editors/GuestFaqEditor';
import { WholesaleBannerEditor } from './editors/WholesaleBannerEditor';
import { ImageUpload } from './ImageUpload';

export interface PageBlockModel {
  id: string;
  pageId: string;
  blockType: string;
  name: string;
  order: number;
  isActive: boolean;
  content: Record<string, any>;
}

export interface PageModel {
  id: string;
  slug: string;
  title: string;
  seoTitle: string | null;
  seoDescription: string | null;
  seoKeywords: string | null;
  ogImage: string | null;
  isPublished: boolean;
  blocks: PageBlockModel[];
}

export interface AdminProduct {
  id: string;
  title: string;
  price: number;
  images: string[];
  category: string;
  isNew: boolean;
  isPopular: boolean;
  inStock: boolean;
}

/* ============================================================
   PRODUCT PICKER PANEL
   ============================================================ */
function ProductPickerPanel({
  allProducts,
  selectedIds,
  onChange,
}: {
  allProducts: AdminProduct[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
}) {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return allProducts.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
  }, [allProducts, search]);

  const toggle = (id: string) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((x) => x !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  };

  const moveUp = (idx: number) => {
    if (idx === 0) return;
    const next = [...selectedIds];
    [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
    onChange(next);
  };

  const moveDown = (idx: number) => {
    if (idx === selectedIds.length - 1) return;
    const next = [...selectedIds];
    [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
    onChange(next);
  };

  const selectedProducts = selectedIds
    .map((id) => allProducts.find((p) => p.id === id))
    .filter(Boolean) as AdminProduct[];

  return (
    <div className="space-y-4">
      {/* Selected products list */}
      {selectedProducts.length > 0 && (
        <div className="space-y-2">
          <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#D9A76A] flex items-center gap-2">
            <Package className="h-3.5 w-3.5" />
            Выбранные товары ({selectedProducts.length})
          </label>
          <div className="space-y-1.5">
            {selectedProducts.map((p, idx) => (
              <div
                key={p.id}
                className="flex items-center gap-2 p-2 rounded-lg bg-[#D9A76A]/10 border border-[#D9A76A]/30"
              >
                {p.images[0] && (
                  <img src={p.images[0]} alt={p.title} className="w-8 h-8 rounded object-cover flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-white truncate">{p.title}</div>
                  <div className="text-[10px] text-[#8E8276]">{p.category} · {p.price} ₽</div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button onClick={() => moveUp(idx)} disabled={idx === 0}
                    className="p-1 rounded text-[#8E8276] hover:text-white disabled:opacity-30">
                    <ChevronUp className="h-3 w-3" />
                  </button>
                  <button onClick={() => moveDown(idx)} disabled={idx === selectedProducts.length - 1}
                    className="p-1 rounded text-[#8E8276] hover:text-white disabled:opacity-30">
                    <ChevronDown className="h-3 w-3" />
                  </button>
                  <button onClick={() => toggle(p.id)}
                    className="p-1 rounded text-[#8E8276] hover:text-red-400">
                    <X className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search + product list */}
      <div className="space-y-2">
        <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#C4B9AD] flex items-center gap-2">
          <Search className="h-3.5 w-3.5" />
          Добавить товар
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#8E8276]" />
          <input
            type="text"
            placeholder="Поиск по названию или категории..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl bg-[#1C1410] border border-white/10 py-2.5 pl-9 pr-3 text-xs text-white focus:outline-none focus:border-[#D9A76A]"
          />
        </div>
        <div className="max-h-[280px] overflow-y-auto space-y-1 rounded-xl bg-[#120C09] border border-white/10 p-2">
          {filtered.map((p) => {
            const isSelected = selectedIds.includes(p.id);
            return (
              <label
                key={p.id}
                className={`flex items-center gap-2.5 p-2 rounded-lg cursor-pointer transition-colors ${
                  isSelected
                    ? 'bg-[#D9A76A]/10 border border-[#D9A76A]/20'
                    : 'hover:bg-white/5 border border-transparent'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggle(p.id)}
                  className="rounded accent-[#D9A76A] flex-shrink-0"
                />
                {p.images[0] && (
                  <img src={p.images[0]} alt={p.title} className="w-7 h-7 rounded object-cover flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-white truncate">{p.title}</div>
                  <div className="text-[10px] text-[#8E8276]">{p.category} · {p.price} ₽</div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  {p.isNew && <span className="text-[9px] font-mono bg-emerald-900/60 text-emerald-300 px-1.5 py-0.5 rounded-full">NEW</span>}
                  {p.isPopular && <span className="text-[9px] font-mono bg-amber-900/60 text-[#D9A76A] px-1.5 py-0.5 rounded-full">ТОП</span>}
                  {!p.inStock && <span className="text-[9px] font-mono bg-red-900/60 text-red-300 px-1.5 py-0.5 rounded-full">НЕТ</span>}
                </div>
              </label>
            );
          })}
          {filtered.length === 0 && (
            <div className="py-6 text-center text-xs text-[#8E8276]">Ничего не найдено</div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   DIRECTIONS CARD EDITOR
   ============================================================ */
const DEFAULT_DIRECTION_CARDS = [
  {
    number: '01', category: 'Single Origin & Micro-lots',
    title: 'Моносорта и микролоты',
    description: 'Высокогорная арабика с уникальным терруаром. Чистые дескрипторы вкуса: от жасмина и бергамота до черной смородины и клубники.',
    imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=1200&auto=format&fit=crop',
    href: '/catalog/single-origin', actionLabel: 'Выбрать моносорт',
    tags: 'Эфиопия Иргачефф, Кения Ньери (SL28), Коста-Рика Анаэробика, Светлая обжарка (V60)',
    features: '100% Спешелти Арабика, Q-Score 85–89, Бесплатный помол',
  },
  {
    number: '02', category: 'Portable Drip Coffee',
    title: 'Дрип-пакеты в саше',
    description: 'Натуральный свежесмолотый кофе в индивидуальных фильтрах с азотным наполнением. Идеальный кофе в чашке за 2 минуты без кофемашины.',
    imageUrl: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?q=80&w=1200&auto=format&fit=crop',
    href: '/catalog/drip-coffee', actionLabel: 'В каталог дрип-кофе',
    tags: 'Mix Box 10 шт, Ethiopia Washed 10 шт, Balance Colombia 10 шт',
    features: 'Герметичный азотный барьер, 11.5г спешелти зерна в саше, В дорогу и офис',
  },
  {
    number: '03', category: 'Signature Espresso',
    title: 'Эспрессо-купажи ТАВ',
    description: 'Авторские смеси средней и тёмной обжарки для плотного эспрессо, капучино и домашних кофемашин. Бархатная крема и ноты пралине.',
    imageUrl: 'https://images.unsplash.com/photo-1611854779393-1b2da9d400fe?q=80&w=1200&auto=format&fit=crop',
    href: '/catalog/espresso-blends', actionLabel: 'Смотреть бленды',
    tags: 'ТАВ Signature Blend, Brazil Cerrado Dulce, Средняя и темная обжарка',
    features: 'Густая стойкая пенка, Низкая кислотность, Для эспрессо и гейзера',
  },
  {
    number: '04', category: 'Brewing Gear & Barista Tools',
    title: 'Аксессуары & V60',
    description: 'Профессиональное оборудование для альтернативного заваривания дома: японские воронки Hario V60, ручные кофемолки Timemore со стальными жерновами.',
    imageUrl: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?q=80&w=1200&auto=format&fit=crop',
    href: '/catalog/accessories', actionLabel: 'Оборудование для дома',
    tags: 'Hario V60, Timemore C2, Фильтры Hario',
    features: 'Японское качество, Профессиональные жернова, Доставка',
  },
];

function DirectionsCardEditor({
  cards,
  onChange,
}: {
  cards: any[];
  onChange: (cards: any[]) => void;
}) {
  const [expandedCard, setExpandedCard] = useState<number | null>(0);

  const updateCard = (idx: number, field: string, value: string) => {
    const next = cards.map((c, i) => (i === idx ? { ...c, [field]: value } : c));
    onChange(next);
  };

  return (
    <div className="space-y-2">
      <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#D9A76A] flex items-center gap-2">
        <LayoutGrid className="h-3.5 w-3.5" />
        Карточки направлений (4)
      </label>
      {cards.map((card, idx) => (
        <div key={idx} className="rounded-xl border border-white/10 overflow-hidden">
          {/* Card header */}
          <button
            type="button"
            onClick={() => setExpandedCard(expandedCard === idx ? null : idx)}
            className="w-full flex items-center gap-3 p-3 bg-white/[0.02] hover:bg-white/[0.04] transition-colors text-left"
          >
            <span className="text-lg font-black font-serif text-white/30">{card.number}</span>
            <span className="flex-1 text-xs font-semibold text-white truncate">{card.title}</span>
            <ChevronDown className={`h-3.5 w-3.5 text-[#8E8276] transition-transform ${expandedCard === idx ? 'rotate-180' : ''}`} />
          </button>

          {expandedCard === idx && (
            <div className="p-3 space-y-3 border-t border-white/5">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-[#8E8276]">Категория / Подзаголовок</label>
                  <input type="text" value={card.category}
                    onChange={(e) => updateCard(idx, 'category', e.target.value)}
                    className="w-full rounded-lg bg-[#1C1410] border border-white/10 py-2 px-2.5 text-xs text-white" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-[#8E8276]">Номер карточки</label>
                  <input type="text" value={card.number}
                    onChange={(e) => updateCard(idx, 'number', e.target.value)}
                    className="w-full rounded-lg bg-[#1C1410] border border-white/10 py-2 px-2.5 text-xs text-white" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-[#8E8276]">Заголовок</label>
                <input type="text" value={card.title}
                  onChange={(e) => updateCard(idx, 'title', e.target.value)}
                  className="w-full rounded-lg bg-[#1C1410] border border-white/10 py-2 px-2.5 text-xs text-white font-semibold" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-[#8E8276]">Описание</label>
                <textarea rows={2} value={card.description}
                  onChange={(e) => updateCard(idx, 'description', e.target.value)}
                  className="w-full rounded-lg bg-[#1C1410] border border-white/10 p-2.5 text-xs text-[#C4B9AD] resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-[#8E8276]">Ссылка карточки</label>
                  <input type="text" value={card.href}
                    onChange={(e) => updateCard(idx, 'href', e.target.value)}
                    className="w-full rounded-lg bg-[#1C1410] border border-white/10 py-2 px-2.5 text-xs text-white" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-[#8E8276]">Текст кнопки</label>
                  <input type="text" value={card.actionLabel}
                    onChange={(e) => updateCard(idx, 'actionLabel', e.target.value)}
                    className="w-full rounded-lg bg-[#1C1410] border border-white/10 py-2 px-2.5 text-xs text-white" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-[#8E8276]">Теги (через запятую)</label>
                <input type="text" value={card.tags}
                  onChange={(e) => updateCard(idx, 'tags', e.target.value)}
                  placeholder="Тег 1, Тег 2, Тег 3"
                  className="w-full rounded-lg bg-[#1C1410] border border-white/10 py-2 px-2.5 text-xs text-white" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-[#8E8276]">Фичи / Характеристики (через запятую)</label>
                <input type="text" value={card.features}
                  onChange={(e) => updateCard(idx, 'features', e.target.value)}
                  placeholder="Фича 1, Фича 2, Фича 3"
                  className="w-full rounded-lg bg-[#1C1410] border border-white/10 py-2 px-2.5 text-xs text-white" />
              </div>
              <ImageUpload
                value={card.imageUrl}
                onChange={(val) => updateCard(idx, 'imageUrl', val)}
                label="Изображение карточки"
                compact
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

/* ============================================================
   COLLECTION CARD EDITOR
   ============================================================ */
const DEFAULT_COLLECTION_CARDS = [
  {
    id: 'col-filter-brew', slug: 'filter-brew',
    title: 'Для фильтра и воронки V60',
    description: 'Яркие ягодно-цветочные моносорта светлой обжарки с чистым телом и выразительной сладостью спелых фруктов.',
    badgeText: 'Светлая обжарка • Pour Over',
    coverImage: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'col-espresso-lovers', slug: 'espresso-lovers',
    title: 'Плотный шоколадный эспрессо',
    description: 'Сорта и фирменные смеси средней и тёмной обжарки с плотным телом, нотами какао, орехов и густой бархатной пенкой.',
    badgeText: 'Эспрессо & Мока • Без лишней кислоты',
    coverImage: 'https://images.unsplash.com/photo-1611854779393-1b2da9d400fe?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'col-drip-discovery', slug: 'drip-discovery',
    title: 'Дрипы в дорогу и офис',
    description: 'Порционный спешелти кофе в индивидуальных фильтрах с азотной средой. Заваривайте идеальную чашку за 2 минуты в любых условиях.',
    badgeText: '100% Спешелти • Без кофеварки',
    coverImage: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'col-rare-microlots', slug: 'rare-microlots',
    title: 'Редкие микролоты и анаэробика',
    description: 'Экспериментальные ферментации, лоты с высоких высот и премиальные разновидности с комплексным многослойным букетом.',
    badgeText: 'Q-Score 88+ • Лимитированный тираж',
    coverImage: 'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?q=80&w=800&auto=format&fit=crop',
  },
];

function CollectionCardEditor({
  cards,
  onChange,
}: {
  cards: any[];
  onChange: (cards: any[]) => void;
}) {
  const [expandedCard, setExpandedCard] = useState<number | null>(0);

  const updateCard = (idx: number, field: string, value: string) => {
    const next = cards.map((c, i) => (i === idx ? { ...c, [field]: value } : c));
    onChange(next);
  };

  return (
    <div className="space-y-2">
      <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#D9A76A] flex items-center gap-2">
        <LayoutGrid className="h-3.5 w-3.5" />
        Карточки подборок ({cards.length})
      </label>
      {cards.map((card, idx) => (
        <div key={idx} className="rounded-xl border border-white/10 overflow-hidden">
          <button
            type="button"
            onClick={() => setExpandedCard(expandedCard === idx ? null : idx)}
            className="w-full flex items-center gap-3 p-3 bg-white/[0.02] hover:bg-white/[0.04] transition-colors text-left"
          >
            {card.coverImage && (
              <img src={card.coverImage} alt="" className="w-8 h-8 rounded object-cover flex-shrink-0 opacity-60" />
            )}
            <span className="flex-1 text-xs font-semibold text-white truncate">{card.title || `Подборка ${idx + 1}`}</span>
            <ChevronDown className={`h-3.5 w-3.5 text-[#8E8276] transition-transform ${expandedCard === idx ? 'rotate-180' : ''}`} />
          </button>

          {expandedCard === idx && (
            <div className="p-3 space-y-3 border-t border-white/5">
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-[#8E8276]">Название подборки</label>
                <input type="text" value={card.title || ''}
                  onChange={(e) => updateCard(idx, 'title', e.target.value)}
                  className="w-full rounded-lg bg-[#1C1410] border border-white/10 py-2 px-2.5 text-xs text-white font-semibold" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-[#8E8276]">Описание</label>
                <textarea rows={2} value={card.description || ''}
                  onChange={(e) => updateCard(idx, 'description', e.target.value)}
                  className="w-full rounded-lg bg-[#1C1410] border border-white/10 p-2.5 text-xs text-[#C4B9AD] resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-[#8E8276]">Бейдж (подзаголовок)</label>
                  <input type="text" value={card.badgeText || ''}
                    onChange={(e) => updateCard(idx, 'badgeText', e.target.value)}
                    placeholder="Например: Светлая обжарка • Pour Over"
                    className="w-full rounded-lg bg-[#1C1410] border border-white/10 py-2 px-2.5 text-xs text-white" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-[#8E8276]">Slug (для URL: /catalog?collection=...)</label>
                  <input type="text" value={card.slug || ''}
                    onChange={(e) => updateCard(idx, 'slug', e.target.value)}
                    placeholder="например: filter-brew"
                    className="w-full rounded-lg bg-[#1C1410] border border-white/10 py-2 px-2.5 text-xs text-[#8E8276] font-mono" />
                </div>
              </div>
              <ImageUpload
                value={card.coverImage || ''}
                onChange={(val) => updateCard(idx, 'coverImage', val)}
                label="Изображение (фон)"
                aspectRatio="wide"
                compact
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export function BlockEditorClient({
  initialPage,
  allProducts = [],
  allCountries = [],
}: {
  initialPage: PageModel;
  allProducts?: AdminProduct[];
  allCountries?: AdminCountry[];
}) {
  const router = useRouter();
  const [page, setPage] = useState<PageModel>(initialPage);
  const [activeTab, setActiveTab] = useState<'blocks' | 'seo'>('blocks');
  const [expandedBlocks, setExpandedBlocks] = useState<Record<string, boolean>>({
    [initialPage.blocks[0]?.id || '']: true,
  });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const publicUrl = page.slug === 'home' ? '/' : `/${page.slug}`;

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const toggleExpand = (blockId: string) => {
    setExpandedBlocks((prev) => ({
      ...prev,
      [blockId]: !prev[blockId],
    }));
  };

  // Toggle active status
  const toggleBlockActive = async (blockId: string, currentStatus: boolean) => {
    const updatedStatus = !currentStatus;
    setPage((prev) => ({
      ...prev,
      blocks: prev.blocks.map((b) => (b.id === blockId ? { ...b, isActive: updatedStatus } : b)),
    }));

    try {
      await fetch(`/api/admin/blocks/${blockId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: updatedStatus }),
      });
      showToast('success', updatedStatus ? 'Секция включена' : 'Секция скрыта');
    } catch {
      showToast('error', 'Не удалось обновить статус');
    }
  };

  // Move Block Up/Down
  const moveBlock = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= page.blocks.length) return;

    const newBlocks = [...page.blocks];
    const [moved] = newBlocks.splice(index, 1);
    newBlocks.splice(targetIndex, 0, moved);

    const reordered = newBlocks.map((b, idx) => ({ ...b, order: idx + 1 }));
    setPage((prev) => ({ ...prev, blocks: reordered }));

    try {
      await fetch('/api/admin/blocks/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pageSlug: page.slug,
          updates: reordered.map((b) => ({ id: b.id, order: b.order })),
        }),
      });
      showToast('success', 'Порядок блоков обновлен');
    } catch {
      showToast('error', 'Не удалось сохранить порядок');
    }
  };

  // Update Block Content field
  const updateContentField = (blockId: string, path: string, value: any) => {
    setPage((prev) => ({
      ...prev,
      blocks: prev.blocks.map((b) => {
        if (b.id !== blockId) return b;
        const newContent = { ...b.content };
        
        // simple dot notation support
        const parts = path.split('.');
        if (parts.length === 1) {
          newContent[parts[0]] = value;
        } else if (parts.length === 2) {
          newContent[parts[0]] = {
            ...(newContent[parts[0]] || {}),
            [parts[1]]: value,
          };
        }
        return { ...b, content: newContent };
      }),
    }));
  };

  // Save single block
  const saveBlock = async (block: PageBlockModel) => {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/blocks/${block.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: block.name,
          isActive: block.isActive,
          order: block.order,
          content: block.content,
        }),
      });

      if (!res.ok) throw new Error();
      showToast('success', `Секция «${block.name}» сохранена`);
    } catch {
      showToast('error', 'Ошибка при сохранении секции');
    } finally {
      setSaving(false);
    }
  };

  // Save SEO & Page Info
  const savePageInfo = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/pages/${page.slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: page.title,
          seoTitle: page.seoTitle,
          seoDescription: page.seoDescription,
          seoKeywords: page.seoKeywords,
          ogImage: page.ogImage,
          isPublished: page.isPublished,
        }),
      });

      if (!res.ok) throw new Error();
      showToast('success', 'Настройки страницы и SEO сохранены');
    } catch {
      showToast('error', 'Ошибка при сохранении настроек');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-7 pb-16">
      
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-5 duration-200">
          <div
            className={cn(
              'px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-xs font-semibold backdrop-blur-xl border',
              toast.type === 'success'
                ? 'bg-emerald-950/90 text-emerald-300 border-emerald-500/30'
                : 'bg-rose-950/90 text-rose-300 border-rose-500/30'
            )}
          >
            {toast.type === 'success' ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            ) : (
              <AlertCircle className="h-4 w-4 text-rose-400" />
            )}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Top Header with Breadcrumbs & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-white/10">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono text-[#8E8276]">
            <Link href="/admin/pages" className="hover:text-[#D9A76A] transition-colors">
              Страницы
            </Link>
            <span>/</span>
            <span className="text-[#E5CBA8] font-bold">{page.title}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-serif text-white flex items-center gap-3">
            <span>{page.title}</span>
            <span className="text-xs font-mono font-normal text-[#8E8276] px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/10">
              {page.slug}
            </span>
          </h1>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <a
            href={publicUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-xs font-semibold text-white transition-colors border border-white/10"
          >
            <Eye className="h-4 w-4 text-[#D9A76A]" />
            <span>Посмотреть на сайте</span>
          </a>

          <button
            onClick={() => {
              if (activeTab === 'seo') {
                savePageInfo();
              } else {
                page.blocks.forEach((b) => saveBlock(b));
              }
            }}
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#C2905A] via-[#D9A76A] to-[#E5CBA8] hover:brightness-105 active:scale-95 text-[#0E0A08] text-xs font-bold transition-all shadow-[0_0_20px_rgba(217,167,106,0.35)] cursor-pointer disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            <span>{saving ? 'Сохранение...' : 'Сохранить всё'}</span>
          </button>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-1">
        <button
          onClick={() => setActiveTab('blocks')}
          className={cn(
            'px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer',
            activeTab === 'blocks'
              ? 'bg-[#D9A76A] text-[#0E0A08] shadow-md'
              : 'text-[#8E8276] hover:text-white hover:bg-white/5'
          )}
        >
          <Layers className="h-4 w-4" />
          <span>Блоки и Контент ({page.blocks.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('seo')}
          className={cn(
            'px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer',
            activeTab === 'seo'
              ? 'bg-[#D9A76A] text-[#0E0A08] shadow-md'
              : 'text-[#8E8276] hover:text-white hover:bg-white/5'
          )}
        >
          <Globe className="h-4 w-4" />
          <span>SEO & Мета-теги</span>
        </button>
      </div>

      {/* TAB 1: BLOCKS EDITOR */}
      {activeTab === 'blocks' && (
        <div className="space-y-4">
          <div className="text-xs text-[#8E8276] flex items-center justify-between font-mono">
            <span>Секции отображаются на сайте сверху вниз в указанном порядке:</span>
            <span>{page.blocks.filter((b) => b.isActive).length} активных</span>
          </div>

          <div className="space-y-4">
            {page.blocks.map((block, index) => {
              const isExpanded = expandedBlocks[block.id];

              return (
                <div
                  key={block.id}
                  className={cn(
                    'rounded-2xl border transition-all duration-200 overflow-hidden shadow-xl',
                    block.isActive
                      ? 'bg-[#140E0B] border-white/15'
                      : 'bg-[#100B09]/60 border-white/5 opacity-60'
                  )}
                >
                  {/* Block Header Row */}
                  <div className="p-4 sm:p-5 flex items-center justify-between gap-3 bg-white/[0.02]">
                    
                    {/* Left: Move arrows + Type badge + Name */}
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex flex-col gap-0.5 shrink-0">
                        <button
                          disabled={index === 0}
                          onClick={() => moveBlock(index, 'up')}
                          className="p-1 rounded hover:bg-white/10 text-stone-400 hover:text-white disabled:opacity-20 cursor-pointer"
                          title="Переместить выше"
                        >
                          <ChevronUp className="h-3.5 w-3.5" />
                        </button>
                        <button
                          disabled={index === page.blocks.length - 1}
                          onClick={() => moveBlock(index, 'down')}
                          className="p-1 rounded hover:bg-white/10 text-stone-400 hover:text-white disabled:opacity-20 cursor-pointer"
                          title="Переместить ниже"
                        >
                          <ChevronDown className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      <span className="w-6 h-6 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center font-mono text-[11px] font-bold text-[#D9A76A] shrink-0">
                        {index + 1}
                      </span>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-sm text-white truncate">
                            {block.name}
                          </span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20 text-[#D9A76A]">
                            {block.blockType}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Toggle + Save + Expand */}
                    <div className="flex items-center gap-2 shrink-0">
                      {/* Active toggle */}
                      <button
                        onClick={() => toggleBlockActive(block.id, block.isActive)}
                        className={cn(
                          'px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer border',
                          block.isActive
                            ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                            : 'bg-stone-800 border-stone-700 text-stone-400'
                        )}
                        title={block.isActive ? 'Скрыть блок' : 'Показать блок'}
                      >
                        <span className={cn('w-2 h-2 rounded-full', block.isActive ? 'bg-emerald-400' : 'bg-stone-500')} />
                        <span className="hidden sm:inline">{block.isActive ? 'Активен' : 'Скрыт'}</span>
                      </button>

                      {/* Save block */}
                      <button
                        onClick={() => saveBlock(block)}
                        disabled={saving}
                        className="px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-xs font-semibold text-white transition-all cursor-pointer"
                      >
                        Сохранить
                      </button>

                      {/* Expand / Collapse */}
                      <button
                        onClick={() => toggleExpand(block.id)}
                        className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-stone-300 cursor-pointer"
                      >
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </button>
                    </div>

                  </div>

                  {/* Block Form Fields (When Expanded) */}
                  {isExpanded && (
                    <div className="p-5 sm:p-6 border-t border-white/10 space-y-5 bg-[#0D0907]/80">
                      
                      {/* Common block name edit */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-white/5">
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#8E8276]">
                            Название секции (для админки)
                          </label>
                          <input
                            type="text"
                            value={block.name}
                            onChange={(e) => {
                              const val = e.target.value;
                              setPage((prev) => ({
                                ...prev,
                                blocks: prev.blocks.map((b) => (b.id === block.id ? { ...b, name: val } : b)),
                              }));
                            }}
                            className="w-full rounded-xl bg-[#1C1410] border border-white/10 py-2.5 px-3 text-xs text-white focus:outline-none focus:border-[#D9A76A]"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#8E8276]">
                            Тип секции (системный)
                          </label>
                          <input
                            type="text"
                            disabled
                            value={block.blockType}
                            className="w-full rounded-xl bg-white/[0.02] border border-white/5 py-2.5 px-3 text-xs font-mono text-stone-500 cursor-not-allowed"
                          />
                        </div>
                      </div>

                      {/* DYNAMIC FIELDS BASED ON blockType & CONTENT */}
                      <div className="space-y-4">

                        {/* ========== HERO BLOCK: home vs contacts vs brand hero ========== */}
                        {block.blockType === 'hero' && page.slug === 'home' && (
                          <HeroBlockEditor />
                        )}

                        {block.blockType === 'hero' && page.slug === 'contacts' && (
                          <ContactsHeroEditor
                            content={block.content || {}}
                            onChange={(field, val) => updateContentField(block.id, field, val)}
                          />
                        )}

                        {block.blockType === 'hero' && page.slug !== 'home' && page.slug !== 'contacts' && (
                          <div className="space-y-4">
                            {/* Badge */}
                            <div className="space-y-1.5">
                              <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#D9A76A]">
                                Верхний бейдж / Шильдик
                              </label>
                              <input
                                type="text"
                                value={block.content?.badge || ''}
                                onChange={(e) => updateContentField(block.id, 'badge', e.target.value)}
                                placeholder="ТАВ • SPECIALTY COFFEE ROASTERS"
                                className="w-full rounded-xl bg-[#1C1410] border border-white/10 py-2.5 px-3 text-xs text-white focus:outline-none focus:border-[#D9A76A]"
                              />
                            </div>

                            {/* Headline */}
                            <div className="space-y-1.5">
                              <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#C4B9AD]">
                                Главный заголовок
                              </label>
                              <input
                                type="text"
                                value={block.content?.headline || ''}
                                onChange={(e) => updateContentField(block.id, 'headline', e.target.value)}
                                placeholder="«Мы обжариваем зерно так, чтобы раскрыть его истинную природу»"
                                className="w-full rounded-xl bg-[#1C1410] border border-white/10 py-2.5 px-3 text-xs font-bold text-white focus:outline-none focus:border-[#D9A76A]"
                              />
                            </div>

                            {/* Headline Highlight */}
                            <div className="space-y-1.5">
                              <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#D9A76A]">
                                Выделенная золотая часть заголовка (опционально)
                              </label>
                              <input
                                type="text"
                                value={block.content?.headlineHighlight || ''}
                                onChange={(e) => updateContentField(block.id, 'headlineHighlight', e.target.value)}
                                placeholder="Оставьте пустым, если заголовок целиком указан выше"
                                className="w-full rounded-xl bg-[#1C1410] border border-white/10 py-2.5 px-3 text-xs text-[#E5CBA8] italic focus:outline-none focus:border-[#D9A76A]"
                              />
                            </div>

                            {/* Description */}
                            <div className="space-y-1.5">
                              <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#C4B9AD]">
                                Текст описания / Манифест
                              </label>
                              <textarea
                                rows={3}
                                value={block.content?.description || ''}
                                onChange={(e) => updateContentField(block.id, 'description', e.target.value)}
                                placeholder="ТАВ — это пространство, где кофе рассматривается как искусство..."
                                className="w-full rounded-xl bg-[#1C1410] border border-white/10 p-3 text-xs text-[#E5DDD3] focus:outline-none focus:border-[#D9A76A] leading-relaxed"
                              />
                            </div>

                            {/* Background Image Upload */}
                            <ImageUpload
                              value={block.content?.imageUrl || ''}
                              onChange={(url) => updateContentField(block.id, 'imageUrl', url)}
                              label="Фоновое изображение Hero"
                              placeholder="https://images.unsplash.com/... или /images/..."
                              aspectRatio="wide"
                            />

                            {/* Buttons */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5">
                              <div className="space-y-2">
                                <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#D9A76A]">
                                  Основная кнопка (Gold)
                                </label>
                                <input
                                  type="text"
                                  value={block.content?.primaryButton?.label || ''}
                                  onChange={(e) =>
                                    updateContentField(block.id, 'primaryButton', {
                                      ...(block.content?.primaryButton || {}),
                                      label: e.target.value,
                                    })
                                  }
                                  placeholder="Текст: Философия ТАВ"
                                  className="w-full rounded-xl bg-[#1C1410] border border-white/10 py-2 px-3 text-xs text-white"
                                />
                                <input
                                  type="text"
                                  value={block.content?.primaryButton?.href || ''}
                                  onChange={(e) =>
                                    updateContentField(block.id, 'primaryButton', {
                                      ...(block.content?.primaryButton || {}),
                                      href: e.target.value,
                                    })
                                  }
                                  placeholder="Ссылка: #philosophy"
                                  className="w-full rounded-xl bg-[#1C1410] border border-white/10 py-2 px-3 text-xs font-mono text-[#8E8276]"
                                />
                              </div>

                              <div className="space-y-2">
                                <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#8E8276]">
                                  Вторичная кнопка (Glass)
                                </label>
                                <input
                                  type="text"
                                  value={block.content?.secondaryButton?.label || ''}
                                  onChange={(e) =>
                                    updateContentField(block.id, 'secondaryButton', {
                                      ...(block.content?.secondaryButton || {}),
                                      label: e.target.value,
                                    })
                                  }
                                  placeholder="Текст: Каталог кофе"
                                  className="w-full rounded-xl bg-[#1C1410] border border-white/10 py-2 px-3 text-xs text-white"
                                />
                                <input
                                  type="text"
                                  value={block.content?.secondaryButton?.href || ''}
                                  onChange={(e) =>
                                    updateContentField(block.id, 'secondaryButton', {
                                      ...(block.content?.secondaryButton || {}),
                                      href: e.target.value,
                                    })
                                  }
                                  placeholder="Ссылка: /catalog"
                                  className="w-full rounded-xl bg-[#1C1410] border border-white/10 py-2 px-3 text-xs font-mono text-[#8E8276]"
                                />
                              </div>
                            </div>

                            {/* Metrics */}
                            <div className="space-y-2 p-4 rounded-xl bg-white/[0.02] border border-white/5">
                              <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#D9A76A]">
                                Плашки ключевых метрик (3 показателя)
                              </label>
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                {[0, 1, 2].map((idx) => {
                                  const currentMetric = block.content?.metrics?.[idx] || { value: '', label: '' };
                                  return (
                                    <div key={idx} className="space-y-1.5 p-3 rounded-lg bg-[#1C1410] border border-white/5">
                                      <span className="text-[10px] font-mono text-[#8E8276]">Метрика #{idx + 1}</span>
                                      <input
                                        type="text"
                                        value={currentMetric.value || ''}
                                        onChange={(e) => {
                                          const newMetrics = [...(block.content?.metrics || [{}, {}, {}])];
                                          newMetrics[idx] = { ...(newMetrics[idx] || {}), value: e.target.value };
                                          updateContentField(block.id, 'metrics', newMetrics);
                                        }}
                                        placeholder={idx === 0 ? '100%' : idx === 1 ? '84–89+' : '0 ₽'}
                                        className="w-full rounded-lg bg-black/40 border border-white/10 py-1.5 px-2 text-xs font-bold text-white"
                                      />
                                      <input
                                        type="text"
                                        value={currentMetric.label || ''}
                                        onChange={(e) => {
                                          const newMetrics = [...(block.content?.metrics || [{}, {}, {}])];
                                          newMetrics[idx] = { ...(newMetrics[idx] || {}), label: e.target.value };
                                          updateContentField(block.id, 'metrics', newMetrics);
                                        }}
                                        placeholder={idx === 0 ? 'Спешелти Арабика' : idx === 1 ? 'Баллы SCA' : 'Помол в подарок'}
                                        className="w-full rounded-lg bg-black/40 border border-white/10 py-1.5 px-2 text-[11px] text-[#C4B9AD]"
                                      />
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* ========== DIRECTIONS: card editor ========== */}
                        {block.blockType === 'directions' && (
                          <DirectionsCardEditor
                            cards={
                              Array.isArray(block.content?.cards) && block.content.cards.length === 4
                                ? block.content.cards
                                : DEFAULT_DIRECTION_CARDS
                            }
                            onChange={(cards) => updateContentField(block.id, 'cards', cards)}
                          />
                        )}

                        {/* ========== COLLECTIONS GRID: notification banner linking to /admin/collections ========== */}
                        {block.blockType === 'collections_grid' && (
                          <div className="p-4 rounded-2xl bg-[#D9A76A]/10 border border-[#D9A76A]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-xl bg-[#D9A76A]/20 text-[#D9A76A] shrink-0">
                                <LayoutGrid className="h-5 w-5" />
                              </div>
                              <div>
                                <h4 className="text-xs font-bold text-white">Управление подборками и товарами</h4>
                                <p className="text-[11px] text-[#C4B9AD]">
                                  Состав, обложки, бейджи и товары подборок управляются в едином справочнике PostgreSQL.
                                </p>
                              </div>
                            </div>
                            <Link
                              href="/admin/collections"
                              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#D9A76A] hover:bg-[#E5CBA8] text-[#0E0A08] text-xs font-bold transition-all shadow-md shrink-0 self-start sm:self-auto"
                            >
                              <span>Открыть подборки</span>
                              <ExternalLink className="h-3.5 w-3.5" />
                            </Link>
                          </div>
                        )}

                        {/* ========== FEATURED PRODUCTS: product picker ========== */}
                        {['featured_products_popular', 'featured_products_new'].includes(block.blockType) && (
                          <div className="space-y-2 p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
                            <div className="flex items-center justify-between">
                              <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#D9A76A]">
                                Товары в секции
                              </label>
                              {Array.isArray(block.content?.productIds) && block.content.productIds.length > 0 ? (
                                <span className="text-[10px] font-mono text-emerald-400">
                                  Ручной выбор ({block.content.productIds.length} шт)
                                </span>
                              ) : (
                                <span className="text-[10px] font-mono text-[#8E8276]">
                                  Авто: isPopular / isNew
                                </span>
                              )}
                            </div>
                            <ProductPickerPanel
                              allProducts={allProducts}
                              selectedIds={Array.isArray(block.content?.productIds) ? block.content.productIds : []}
                              onChange={(ids) => updateContentField(block.id, 'productIds', ids)}
                            />
                            {Array.isArray(block.content?.productIds) && block.content.productIds.length > 0 && (
                              <button
                                type="button"
                                onClick={() => updateContentField(block.id, 'productIds', [])}
                                className="text-[10px] font-mono text-[#8E8276] hover:text-red-400 transition-colors"
                              >
                                ✕ Сбросить выбор (вернуть авто-режим)
                              </button>
                            )}
                          </div>
                        )}

                        {/* ========== ROAST GUIDE: profile editor ========== */}
                        {block.blockType === 'roast_guide' && (
                          <RoastGuideEditor
                            profiles={Array.isArray(block.content?.profiles) ? block.content.profiles : []}
                            allProducts={allProducts}
                            onChange={(profiles) => updateContentField(block.id, 'profiles', profiles)}
                          />
                        )}

                        {/* ========== TERROIR ATLAS: terroir list editor ========== */}
                        {block.blockType === 'terroir_atlas' && (
                          <TerroirAtlasEditor
                            items={Array.isArray(block.content?.items) ? block.content.items : []}
                            allCountries={allCountries}
                            allProducts={allProducts}
                            onChange={(items) => updateContentField(block.id, 'items', items)}
                          />
                        )}

                        {/* ========== BOUTIQUE SHOWCASE: showroom zones editor ========== */}
                        {block.blockType === 'boutique_showcase' && (
                          <BoutiqueShowcaseEditor
                            content={block.content || {}}
                            onChange={(fieldOrZones, val) => {
                              if (typeof fieldOrZones === 'string') {
                                updateContentField(block.id, fieldOrZones, val);
                              } else {
                                updateContentField(block.id, 'zones', fieldOrZones);
                              }
                            }}
                          />
                        )}

                        {/* ========== MAP SECTION: interactive map and transport tips editor ========== */}
                        {block.blockType === 'map_section' && (
                          <MapSectionEditor
                            content={block.content || {}}
                            onChange={(field, val) => updateContentField(block.id, field, val)}
                          />
                        )}

                        {/* ========== CONCIERGE HUB: direct channels & guest privileges editor ========== */}
                        {block.blockType === 'concierge_hub' && (
                          <ConciergeHubEditor
                            content={block.content || {}}
                            onChange={(field, val) => updateContentField(block.id, field, val)}
                          />
                        )}

                        {/* ========== CONCIERGE TERMINAL: inquiry topics editor ========== */}
                        {block.blockType === 'concierge_terminal' && (
                          <ConciergeTerminalEditor
                            content={block.content || {}}
                            onChange={(fieldOrTopics, val) => {
                              if (typeof fieldOrTopics === 'string') {
                                updateContentField(block.id, fieldOrTopics, val);
                              } else {
                                updateContentField(block.id, 'topics', fieldOrTopics);
                              }
                            }}
                          />
                        )}

                        {/* ========== GUEST FAQ: 4 guest guide cards editor ========== */}
                        {block.blockType === 'guest_faq' && (
                          <GuestFaqEditor
                            content={block.content || {}}
                            onChange={(field, val) => updateContentField(block.id, field, val)}
                          />
                        )}

                        {/* ========== WHOLESALE BANNER: B2B callout editor ========== */}
                        {block.blockType === 'wholesale_banner' && (
                          <WholesaleBannerEditor
                            content={block.content || {}}
                            onChange={(field, val) => updateContentField(block.id, field, val)}
                          />
                        )}

                        {/* ========== GRINDING STATION: grinding methods editor ========== */}
                        {block.blockType === 'grinding_station' && (
                          <GrindingStationEditor
                            content={block.content || {}}
                            onChange={(field, val) => updateContentField(block.id, field, val)}
                          />
                        )}

                        {/* ========== COFFEE COLLECTION: header, tabs, and product picker editor ========== */}
                        {block.blockType === 'coffee_collection' && (
                          <CoffeeCollectionEditor
                            content={block.content || {}}
                            allProducts={allProducts}
                            onChange={(field, val) => updateContentField(block.id, field, val)}
                          />
                        )}

                        {/* ========== SENSORY CYCLE: freshness & standards editor ========== */}
                        {block.blockType === 'sensory_cycle' && (
                          <SensoryCycleEditor
                            content={block.content || {}}
                            onChange={(field, val) => updateContentField(block.id, field, val)}
                          />
                        )}

                        {/* ========== ALL OTHER BLOCKS: generic content fields ========== */}
                        {block.blockType !== 'hero' &&
                          ![
                            'grinding_station',
                            'coffee_collection',
                            'sensory_cycle',
                            'boutique_showcase',
                            'map_section',
                            'concierge_hub',
                            'concierge_terminal',
                            'guest_faq',
                            'wholesale_banner',
                            'roast_guide',
                            'terroir_atlas',
                            'directions',
                          ].includes(block.blockType) && (<>

                        {/* Badge */}
                        {(block.content?.badge !== undefined ||
                          ['directions','collections_grid','about_snippet','stores_section','featured_products_popular','featured_products_new','roast_guide','terroir_atlas','boutique_showcase','concierge_terminal'].includes(block.blockType)) && (
                          <div className="space-y-1.5">
                            <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#D9A76A]">
                              Верхний бейдж / Шильдик
                            </label>
                            <input
                              type="text"
                              value={block.content?.badge || ''}
                              onChange={(e) => updateContentField(block.id, 'badge', e.target.value)}
                              placeholder="Например: SPECIALTY COFFEE ROASTERS"
                              className="w-full rounded-xl bg-[#1C1410] border border-white/10 py-2.5 px-3 text-xs text-white focus:outline-none focus:border-[#D9A76A]"
                            />
                          </div>
                        )}

                        {/* Headline / Title */}
                        {(block.content?.headline !== undefined || block.content?.title !== undefined ||
                          ['directions','collections_grid','about_snippet','stores_section','roast_guide','terroir_atlas','boutique_showcase','concierge_terminal'].includes(block.blockType)) && (
                          <div className="space-y-1.5">
                            <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#C4B9AD]">
                              Главный заголовок
                            </label>
                            <input
                              type="text"
                              value={block.content?.headline || block.content?.title || ''}
                              onChange={(e) => {
                                if (block.content?.headline !== undefined || ['directions','about_snippet','stores_section'].includes(block.blockType)) {
                                  updateContentField(block.id, 'headline', e.target.value);
                                } else {
                                  updateContentField(block.id, 'title', e.target.value);
                                }
                              }}
                              className="w-full rounded-xl bg-[#1C1410] border border-white/10 py-2.5 px-3 text-xs font-bold text-white focus:outline-none focus:border-[#D9A76A]"
                            />
                          </div>
                        )}

                        {/* Headline Highlight (italic part) */}
                        {(block.content?.headlineHighlight !== undefined ||
                          ['directions','about_snippet','stores_section'].includes(block.blockType)) && (
                          <div className="space-y-1.5">
                            <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#D9A76A]">
                              Курсивная часть заголовка
                            </label>
                            <input
                              type="text"
                              value={block.content?.headlineHighlight || ''}
                              onChange={(e) => updateContentField(block.id, 'headlineHighlight', e.target.value)}
                              placeholder="Например: и чистота вкуса"
                              className="w-full rounded-xl bg-[#1C1410] border border-white/10 py-2.5 px-3 text-xs text-[#E5CBA8] italic focus:outline-none focus:border-[#D9A76A]"
                            />
                          </div>
                        )}

                        {/* Cursive subtitle (hero) */}
                        {block.content?.cursiveSubtitle !== undefined && (
                          <div className="space-y-1.5">
                            <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#D9A76A]">
                              Курсивный акцентный слоган
                            </label>
                            <input
                              type="text"
                              value={block.content.cursiveSubtitle || ''}
                              onChange={(e) => updateContentField(block.id, 'cursiveSubtitle', e.target.value)}
                              className="w-full rounded-xl bg-[#1C1410] border border-white/10 py-2.5 px-3 text-xs text-[#E5CBA8] focus:outline-none focus:border-[#D9A76A]"
                            />
                          </div>
                        )}

                        {/* Quote (about_snippet) */}
                        {(block.content?.quote !== undefined || block.blockType === 'about_snippet') && (
                          <div className="space-y-1.5">
                            <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#C4B9AD]">
                              Цитата / Манифест
                            </label>
                            <textarea
                              rows={3}
                              value={block.content?.quote || ''}
                              onChange={(e) => updateContentField(block.id, 'quote', e.target.value)}
                              placeholder="«Для ТАВ кофе — это не просто...»"
                              className="w-full rounded-xl bg-[#1C1410] border border-white/10 p-3 text-xs text-[#E5DDD3] italic focus:outline-none focus:border-[#D9A76A] leading-relaxed"
                            />
                          </div>
                        )}

                        {/* Subtitle / Description */}
                        {(block.content?.subtitle !== undefined || block.content?.description !== undefined ||
                          ['directions','collections_grid','about_snippet','stores_section','roast_guide','terroir_atlas','boutique_showcase','concierge_terminal'].includes(block.blockType)) && (
                          <div className="space-y-1.5">
                            <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#C4B9AD]">
                              Описание / Подзаголовок секции
                            </label>
                            <textarea
                              rows={3}
                              value={block.content?.description || block.content?.subtitle || ''}
                              onChange={(e) => {
                                if (block.content?.description !== undefined || ['directions','collections_grid','about_snippet','stores_section','roast_guide','terroir_atlas'].includes(block.blockType)) {
                                  updateContentField(block.id, 'description', e.target.value);
                                } else {
                                  updateContentField(block.id, 'subtitle', e.target.value);
                                }
                              }}
                              className="w-full rounded-xl bg-[#1C1410] border border-white/10 p-3 text-xs text-[#C4B9AD] focus:outline-none focus:border-[#D9A76A] leading-relaxed"
                            />
                          </div>
                        )}

                        {/* Philosophy extra paragraphs */}
                        {block.content?.description1 !== undefined && (
                          <div className="space-y-3">
                            <div className="space-y-1.5">
                              <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#C4B9AD]">
                                Первый абзац философии
                              </label>
                              <textarea
                                rows={2}
                                value={block.content.description1}
                                onChange={(e) => updateContentField(block.id, 'description1', e.target.value)}
                                className="w-full rounded-xl bg-[#1C1410] border border-white/10 p-3 text-xs text-white"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#C4B9AD]">
                                Второй абзац философии
                              </label>
                              <textarea
                                rows={2}
                                value={block.content.description2}
                                onChange={(e) => updateContentField(block.id, 'description2', e.target.value)}
                                className="w-full rounded-xl bg-[#1C1410] border border-white/10 p-3 text-xs text-white"
                              />
                            </div>
                          </div>
                        )}

                        {/* CTA Button (about_snippet) */}
                        {(block.content?.ctaLabel !== undefined || block.blockType === 'about_snippet') && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-mono text-[#8E8276]">
                                Текст кнопки CTA
                              </label>
                              <input
                                type="text"
                                value={block.content?.ctaLabel || ''}
                                onChange={(e) => updateContentField(block.id, 'ctaLabel', e.target.value)}
                                placeholder="Узнать больше о ТАВ"
                                className="w-full rounded-lg bg-[#1C1410] border border-white/10 py-2 px-2.5 text-xs text-white"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-mono text-[#8E8276]">
                                Ссылка кнопки CTA
                              </label>
                              <input
                                type="text"
                                value={block.content?.ctaHref || ''}
                                onChange={(e) => updateContentField(block.id, 'ctaHref', e.target.value)}
                                placeholder="/about"
                                className="w-full rounded-lg bg-[#1C1410] border border-white/10 py-2 px-2.5 text-xs text-white"
                              />
                            </div>
                          </div>
                        )}

                        {/* Buttons config */}
                        {block.content?.primaryButton && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-mono text-[#8E8276]">
                                Текст главной кнопки
                              </label>
                              <input
                                type="text"
                                value={block.content.primaryButton.label || ''}
                                onChange={(e) => updateContentField(block.id, 'primaryButton.label', e.target.value)}
                                className="w-full rounded-lg bg-[#1C1410] border border-white/10 py-2 px-2.5 text-xs text-white"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-mono text-[#8E8276]">
                                Ссылка главной кнопки
                              </label>
                              <input
                                type="text"
                                value={block.content.primaryButton.href || ''}
                                onChange={(e) => updateContentField(block.id, 'primaryButton.href', e.target.value)}
                                className="w-full rounded-lg bg-[#1C1410] border border-white/10 py-2 px-2.5 text-xs text-white"
                              />
                            </div>
                          </div>
                        )}

                        {/* Action Label / Href */}
                        {block.content?.actionLabel !== undefined && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-mono text-[#8E8276]">
                                Текст ссылки перехода
                              </label>
                              <input
                                type="text"
                                value={block.content.actionLabel || ''}
                                onChange={(e) => updateContentField(block.id, 'actionLabel', e.target.value)}
                                className="w-full rounded-lg bg-[#1C1410] border border-white/10 py-2 px-2.5 text-xs text-white"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-mono text-[#8E8276]">
                                URL ссылки перехода
                              </label>
                              <input
                                type="text"
                                value={block.content.actionHref || ''}
                                onChange={(e) => updateContentField(block.id, 'actionHref', e.target.value)}
                                className="w-full rounded-lg bg-[#1C1410] border border-white/10 py-2 px-2.5 text-xs text-white"
                              />
                            </div>
                          </div>
                        )}

                        {/* About Snippet Specific Fields */}
                        {block.blockType === 'about_snippet' && (
                          <div className="space-y-4 p-4 rounded-xl bg-white/[0.02] border border-white/5">
                            <ImageUpload
                              value={block.content?.imageUrl || ''}
                              onChange={(val) => updateContentField(block.id, 'imageUrl', val)}
                              label="Фотография секции"
                              placeholder="https://images.unsplash.com/..."
                            />

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div className="space-y-1.5">
                                <label className="text-[10px] font-mono text-[#8E8276]">
                                  Текст шильдика на фото
                                </label>
                                <input
                                  type="text"
                                  value={block.content?.featureStripTitle || ''}
                                  onChange={(e) => updateContentField(block.id, 'featureStripTitle', e.target.value)}
                                  placeholder="Дегустация и свежий помол"
                                  className="w-full rounded-lg bg-[#1C1410] border border-white/10 py-2 px-2.5 text-xs text-white"
                                />
                              </div>
                              <div className="space-y-1.5">
                                <label className="text-[10px] font-mono text-[#8E8276]">
                                  Бейдж шильдика на фото
                                </label>
                                <input
                                  type="text"
                                  value={block.content?.featureStripBadge || ''}
                                  onChange={(e) => updateContentField(block.id, 'featureStripBadge', e.target.value)}
                                  placeholder="Бесплатно"
                                  className="w-full rounded-lg bg-[#1C1410] border border-white/10 py-2 px-2.5 text-xs text-white"
                                />
                              </div>
                            </div>

                            {/* Mini-panel 1 */}
                            <div className="p-3 rounded-lg bg-black/30 border border-white/5 space-y-2">
                              <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#E5CBA8]">
                                Мини-панель 1 (слева)
                              </label>
                              <input
                                type="text"
                                value={block.content?.panel1Title || ''}
                                onChange={(e) => updateContentField(block.id, 'panel1Title', e.target.value)}
                                placeholder="Контроль Q-грейдинга"
                                className="w-full rounded-lg bg-[#1C1410] border border-white/10 py-1.5 px-2.5 text-xs text-white font-medium"
                              />
                              <textarea
                                rows={2}
                                value={block.content?.panel1Text || ''}
                                onChange={(e) => updateContentField(block.id, 'panel1Text', e.target.value)}
                                placeholder="Тестирование каждого лота на каппингах и точная калибровка профилей."
                                className="w-full rounded-lg bg-[#1C1410] border border-white/10 p-2 text-xs text-[#A89D91] resize-none"
                              />
                            </div>

                            {/* Mini-panel 2 */}
                            <div className="p-3 rounded-lg bg-black/30 border border-white/5 space-y-2">
                              <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#E5CBA8]">
                                Мини-панель 2 (справа)
                              </label>
                              <input
                                type="text"
                                value={block.content?.panel2Title || ''}
                                onChange={(e) => updateContentField(block.id, 'panel2Title', e.target.value)}
                                placeholder="Помол под ваш метод"
                                className="w-full rounded-lg bg-[#1C1410] border border-white/10 py-1.5 px-2.5 text-xs text-white font-medium"
                              />
                              <textarea
                                rows={2}
                                value={block.content?.panel2Text || ''}
                                onChange={(e) => updateContentField(block.id, 'panel2Text', e.target.value)}
                                placeholder="Бесплатно мелем зерно под эспрессо, V60, гейзер, турку или френч-пресс."
                                className="w-full rounded-lg bg-[#1C1410] border border-white/10 p-2 text-xs text-[#A89D91] resize-none"
                              />
                            </div>
                          </div>
                        )}

                        {/* Stores Section Specific Fields */}
                        {block.blockType === 'stores_section' && (
                          <div className="space-y-4 p-4 rounded-xl bg-white/[0.02] border border-white/5">
                            <ImageUpload
                              value={block.content?.photoUrl || ''}
                              onChange={(val) => updateContentField(block.id, 'photoUrl', val)}
                              label="Фотография пространства / фасада"
                              placeholder="/images/store-maykop-interior.jpg или https://..."
                              aspectRatio="video"
                            />

                            {/* Subtitle & Address */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div className="space-y-1.5">
                                <label className="text-[10px] font-mono text-[#8E8276]">
                                  Подзаголовок контактов
                                </label>
                                <input
                                  type="text"
                                  value={block.content?.contactsSubheading || ''}
                                  onChange={(e) => updateContentField(block.id, 'contactsSubheading', e.target.value)}
                                  placeholder="Адрес и контакты"
                                  className="w-full rounded-lg bg-[#1C1410] border border-white/10 py-2 px-2.5 text-xs text-white font-medium"
                                />
                              </div>
                              <div className="space-y-1.5">
                                <label className="text-[10px] font-mono text-[#8E8276]">
                                  Адрес кофейни
                                </label>
                                <input
                                  type="text"
                                  value={block.content?.address || ''}
                                  onChange={(e) => updateContentField(block.id, 'address', e.target.value)}
                                  placeholder="ул. К.А. Васильева, 2/1"
                                  className="w-full rounded-lg bg-[#1C1410] border border-white/10 py-2 px-2.5 text-xs text-white font-bold"
                                />
                              </div>
                            </div>

                            {/* Bus stop / Directions */}
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-mono text-[#8E8276]">
                                Ориентиры / Остановка и подъезд
                              </label>
                              <input
                                type="text"
                                value={block.content?.busStop || ''}
                                onChange={(e) => updateContentField(block.id, 'busStop', e.target.value)}
                                placeholder="Остановка «Улица 12-го Марта» (330 м) • Удобный подъезд с ул. Васильева"
                                className="w-full rounded-lg bg-[#1C1410] border border-white/10 py-2 px-2.5 text-xs text-white"
                              />
                            </div>

                            {/* Working hours & Phone */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                              <div className="space-y-1.5">
                                <label className="text-[10px] font-mono text-[#8E8276]">
                                  График работы
                                </label>
                                <input
                                  type="text"
                                  value={block.content?.workingHours || ''}
                                  onChange={(e) => updateContentField(block.id, 'workingHours', e.target.value)}
                                  placeholder="Ежедневно: 08:00 – 21:00"
                                  className="w-full rounded-lg bg-[#1C1410] border border-white/10 py-2 px-2.5 text-xs text-white"
                                />
                              </div>
                              <div className="space-y-1.5">
                                <label className="text-[10px] font-mono text-[#8E8276]">
                                  Телефон
                                </label>
                                <input
                                  type="text"
                                  value={block.content?.phone || ''}
                                  onChange={(e) => updateContentField(block.id, 'phone', e.target.value)}
                                  placeholder="+7 (900) 000-00-00"
                                  className="w-full rounded-lg bg-[#1C1410] border border-white/10 py-2 px-2.5 text-xs text-white font-mono"
                                />
                              </div>
                              <div className="space-y-1.5">
                                <label className="text-[10px] font-mono text-[#8E8276]">
                                  Пояснение к телефону
                                </label>
                                <input
                                  type="text"
                                  value={block.content?.phoneNote || ''}
                                  onChange={(e) => updateContentField(block.id, 'phoneNote', e.target.value)}
                                  placeholder="(Звонок бариста)"
                                  className="w-full rounded-lg bg-[#1C1410] border border-white/10 py-2 px-2.5 text-xs text-white"
                                />
                              </div>
                            </div>

                            {/* Top Badges on Photo */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div className="space-y-1.5">
                                <label className="text-[10px] font-mono text-[#8E8276]">
                                  Бейдж на фото (левый)
                                </label>
                                <input
                                  type="text"
                                  value={block.content?.topBadgeOpen || ''}
                                  onChange={(e) => updateContentField(block.id, 'topBadgeOpen', e.target.value)}
                                  placeholder="Открыто для вас"
                                  className="w-full rounded-lg bg-[#1C1410] border border-white/10 py-2 px-2.5 text-xs text-white"
                                />
                              </div>
                              <div className="space-y-1.5">
                                <label className="text-[10px] font-mono text-[#8E8276]">
                                  Бейдж на фото (правый)
                                </label>
                                <input
                                  type="text"
                                  value={block.content?.topBadgeParking || ''}
                                  onChange={(e) => updateContentField(block.id, 'topBadgeParking', e.target.value)}
                                  placeholder="Парковка 0 ₽"
                                  className="w-full rounded-lg bg-[#1C1410] border border-white/10 py-2 px-2.5 text-xs text-white"
                                />
                              </div>
                            </div>

                            {/* 3 Service Pills */}
                            <div className="space-y-2">
                              <label className="text-[10px] font-mono text-[#8E8276]">
                                Сервисные плашки (3 шт)
                              </label>
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                                <input
                                  type="text"
                                  value={block.content?.pill1 || ''}
                                  onChange={(e) => updateContentField(block.id, 'pill1', e.target.value)}
                                  placeholder="Помол 0 ₽"
                                  className="rounded-lg bg-[#1C1410] border border-white/10 py-2 px-2.5 text-xs text-white"
                                />
                                <input
                                  type="text"
                                  value={block.content?.pill2 || ''}
                                  onChange={(e) => updateContentField(block.id, 'pill2', e.target.value)}
                                  placeholder="Бронь 15 мин"
                                  className="rounded-lg bg-[#1C1410] border border-white/10 py-2 px-2.5 text-xs text-white"
                                />
                                <input
                                  type="text"
                                  value={block.content?.pill3 || ''}
                                  onChange={(e) => updateContentField(block.id, 'pill3', e.target.value)}
                                  placeholder="Pet-friendly"
                                  className="rounded-lg bg-[#1C1410] border border-white/10 py-2 px-2.5 text-xs text-white"
                                />
                              </div>
                            </div>

                            {/* Maps & Navigation */}
                            <div className="p-3 rounded-lg bg-black/30 border border-white/5 space-y-3">
                              <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#D9A76A]">
                                Кнопки навигации и карт
                              </label>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="space-y-1">
                                  <label className="text-[10px] font-mono text-[#8E8276]">Текст кнопки Яндекс Карты</label>
                                  <input
                                    type="text"
                                    value={block.content?.yandexMapsBtnText || ''}
                                    onChange={(e) => updateContentField(block.id, 'yandexMapsBtnText', e.target.value)}
                                    placeholder="Маршрут в Яндекс Карты"
                                    className="w-full rounded-lg bg-[#1C1410] border border-white/10 py-1.5 px-2.5 text-xs text-white"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[10px] font-mono text-[#8E8276]">Ссылка на Яндекс Карты</label>
                                  <input
                                    type="text"
                                    value={block.content?.yandexMapsUrl || ''}
                                    onChange={(e) => updateContentField(block.id, 'yandexMapsUrl', e.target.value)}
                                    placeholder="https://yandex.ru/maps/..."
                                    className="w-full rounded-lg bg-[#1C1410] border border-white/10 py-1.5 px-2.5 text-xs text-[#8E8276]"
                                  />
                                </div>
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="space-y-1">
                                  <label className="text-[10px] font-mono text-[#8E8276]">Текст кнопки 2ГИС</label>
                                  <input
                                    type="text"
                                    value={block.content?.twoGisBtnText || ''}
                                    onChange={(e) => updateContentField(block.id, 'twoGisBtnText', e.target.value)}
                                    placeholder="Открыть в 2ГИС"
                                    className="w-full rounded-lg bg-[#1C1410] border border-white/10 py-1.5 px-2.5 text-xs text-white"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[10px] font-mono text-[#8E8276]">Ссылка на 2ГИС</label>
                                  <input
                                    type="text"
                                    value={block.content?.twoGisUrl || ''}
                                    onChange={(e) => updateContentField(block.id, 'twoGisUrl', e.target.value)}
                                    placeholder="https://2gis.ru/..."
                                    className="w-full rounded-lg bg-[#1C1410] border border-white/10 py-1.5 px-2.5 text-xs text-[#8E8276]"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        </>)}


                      </div>

                      {/* Save this block footer */}
                      <div className="pt-3 border-t border-white/5 flex justify-end">
                        <button
                          onClick={() => saveBlock(block)}
                          disabled={saving}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#D9A76A] hover:bg-[#E5CBA8] text-[#0E0A08] text-xs font-bold transition-all shadow"
                        >
                          <Save className="h-3.5 w-3.5" />
                          <span>Сохранить секцию</span>
                        </button>
                      </div>

                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: SEO & METADATA */}
      {activeTab === 'seo' && (
        <div className="rounded-3xl bg-[#140E0B] border border-white/10 p-6 sm:p-8 space-y-6 shadow-2xl max-w-3xl">
          <div className="space-y-1 pb-4 border-b border-white/10">
            <h2 className="text-lg font-bold font-serif text-white">
              Поисковая оптимизация (SEO) и метатеги
            </h2>
            <p className="text-xs text-[#8E8276]">
              Настройте то, как страница выглядит в результатах поиска Яндекса, Google и при отправке ссылки в Telegram/VK.
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-[#C4B9AD]">
                Meta Title (Заголовок страницы)
              </label>
              <input
                type="text"
                value={page.seoTitle || ''}
                onChange={(e) => setPage({ ...page, seoTitle: e.target.value })}
                placeholder="Заголовок для браузера и поисковиков"
                className="w-full rounded-xl bg-[#1C1410] border border-white/10 py-3 px-3.5 text-xs text-white focus:outline-none focus:border-[#D9A76A]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-[#C4B9AD]">
                Meta Description (Описание)
              </label>
              <textarea
                rows={3}
                value={page.seoDescription || ''}
                onChange={(e) => setPage({ ...page, seoDescription: e.target.value })}
                placeholder="Краткое описание страницы для сниппета в поисковой выдаче"
                className="w-full rounded-xl bg-[#1C1410] border border-white/10 p-3.5 text-xs text-white focus:outline-none focus:border-[#D9A76A] leading-relaxed"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-[#C4B9AD]">
                Ключевые слова (Keywords)
              </label>
              <input
                type="text"
                value={page.seoKeywords || ''}
                onChange={(e) => setPage({ ...page, seoKeywords: e.target.value })}
                placeholder="спешелти кофе, зерновой кофе Майкоп, дрип-пакеты"
                className="w-full rounded-xl bg-[#1C1410] border border-white/10 py-3 px-3.5 text-xs text-white focus:outline-none focus:border-[#D9A76A]"
              />
            </div>

            {/* Google / Yandex Search Preview Card */}
            <div className="p-4 rounded-2xl bg-[#0D0907] border border-white/10 space-y-1 mt-4">
              <div className="text-[10px] font-mono text-[#8E8276] uppercase">
                Превью в поисковой выдаче:
              </div>
              <div className="text-xs text-sky-400 font-medium truncate">
                https://tav-coffee.ru{publicUrl}
              </div>
              <div className="text-sm font-semibold text-[#8ab4f8] hover:underline cursor-pointer">
                {page.seoTitle || page.title}
              </div>
              <div className="text-xs text-[#bdc1c6] leading-snug line-clamp-2">
                {page.seoDescription || 'Описание страницы отсутствует'}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 flex justify-end">
            <button
              onClick={savePageInfo}
              disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#D9A76A] hover:bg-[#E5CBA8] text-[#0E0A08] text-xs font-bold transition-all shadow active:scale-95 cursor-pointer"
            >
              <Save className="h-4 w-4" />
              <span>Сохранить настройки SEO</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
