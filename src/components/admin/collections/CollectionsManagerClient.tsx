'use client';

import React, { useState, useMemo } from 'react';
import {
  LayoutGrid,
  Plus,
  Search,
  Edit2,
  Trash2,
  Package,
  X,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ChevronUp,
  ChevronDown,
  Sparkles,
  ArrowRight,
  Image as ImageIcon,
} from 'lucide-react';
import { AdminCollectionItem } from '@/lib/db/collections';
import { ImageUpload } from '@/components/admin/ImageUpload';

export interface AdminProductPickerItem {
  id: string;
  title: string;
  price: number;
  images: string[];
  category: string;
  isNew: boolean;
  isPopular: boolean;
  inStock: boolean;
}

interface CollectionsManagerClientProps {
  initialCollections: AdminCollectionItem[];
  allProducts: AdminProductPickerItem[];
}

export function CollectionsManagerClient({
  initialCollections,
  allProducts,
}: CollectionsManagerClientProps) {
  const [collections, setCollections] = useState<AdminCollectionItem[]>(initialCollections);
  const [search, setSearch] = useState('');
  const [editingCollection, setEditingCollection] = useState<AdminCollectionItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [deletingCollection, setDeletingCollection] = useState<AdminCollectionItem | null>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Form states
  const [formTitle, setFormTitle] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formBadgeText, setFormBadgeText] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formCoverImage, setFormCoverImage] = useState('');
  const [formOrder, setFormOrder] = useState(0);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [productSearch, setProductSearch] = useState('');

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const openCreateModal = () => {
    setFormTitle('');
    setFormSlug('');
    setFormBadgeText('');
    setFormDescription('');
    setFormCoverImage('https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=800&auto=format&fit=crop');
    setFormOrder(collections.length + 1);
    setSelectedProductIds([]);
    setProductSearch('');
    setIsCreating(true);
    setEditingCollection(null);
  };

  const openEditModal = (col: AdminCollectionItem) => {
    setFormTitle(col.title);
    setFormSlug(col.slug);
    setFormBadgeText(col.badgeText || '');
    setFormDescription(col.description);
    setFormCoverImage(col.coverImage);
    setFormOrder(col.order);
    setSelectedProductIds(col.products.map((p) => p.productId));
    setProductSearch('');
    setEditingCollection(col);
    setIsCreating(false);
  };

  const closeModal = () => {
    setIsCreating(false);
    setEditingCollection(null);
  };

  // Lock body & html scroll when any modal is open
  React.useEffect(() => {
    const isAnyModalOpen = isCreating || !!editingCollection || !!deletingCollection;
    if (!isAnyModalOpen) return;

    const prevBodyOverflow = document.body.style.overflow;
    const prevHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = prevBodyOverflow;
      document.documentElement.style.overflow = prevHtmlOverflow;
    };
  }, [isCreating, editingCollection, deletingCollection]);

  const handleTitleChange = (val: string) => {
    setFormTitle(val);
    if (isCreating && !formSlug) {
      const translit = val
        .toLowerCase()
        .replace(/[^a-z0-9а-яё]+/g, '-')
        .replace(/а/g, 'a').replace(/б/g, 'b').replace(/в/g, 'v').replace(/г/g, 'g')
        .replace(/д/g, 'd').replace(/е/g, 'e').replace(/ё/g, 'e').replace(/ж/g, 'zh')
        .replace(/з/g, 'z').replace(/и/g, 'i').replace(/й/g, 'y').replace(/к/g, 'k')
        .replace(/л/g, 'l').replace(/м/g, 'm').replace(/н/g, 'n').replace(/о/g, 'o')
        .replace(/п/g, 'p').replace(/р/g, 'r').replace(/с/g, 's').replace(/т/g, 't')
        .replace(/у/g, 'u').replace(/ф/g, 'f').replace(/х/g, 'h').replace(/ц/g, 'ts')
        .replace(/ч/g, 'ch').replace(/ш/g, 'sh').replace(/щ/g, 'sch').replace(/ъ/g, '')
        .replace(/ы/g, 'y').replace(/ь/g, '').replace(/э/g, 'e').replace(/ю/g, 'yu')
        .replace(/я/g, 'ya').replace(/[^a-z0-9-]+/g, '').replace(/^-+|-+$/g, '');
      setFormSlug(translit);
    }
  };

  const addProductToSelection = (id: string) => {
    if (!selectedProductIds.includes(id)) {
      setSelectedProductIds([...selectedProductIds, id]);
    }
  };

  const removeProductFromSelection = (id: string) => {
    setSelectedProductIds(selectedProductIds.filter((pId) => pId !== id));
  };

  const moveProductInSelection = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= selectedProductIds.length) return;
    const next = [...selectedProductIds];
    const [moved] = next.splice(index, 1);
    next.splice(targetIndex, 0, moved);
    setSelectedProductIds(next);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formSlug.trim() || !formDescription.trim() || !formCoverImage.trim()) {
      showToast('error', 'Заполните обязательные поля');
      return;
    }

    setSaving(true);
    try {
      if (isCreating) {
        const res = await fetch('/api/admin/collections', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: formTitle,
            slug: formSlug,
            badgeText: formBadgeText || null,
            description: formDescription,
            coverImage: formCoverImage,
            order: Number(formOrder) || 0,
            productIds: selectedProductIds,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Ошибка создания подборки');

        // Fetch full list again or append
        const refreshRes = await fetch('/api/admin/collections');
        const refreshData = await refreshRes.json();
        if (refreshData.collections) setCollections(refreshData.collections);

        showToast('success', `Подборка "${formTitle}" успешно создана`);
      } else if (editingCollection) {
        const res = await fetch(`/api/admin/collections/${editingCollection.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: formTitle,
            slug: formSlug,
            badgeText: formBadgeText || null,
            description: formDescription,
            coverImage: formCoverImage,
            order: Number(formOrder) || 0,
            productIds: selectedProductIds,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Ошибка обновления');

        const refreshRes = await fetch('/api/admin/collections');
        const refreshData = await refreshRes.json();
        if (refreshData.collections) setCollections(refreshData.collections);

        showToast('success', `Подборка "${formTitle}" обновлена`);
      }
      closeModal();
    } catch (err: any) {
      showToast('error', err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingCollection) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/collections/${deletingCollection.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Ошибка удаления');

      setCollections((prev) => prev.filter((c) => c.id !== deletingCollection.id));
      showToast('success', `Подборка "${deletingCollection.title}" удалена`);
      setDeletingCollection(null);
    } catch (err: any) {
      showToast('error', err.message);
    } finally {
      setSaving(false);
    }
  };

  const filteredCollections = useMemo(() => {
    if (!search.trim()) return collections;
    const q = search.toLowerCase().trim();
    return collections.filter(
      (c) => c.title.toLowerCase().includes(q) || c.slug.toLowerCase().includes(q)
    );
  }, [collections, search]);

  const availableProducts = useMemo(() => {
    return allProducts.filter((p) => !selectedProductIds.includes(p.id));
  }, [allProducts, selectedProductIds]);

  const searchedAvailableProducts = useMemo(() => {
    if (!productSearch.trim()) return availableProducts.slice(0, 10);
    const q = productSearch.toLowerCase().trim();
    return availableProducts.filter(
      (p) => p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
    );
  }, [availableProducts, productSearch]);

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl shadow-2xl border text-sm font-semibold transition-all animate-in fade-in slide-in-from-bottom-5 ${
            toast.type === 'success'
              ? 'bg-[#18120C] border-emerald-500/40 text-emerald-300'
              : 'bg-[#18120C] border-rose-500/40 text-rose-300'
          }`}
        >
          {toast.type === 'success' ? (
            <CheckCircle2 className="h-5 w-5 text-emerald-400" />
          ) : (
            <AlertCircle className="h-5 w-5 text-rose-400" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#D9A76A] mb-1">
            <LayoutGrid className="h-4 w-4" />
            <span>Тематические сеты</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white font-sans">
            Подборки и коллекции
          </h1>
          <p className="text-xs text-[#8E8276] mt-1">
            Управление подборками главной страницы и каталога. Состав подборок синхронизируется через реляционную таблицу CollectionProduct в PostgreSQL.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#D9A76A] hover:bg-[#E5CBA8] text-[#0E0A08] font-bold text-xs transition-all shadow-[0_0_20px_rgba(217,167,106,0.3)] cursor-pointer active:scale-95"
        >
          <Plus className="h-4 w-4" />
          <span>Создать подборку</span>
        </button>
      </div>

      {/* Search & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8E8276]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск по названию или slug..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-white placeholder:text-[#8E8276] focus:outline-none focus:border-[#D9A76A]"
          />
        </div>
        <div className="text-xs font-mono text-[#8E8276]">
          Всего подборок: <b className="text-white">{collections.length}</b>
        </div>
      </div>

      {/* Collections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredCollections.map((col) => (
          <div
            key={col.id}
            className="rounded-3xl border border-white/10 bg-[#120D0A] hover:border-white/20 transition-all overflow-hidden flex flex-col justify-between group shadow-xl"
          >
            <div>
              {/* Cover Image */}
              <div className="relative h-44 w-full overflow-hidden bg-black/40">
                <img
                  src={col.coverImage}
                  alt={col.title}
                  className="w-full h-full object-cover brightness-60 group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#120D0A] via-transparent to-black/30" />

                {col.badgeText && (
                  <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#D9A76A]/90 text-[#0E0A08] text-[10px] font-bold uppercase tracking-wider font-mono shadow-md backdrop-blur-md">
                    {col.badgeText}
                  </span>
                )}

                <div className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-black/60 border border-white/10 text-[10px] font-mono text-white/80">
                  Порядок: #{col.order}
                </div>

                <div className="absolute bottom-3 left-4 right-4">
                  <h3 className="text-lg font-bold text-white font-serif">{col.title}</h3>
                  <span className="text-[11px] font-mono text-[#D9A76A]">/catalog?collection={col.slug}</span>
                </div>
              </div>

              {/* Description */}
              <div className="p-5 space-y-4">
                <p className="text-xs text-[#C4B9AD] leading-relaxed line-clamp-2">
                  {col.description}
                </p>

                {/* Included Products Thumbnails */}
                <div className="space-y-2 pt-2 border-t border-white/5">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-[#8E8276] flex items-center justify-between">
                    <span>Товары в подборке ({col.products.length})</span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {col.products.map((p, idx) => (
                      <div
                        key={p.id}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white/[0.03] border border-white/10 text-[11px] text-[#E5DDD3]"
                        title={`${p.product.title} (${p.product.price} ₽)`}
                      >
                        <span className="text-[9px] font-mono text-[#D9A76A]">#{idx + 1}</span>
                        <span className="truncate max-w-[140px]">{p.product.title}</span>
                      </div>
                    ))}
                    {col.products.length === 0 && (
                      <span className="text-xs text-stone-500 italic">Нет привязанных товаров</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Actions Bar */}
            <div className="p-4 border-t border-white/5 bg-white/[0.01] flex items-center justify-between">
              <a
                href={`/catalog?collection=${col.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-mono text-[#D9A76A] hover:underline"
              >
                <span>Смотреть в каталоге</span>
                <ExternalLink className="h-3 w-3" />
              </a>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => openEditModal(col)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                  <span>Редактировать</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDeletingCollection(col)}
                  className="p-2 rounded-xl text-[#8E8276] hover:text-rose-400 hover:bg-rose-950/20 transition-colors cursor-pointer"
                  title="Удалить"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CREATE / EDIT MODAL */}
      {(isCreating || editingCollection) && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-hidden"
          data-lenis-prevent="true"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <div
            className="relative w-full max-w-3xl max-h-[92vh] flex flex-col rounded-3xl bg-[#140E0B] border border-white/10 shadow-2xl overflow-hidden animate-in zoom-in-95"
            data-lenis-prevent="true"
          >
            {/* Modal Fixed Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 shrink-0 bg-[#17100B]">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-[#D9A76A]/10 text-[#D9A76A]">
                  <LayoutGrid className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-sans">
                    {isCreating ? 'Новая подборка' : `Редактирование: ${editingCollection?.title}`}
                  </h3>
                  <p className="text-[11px] font-mono text-[#8E8276]">
                    Параметры и привязанные товары
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="flex-1 flex flex-col min-h-0 overflow-hidden">
              {/* Scrollable Modal Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 overscroll-contain">
              {/* Basic Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#D9A76A]">
                    Название подборки *
                  </label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="Для фильтра и воронки V60"
                    className="w-full rounded-xl bg-white/[0.03] border border-white/10 py-2.5 px-3 text-xs text-white focus:outline-none focus:border-[#D9A76A]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#D9A76A]">
                    Slug (URL адрес) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formSlug}
                    onChange={(e) => setFormSlug(e.target.value)}
                    placeholder="filter-brew"
                    className="w-full rounded-xl bg-white/[0.03] border border-white/10 py-2.5 px-3 text-xs font-mono text-[#E5CBA8] focus:outline-none focus:border-[#D9A76A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#8E8276]">
                    Бейдж / Шильдик
                  </label>
                  <input
                    type="text"
                    value={formBadgeText}
                    onChange={(e) => setFormBadgeText(e.target.value)}
                    placeholder="Светлая обжарка • Pour Over"
                    className="w-full rounded-xl bg-white/[0.03] border border-white/10 py-2.5 px-3 text-xs text-white focus:outline-none focus:border-[#D9A76A]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#8E8276]">
                    Порядок (Order)
                  </label>
                  <input
                    type="number"
                    value={formOrder}
                    onChange={(e) => setFormOrder(Number(e.target.value))}
                    className="w-full rounded-xl bg-white/[0.03] border border-white/10 py-2.5 px-3 text-xs text-white focus:outline-none focus:border-[#D9A76A]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#8E8276]">
                  Описание подборки *
                </label>
                <textarea
                  rows={2}
                  required
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Яркие моносорта мытой и натуральной обработки..."
                  className="w-full rounded-xl bg-white/[0.03] border border-white/10 p-3 text-xs text-[#C4B9AD] resize-none focus:outline-none focus:border-[#D9A76A] leading-relaxed"
                />
              </div>

              <ImageUpload
                value={formCoverImage}
                onChange={setFormCoverImage}
                label="Обложка подборки *"
                placeholder="https://images.unsplash.com/..."
                aspectRatio="wide"
              />

              {/* PRODUCTS SELECTOR & REORDERING (Relational CollectionProduct) */}
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-white/5">
                  <label className="text-xs font-mono font-bold uppercase tracking-wider text-[#D9A76A] flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    <span>Товары в подборке ({selectedProductIds.length})</span>
                  </label>
                  <span className="text-[10px] font-mono text-[#8E8276]">
                    Используйте стрелки для изменения порядка
                  </span>
                </div>

                {/* Selected Products List (Ordered) */}
                <div className="space-y-2">
                  {selectedProductIds.map((prodId, idx) => {
                    const prod = allProducts.find((p) => p.id === prodId);
                    if (!prod) return null;

                    return (
                      <div
                        key={prodId}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-[#1C1410] border border-white/10 text-xs"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="w-5 text-center font-mono font-bold text-[#D9A76A] text-[11px]">
                            #{idx + 1}
                          </span>
                          {prod.images?.[0] && (
                            <img
                              src={prod.images[0]}
                              alt=""
                              className="w-8 h-8 rounded-lg object-cover flex-shrink-0"
                            />
                          )}
                          <div className="min-w-0">
                            <span className="font-bold text-white truncate block">
                              {prod.title}
                            </span>
                            <span className="text-[10px] font-mono text-[#8E8276]">
                              {prod.price} ₽ • {prod.category}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => moveProductInSelection(idx, 'up')}
                            className="p-1 rounded hover:bg-white/10 text-[#8E8276] hover:text-white disabled:opacity-20 cursor-pointer"
                          >
                            <ChevronUp className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            disabled={idx === selectedProductIds.length - 1}
                            onClick={() => moveProductInSelection(idx, 'down')}
                            className="p-1 rounded hover:bg-white/10 text-[#8E8276] hover:text-white disabled:opacity-20 cursor-pointer"
                          >
                            <ChevronDown className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeProductFromSelection(prodId)}
                            className="p-1 rounded hover:bg-rose-950/40 text-[#8E8276] hover:text-rose-400 cursor-pointer ml-1"
                            title="Убрать из подборки"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                  {selectedProductIds.length === 0 && (
                    <p className="text-xs text-stone-500 italic py-2 text-center">
                      В подборку еще не добавлено ни одного товара. Выберите товары ниже.
                    </p>
                  )}
                </div>

                {/* Search and Add Products from Catalog */}
                <div className="pt-3 border-t border-white/5 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono text-[#C4B9AD]">
                      Добавить товары из каталога:
                    </span>
                    <input
                      type="text"
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      placeholder="Быстрый поиск товаров..."
                      className="rounded-lg bg-black/40 border border-white/10 py-1.5 px-2.5 text-xs text-white placeholder:text-[#8E8276] w-56 focus:outline-none focus:border-[#D9A76A]"
                    />
                  </div>

                  <div className="max-h-40 overflow-y-auto divide-y divide-white/5 rounded-xl border border-white/5 bg-black/20">
                    {searchedAvailableProducts.map((p) => (
                      <div
                        key={p.id}
                        className="flex items-center justify-between p-2 hover:bg-white/[0.04] transition-colors"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          {p.images?.[0] && (
                            <img
                              src={p.images[0]}
                              alt=""
                              className="w-6 h-6 rounded object-cover flex-shrink-0"
                            />
                          )}
                          <span className="text-xs text-white truncate">{p.title}</span>
                          <span className="text-[10px] font-mono text-[#D9A76A]">
                            {p.price} ₽
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => addProductToSelection(p.id)}
                          className="px-2.5 py-1 rounded-lg bg-[#D9A76A]/20 hover:bg-[#D9A76A]/30 text-[#E5CBA8] text-[10px] font-mono font-bold transition-colors cursor-pointer shrink-0"
                        >
                          + Добавить
                        </button>
                      </div>
                    ))}
                    {searchedAvailableProducts.length === 0 && (
                      <p className="text-xs text-stone-500 p-3 text-center">
                        Все доступные товары уже добавлены или не найдены по запросу
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Fixed Sticky Footer for Save / Cancel */}
              <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-white/10 shrink-0 bg-[#17100B]">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-xs text-[#C4B9AD] font-semibold cursor-pointer"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#D9A76A] hover:bg-[#E5CBA8] text-[#0E0A08] font-bold text-xs transition-all shadow-[0_0_20px_rgba(217,167,106,0.3)] disabled:opacity-50 cursor-pointer"
                >
                  <span>{saving ? 'Сохранение...' : isCreating ? 'Создать подборку' : 'Сохранить изменения'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deletingCollection && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          data-lenis-prevent="true"
        >
          <div className="w-full max-w-md rounded-3xl bg-[#140E0B] border border-rose-500/30 p-6 space-y-5 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="p-2.5 rounded-2xl bg-rose-950/50 border border-rose-500/30">
                <AlertCircle className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  Удаление подборки
                </h3>
                <p className="text-xs font-mono text-[#8E8276]">
                  "{deletingCollection.title}" ({deletingCollection.slug})
                </p>
              </div>
            </div>

            <p className="text-xs text-[#C4B9AD] leading-relaxed">
              Вы уверены, что хотите удалить подборку <b>"{deletingCollection.title}"</b>? Сами товары из каталога удалены не будут, но связь подборки и её отображение на главной странице исчезнут.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeletingCollection(null)}
                className="px-4 py-2 rounded-xl border border-white/10 hover:bg-white/5 text-xs text-[#C4B9AD] cursor-pointer"
              >
                Отмена
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={handleDelete}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs cursor-pointer shadow-lg shadow-rose-900/30"
              >
                {saving ? 'Удаление...' : 'Да, удалить'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
