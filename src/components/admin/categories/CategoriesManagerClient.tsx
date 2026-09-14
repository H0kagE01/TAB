'use client';

import React, { useState, useMemo } from 'react';
import {
  FolderTree,
  Plus,
  Search,
  Edit2,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Sparkles,
  Package,
  Layers,
  X,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';
import { AdminCategoryItem } from '@/lib/db/categories';
import { ImageUpload } from '@/components/admin/ImageUpload';

interface CategoriesManagerClientProps {
  initialCategories: AdminCategoryItem[];
}

export function CategoriesManagerClient({ initialCategories }: CategoriesManagerClientProps) {
  const [categories, setCategories] = useState<AdminCategoryItem[]>(initialCategories);
  const [search, setSearch] = useState('');
  const [editingCategory, setEditingCategory] = useState<AdminCategoryItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [deletingCategory, setDeletingCategory] = useState<AdminCategoryItem | null>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Form states
  const [formName, setFormName] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formShortDesc, setFormShortDesc] = useState('');
  const [formLongDesc, setFormLongDesc] = useState('');
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formAccentColor, setFormAccentColor] = useState('#D9A76A');
  const [formOrder, setFormOrder] = useState(0);
  const [formIsActive, setFormIsActive] = useState(true);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const openCreateModal = () => {
    setFormName('');
    setFormSlug('');
    setFormShortDesc('');
    setFormLongDesc('');
    setFormImageUrl('');
    setFormAccentColor('#D9A76A');
    setFormOrder(categories.length + 1);
    setFormIsActive(true);
    setIsCreating(true);
    setEditingCategory(null);
  };

  const openEditModal = (cat: AdminCategoryItem) => {
    setFormName(cat.name);
    setFormSlug(cat.slug);
    setFormShortDesc(cat.shortDescription || '');
    setFormLongDesc(cat.longDescription || '');
    setFormImageUrl(cat.imageUrl || '');
    setFormAccentColor(cat.accentColor || '#D9A76A');
    setFormOrder(cat.order);
    setFormIsActive(cat.isActive);
    setEditingCategory(cat);
    setIsCreating(false);
  };

  const closeModal = () => {
    setIsCreating(false);
    setEditingCategory(null);
  };

  // Lock body & html scroll when any modal is open
  React.useEffect(() => {
    const isAnyModalOpen = isCreating || !!editingCategory || !!deletingCategory;
    if (!isAnyModalOpen) return;

    const prevBodyOverflow = document.body.style.overflow;
    const prevHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = prevBodyOverflow;
      document.documentElement.style.overflow = prevHtmlOverflow;
    };
  }, [isCreating, editingCategory, deletingCategory]);

  // Auto-slug generation from name
  const handleNameChange = (val: string) => {
    setFormName(val);
    if (isCreating && !formSlug) {
      const translit = val
        .toLowerCase()
        .replace(/а/g, 'a').replace(/б/g, 'b').replace(/в/g, 'v').replace(/г/g, 'g')
        .replace(/д/g, 'd').replace(/е/g, 'e').replace(/ё/g, 'e').replace(/ж/g, 'zh')
        .replace(/з/g, 'z').replace(/и/g, 'i').replace(/й/g, 'y').replace(/к/g, 'k')
        .replace(/л/g, 'l').replace(/м/g, 'm').replace(/н/g, 'n').replace(/о/g, 'o')
        .replace(/п/g, 'p').replace(/р/g, 'r').replace(/с/g, 's').replace(/т/g, 't')
        .replace(/у/g, 'u').replace(/ф/g, 'f').replace(/х/g, 'h').replace(/ц/g, 'ts')
        .replace(/ч/g, 'ch').replace(/ш/g, 'sh').replace(/щ/g, 'sch').replace(/ъ/g, '')
        .replace(/ы/g, 'y').replace(/ь/g, '').replace(/э/g, 'e').replace(/ю/g, 'yu')
        .replace(/я/g, 'ya').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
      setFormSlug(translit);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formSlug.trim()) {
      showToast('error', 'Название и slug обязательны');
      return;
    }

    setSaving(true);
    try {
      if (isCreating) {
        const res = await fetch('/api/admin/categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formName,
            slug: formSlug,
            shortDescription: formShortDesc || null,
            longDescription: formLongDesc || null,
            imageUrl: formImageUrl || null,
            accentColor: formAccentColor || null,
            order: Number(formOrder) || 0,
            isActive: formIsActive,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Ошибка создания');
        
        setCategories((prev) => [...prev, { ...data.category, _count: { products: 0 } }].sort((a, b) => a.order - b.order));
        showToast('success', `Категория "${formName}" успешно создана`);
      } else if (editingCategory) {
        const res = await fetch(`/api/admin/categories/${editingCategory.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formName,
            slug: formSlug,
            shortDescription: formShortDesc || null,
            longDescription: formLongDesc || null,
            imageUrl: formImageUrl || null,
            accentColor: formAccentColor || null,
            order: Number(formOrder) || 0,
            isActive: formIsActive,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Ошибка обновления');

        setCategories((prev) =>
          prev
            .map((c) => (c.id === editingCategory.id ? { ...c, ...data.category } : c))
            .sort((a, b) => a.order - b.order)
        );
        showToast('success', `Категория "${formName}" обновлена`);
      }
      closeModal();
    } catch (err: any) {
      showToast('error', err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (cat: AdminCategoryItem) => {
    try {
      const res = await fetch(`/api/admin/categories/${cat.id}`, { method: 'PATCH' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Ошибка изменения статуса');

      setCategories((prev) =>
        prev.map((c) => (c.id === cat.id ? { ...c, isActive: data.category.isActive } : c))
      );
      showToast('success', `Статус "${cat.name}" изменен на ${data.category.isActive ? 'Активен' : 'Скрыт'}`);
    } catch (err: any) {
      showToast('error', err.message);
    }
  };

  const handleDelete = async () => {
    if (!deletingCategory) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/categories/${deletingCategory.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Ошибка удаления');

      setCategories((prev) => prev.filter((c) => c.id !== deletingCategory.id));
      showToast('success', `Категория "${deletingCategory.name}" удалена`);
      setDeletingCategory(null);
    } catch (err: any) {
      showToast('error', err.message);
    } finally {
      setSaving(false);
    }
  };

  const filteredCategories = useMemo(() => {
    if (!search.trim()) return categories;
    const q = search.toLowerCase().trim();
    return categories.filter(
      (c) => c.name.toLowerCase().includes(q) || c.slug.toLowerCase().includes(q)
    );
  }, [categories, search]);

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
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
            <FolderTree className="h-4 w-4" />
            <span>Справочник каталога</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white font-sans">
            Категории товаров
          </h1>
          <p className="text-xs text-[#8E8276] mt-1">
            Управление иерархией каталога, навигационными фильтрами и порядком отображения.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#D9A76A] hover:bg-[#E5CBA8] text-[#0E0A08] font-bold text-xs transition-all shadow-[0_0_20px_rgba(217,167,106,0.3)] cursor-pointer active:scale-95"
        >
          <Plus className="h-4 w-4" />
          <span>Создать категорию</span>
        </button>
      </div>

      {/* Search Bar & Stats */}
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
        <div className="text-xs font-mono text-[#8E8276] flex items-center gap-2">
          <span>Всего категорий: <b className="text-white">{categories.length}</b></span>
          <span>•</span>
          <span>Активных: <b className="text-emerald-400">{categories.filter((c) => c.isActive).length}</b></span>
        </div>
      </div>

      {/* Categories Table / Cards */}
      <div className="rounded-2xl border border-white/10 bg-[#120D0A] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.02] text-[#8E8276] font-mono uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4 w-12 text-center">Порядок</th>
                <th className="py-3 px-4">Категория</th>
                <th className="py-3 px-4">Slug (URL)</th>
                <th className="py-3 px-4">Товары</th>
                <th className="py-3 px-4">Цвет</th>
                <th className="py-3 px-4 text-center">Статус</th>
                <th className="py-3 px-4 text-right">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredCategories.map((cat) => (
                <tr
                  key={cat.id}
                  className={`hover:bg-white/[0.02] transition-colors ${
                    !cat.isActive ? 'opacity-50' : ''
                  }`}
                >
                  <td className="py-3.5 px-4 text-center font-mono font-bold text-[#D9A76A]">
                    {cat.order}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      {cat.imageUrl ? (
                        <img
                          src={cat.imageUrl}
                          alt=""
                          className="w-9 h-9 rounded-lg object-cover border border-white/10 flex-shrink-0"
                        />
                      ) : (
                        <div
                          className="w-9 h-9 rounded-lg flex items-center justify-center border border-white/10 text-white flex-shrink-0"
                          style={{ backgroundColor: `${cat.accentColor || '#D9A76A'}20` }}
                        >
                          <FolderTree className="h-4 w-4" style={{ color: cat.accentColor || '#D9A76A' }} />
                        </div>
                      )}
                      <div>
                        <div className="font-bold text-white text-sm">{cat.name}</div>
                        {cat.shortDescription && (
                          <div className="text-[11px] text-[#8E8276] line-clamp-1 max-w-xs">
                            {cat.shortDescription}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[11px] text-[#A89D91]">
                    <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10">
                      /catalog/{cat.slug}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 text-[#E5CBA8] font-mono text-[11px]">
                      <Package className="h-3 w-3 text-[#D9A76A]" />
                      <span>{cat._count.products} товаров</span>
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3.5 h-3.5 rounded-full border border-white/20"
                        style={{ backgroundColor: cat.accentColor || '#D9A76A' }}
                      />
                      <span className="font-mono text-[10px] text-[#8E8276]">
                        {cat.accentColor || '#D9A76A'}
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <button
                      type="button"
                      onClick={() => handleToggleActive(cat)}
                      className="cursor-pointer transition-transform active:scale-95"
                      title={cat.isActive ? 'Деактивировать' : 'Активировать'}
                    >
                      {cat.isActive ? (
                        <span className="inline-flex items-center gap-1 text-emerald-400 font-mono text-[10px]">
                          <ToggleRight className="h-5 w-5" />
                          <span className="hidden sm:inline">Активна</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-stone-500 font-mono text-[10px]">
                          <ToggleLeft className="h-5 w-5" />
                          <span className="hidden sm:inline">Скрыта</span>
                        </span>
                      )}
                    </button>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <a
                        href={`/catalog/${cat.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg text-[#8E8276] hover:text-[#D9A76A] hover:bg-white/5 transition-colors"
                        title="Открыть на сайте"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                      <button
                        type="button"
                        onClick={() => openEditModal(cat)}
                        className="p-1.5 rounded-lg text-[#8E8276] hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                        title="Редактировать"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeletingCategory(cat)}
                        className="p-1.5 rounded-lg text-[#8E8276] hover:text-rose-400 hover:bg-rose-950/20 transition-colors cursor-pointer"
                        title="Удалить"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredCategories.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#8E8276]">
                    <FolderTree className="h-8 w-8 mx-auto mb-2 opacity-30" />
                    <p>Категории не найдены</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE / EDIT MODAL */}
      {(isCreating || editingCategory) && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-hidden"
          data-lenis-prevent="true"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <div
            className="relative w-full max-w-xl max-h-[92vh] flex flex-col rounded-3xl bg-[#140E0B] border border-white/10 shadow-2xl overflow-hidden animate-in zoom-in-95"
            data-lenis-prevent="true"
          >
            {/* Modal Fixed Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 shrink-0 bg-[#17100B]">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-[#D9A76A]/10 text-[#D9A76A]">
                  <FolderTree className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-sans">
                    {isCreating ? 'Новая категория' : `Редактирование: ${editingCategory?.name}`}
                  </h3>
                  <p className="text-[11px] font-mono text-[#8E8276]">
                    {isCreating ? 'Заполните параметры категории' : `ID: ${editingCategory?.id}`}
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
              <div className="flex-1 overflow-y-auto p-6 space-y-4 overscroll-contain">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#D9A76A]">
                    Название категории *
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="Например: Дрип-пакеты"
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
                    placeholder="drip-coffee"
                    className="w-full rounded-xl bg-white/[0.03] border border-white/10 py-2.5 px-3 text-xs font-mono text-[#E5CBA8] focus:outline-none focus:border-[#D9A76A]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#8E8276]">
                  Краткое описание (для каталога и карточек)
                </label>
                <input
                  type="text"
                  value={formShortDesc}
                  onChange={(e) => setFormShortDesc(e.target.value)}
                  placeholder="Порционный спешелти кофе в фильтр-пакетах для путешествий и дома."
                  className="w-full rounded-xl bg-white/[0.03] border border-white/10 py-2.5 px-3 text-xs text-white focus:outline-none focus:border-[#D9A76A]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#8E8276]">
                  Полное описание (для страницы категории)
                </label>
                <textarea
                  rows={3}
                  value={formLongDesc}
                  onChange={(e) => setFormLongDesc(e.target.value)}
                  placeholder="Подробный текст о данной категории кофе или аксессуаров..."
                  className="w-full rounded-xl bg-white/[0.03] border border-white/10 p-3 text-xs text-[#C4B9AD] resize-none focus:outline-none focus:border-[#D9A76A] leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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

                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#8E8276]">
                    Цвет акцента
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={formAccentColor}
                      onChange={(e) => setFormAccentColor(e.target.value)}
                      className="w-9 h-9 rounded-xl bg-transparent border-0 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={formAccentColor}
                      onChange={(e) => setFormAccentColor(e.target.value)}
                      className="w-full rounded-xl bg-white/[0.03] border border-white/10 py-2 px-2.5 text-xs font-mono text-white"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#8E8276]">
                    Видимость
                  </label>
                  <div className="pt-2">
                    <label className="flex items-center gap-2 cursor-pointer text-xs text-white">
                      <input
                        type="checkbox"
                        checked={formIsActive}
                        onChange={(e) => setFormIsActive(e.target.checked)}
                        className="rounded bg-white/10 border-white/20 text-[#D9A76A] focus:ring-0"
                      />
                      <span>Активна на сайте</span>
                    </label>
                  </div>
                </div>
              </div>

              <ImageUpload
                value={formImageUrl}
                onChange={setFormImageUrl}
                label="Изображение категории"
                placeholder="https://images.unsplash.com/... или /images/category.jpg"
              />

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
                  <span>{saving ? 'Сохранение...' : isCreating ? 'Создать категорию' : 'Сохранить изменения'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deletingCategory && (
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
                  Удаление категории
                </h3>
                <p className="text-xs font-mono text-[#8E8276]">
                  "{deletingCategory.name}" ({deletingCategory.slug})
                </p>
              </div>
            </div>

            {deletingCategory._count.products > 0 ? (
              <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-500/30 space-y-2 text-xs text-rose-200 leading-relaxed">
                <p className="font-bold">
                  ⚠️ Удаление заблокировано: к категории привязано {deletingCategory._count.products} товаров.
                </p>
                <p className="text-rose-300/80">
                  Чтобы не потерять привязку товаров в каталоге, удаление невозможно. Вы можете скрыть категорию из публичного доступа:
                </p>
                <button
                  type="button"
                  onClick={async () => {
                    await handleToggleActive(deletingCategory);
                    setDeletingCategory(null);
                  }}
                  className="w-full mt-2 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-[#E5CBA8] font-bold text-xs transition-colors cursor-pointer"
                >
                  Скрыть категорию (Деактивировать)
                </button>
              </div>
            ) : (
              <p className="text-xs text-[#C4B9AD] leading-relaxed">
                Вы уверены, что хотите удалить категорию <b>"{deletingCategory.name}"</b>? В ней нет привязанных товаров, действие необратимо.
              </p>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeletingCategory(null)}
                className="px-4 py-2 rounded-xl border border-white/10 hover:bg-white/5 text-xs text-[#C4B9AD] cursor-pointer"
              >
                Отмена
              </button>
              {deletingCategory._count.products === 0 && (
                <button
                  type="button"
                  disabled={saving}
                  onClick={handleDelete}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs cursor-pointer shadow-lg shadow-rose-900/30"
                >
                  {saving ? 'Удаление...' : 'Да, удалить'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
