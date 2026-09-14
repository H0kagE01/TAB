'use client';

import React, { useState, useMemo } from 'react';
import {
  Tag,
  Plus,
  Search,
  Edit2,
  Trash2,
  Globe,
  Package,
  X,
  CheckCircle2,
  AlertCircle,
  Image as ImageIcon,
} from 'lucide-react';
import { AdminBrandItem } from '@/lib/db/brands';
import { ImageUpload } from '@/components/admin/ImageUpload';

export interface AdminCountryOption {
  id: string;
  name: string;
  code: string;
  flagEmoji: string | null;
}

interface BrandsManagerClientProps {
  initialBrands: AdminBrandItem[];
  allCountries: AdminCountryOption[];
}

export function BrandsManagerClient({
  initialBrands,
  allCountries,
}: BrandsManagerClientProps) {
  const [brands, setBrands] = useState<AdminBrandItem[]>(initialBrands);
  const [search, setSearch] = useState('');
  const [editingBrand, setEditingBrand] = useState<AdminBrandItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [deletingBrand, setDeletingBrand] = useState<AdminBrandItem | null>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Form states
  const [formName, setFormName] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formLogoUrl, setFormLogoUrl] = useState('');
  const [formCountryId, setFormCountryId] = useState('');

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const openCreateModal = () => {
    setFormName('');
    setFormSlug('');
    setFormDesc('');
    setFormLogoUrl('');
    setFormCountryId('');
    setIsCreating(true);
    setEditingBrand(null);
  };

  const openEditModal = (brand: AdminBrandItem) => {
    setFormName(brand.name);
    setFormSlug(brand.slug);
    setFormDesc(brand.description || '');
    setFormLogoUrl(brand.logoUrl || '');
    setFormCountryId(brand.countryId || '');
    setEditingBrand(brand);
    setIsCreating(false);
  };

  const closeModal = () => {
    setIsCreating(false);
    setEditingBrand(null);
  };

  // Lock body & html scroll when any modal is open
  React.useEffect(() => {
    const isAnyModalOpen = isCreating || !!editingBrand || !!deletingBrand;
    if (!isAnyModalOpen) return;

    const prevBodyOverflow = document.body.style.overflow;
    const prevHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = prevBodyOverflow;
      document.documentElement.style.overflow = prevHtmlOverflow;
    };
  }, [isCreating, editingBrand, deletingBrand]);

  const handleNameChange = (val: string) => {
    setFormName(val);
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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formSlug.trim()) {
      showToast('error', 'Название и slug обязательны');
      return;
    }

    setSaving(true);
    try {
      if (isCreating) {
        const res = await fetch('/api/admin/brands', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formName,
            slug: formSlug,
            description: formDesc || null,
            logoUrl: formLogoUrl || null,
            countryId: formCountryId || null,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Ошибка создания бренда');

        setBrands((prev) => [...prev, data.brand].sort((a, b) => a.name.localeCompare(b.name)));
        showToast('success', `Бренд "${formName}" успешно создан`);
      } else if (editingBrand) {
        const res = await fetch(`/api/admin/brands/${editingBrand.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formName,
            slug: formSlug,
            description: formDesc || null,
            logoUrl: formLogoUrl || null,
            countryId: formCountryId || null,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Ошибка обновления бренда');

        setBrands((prev) =>
          prev
            .map((b) => (b.id === editingBrand.id ? { ...b, ...data.brand } : b))
            .sort((a, b) => a.name.localeCompare(b.name))
        );
        showToast('success', `Бренд "${formName}" обновлен`);
      }
      closeModal();
    } catch (err: any) {
      showToast('error', err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingBrand) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/brands/${deletingBrand.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Ошибка удаления');

      setBrands((prev) => prev.filter((b) => b.id !== deletingBrand.id));
      showToast('success', `Бренд "${deletingBrand.name}" удален`);
      setDeletingBrand(null);
    } catch (err: any) {
      showToast('error', err.message);
    } finally {
      setSaving(false);
    }
  };

  const filteredBrands = useMemo(() => {
    if (!search.trim()) return brands;
    const q = search.toLowerCase().trim();
    return brands.filter(
      (b) =>
        b.name.toLowerCase().includes(q) ||
        b.slug.toLowerCase().includes(q) ||
        b.country?.name.toLowerCase().includes(q)
    );
  }, [brands, search]);

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
            <Tag className="h-4 w-4" />
            <span>Справочник производителей</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white font-sans">
            Бренды и ростеры
          </h1>
          <p className="text-xs text-[#8E8276] mt-1">
            Управление брендами спешелти кофе, ростериями и производителями аксессуаров (Hario, Timemore, Acaia).
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#D9A76A] hover:bg-[#E5CBA8] text-[#0E0A08] font-bold text-xs transition-all shadow-[0_0_20px_rgba(217,167,106,0.3)] cursor-pointer active:scale-95"
        >
          <Plus className="h-4 w-4" />
          <span>Добавить бренд</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8E8276]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск по бренду, стране или slug..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-white placeholder:text-[#8E8276] focus:outline-none focus:border-[#D9A76A]"
          />
        </div>
        <div className="text-xs font-mono text-[#8E8276]">
          Всего брендов: <b className="text-white">{brands.length}</b>
        </div>
      </div>

      {/* Grid of Brands */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBrands.map((brand) => (
          <div
            key={brand.id}
            className="p-5 rounded-2xl border border-white/10 bg-[#120D0A] hover:border-white/20 transition-all flex flex-col justify-between space-y-4 group"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  {brand.logoUrl ? (
                    <img
                      src={brand.logoUrl}
                      alt=""
                      className="w-10 h-10 rounded-xl object-contain bg-white/5 p-1 border border-white/10"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#D9A76A]">
                      <Tag className="h-5 w-5" />
                    </div>
                  )}
                  <div>
                    <h3 className="font-bold text-white text-base group-hover:text-[#E5CBA8] transition-colors">
                      {brand.name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-[#8E8276]">
                      {brand.country?.flagEmoji && <span>{brand.country.flagEmoji}</span>}
                      <span>{brand.country?.name || 'Страна не указана'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => openEditModal(brand)}
                    className="p-1.5 rounded-lg text-[#8E8276] hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                    title="Редактировать"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeletingBrand(brand)}
                    className="p-1.5 rounded-lg text-[#8E8276] hover:text-rose-400 hover:bg-rose-950/20 transition-colors cursor-pointer"
                    title="Удалить"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {brand.description && (
                <p className="text-xs text-[#A89D91] line-clamp-2 leading-relaxed">
                  {brand.description}
                </p>
              )}
            </div>

            <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[11px] font-mono">
              <span className="text-[#8E8276]">slug: {brand.slug}</span>
              <span className="inline-flex items-center gap-1 text-[#D9A76A]">
                <Package className="h-3 w-3" />
                <span>{brand._count.products} товаров</span>
              </span>
            </div>
          </div>
        ))}
      </div>

      {filteredBrands.length === 0 && (
        <div className="py-16 text-center text-[#8E8276] rounded-2xl border border-white/5 bg-[#120D0A]">
          <Tag className="h-10 w-10 mx-auto mb-3 opacity-25" />
          <p>Бренды не найдены</p>
        </div>
      )}

      {/* CREATE / EDIT MODAL */}
      {(isCreating || editingBrand) && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-hidden"
          data-lenis-prevent="true"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <div
            className="relative w-full max-w-lg max-h-[92vh] flex flex-col rounded-3xl bg-[#140E0B] border border-white/10 shadow-2xl overflow-hidden animate-in zoom-in-95"
            data-lenis-prevent="true"
          >
            {/* Modal Fixed Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 shrink-0 bg-[#17100B]">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-[#D9A76A]/10 text-[#D9A76A]">
                  <Tag className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-sans">
                    {isCreating ? 'Новый бренд' : `Редактирование: ${editingBrand?.name}`}
                  </h3>
                  <p className="text-[11px] font-mono text-[#8E8276]">
                    Параметры производителя
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
                    Название бренда *
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="Например: Hario"
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
                    placeholder="hario"
                    className="w-full rounded-xl bg-white/[0.03] border border-white/10 py-2.5 px-3 text-xs font-mono text-[#E5CBA8] focus:outline-none focus:border-[#D9A76A]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#8E8276]">
                  Страна происхождения бренда
                </label>
                <select
                  value={formCountryId}
                  onChange={(e) => setFormCountryId(e.target.value)}
                  className="w-full rounded-xl bg-[#1C1410] border border-white/10 py-2.5 px-3 text-xs text-white focus:outline-none focus:border-[#D9A76A]"
                >
                  <option value="">-- Не указана --</option>
                  {allCountries.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.flagEmoji ? `${c.flagEmoji} ` : ''}
                      {c.name} ({c.code})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#8E8276]">
                  Описание производителя
                </label>
                <textarea
                  rows={3}
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  placeholder="Японский бренд термостойкого стекла и воронок V60..."
                  className="w-full rounded-xl bg-white/[0.03] border border-white/10 p-3 text-xs text-[#C4B9AD] resize-none focus:outline-none focus:border-[#D9A76A] leading-relaxed"
                />
              </div>

              <ImageUpload
                value={formLogoUrl}
                onChange={setFormLogoUrl}
                label="Логотип бренда"
                placeholder="https://... или /images/brands/hario.svg"
                compact
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
                  <span>{saving ? 'Сохранение...' : isCreating ? 'Создать бренд' : 'Сохранить изменения'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deletingBrand && (
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
                  Удаление бренда
                </h3>
                <p className="text-xs font-mono text-[#8E8276]">
                  "{deletingBrand.name}" ({deletingBrand.slug})
                </p>
              </div>
            </div>

            <div className="text-xs text-[#C4B9AD] space-y-2 leading-relaxed">
              <p>
                Вы действительно хотите удалить бренд <b>"{deletingBrand.name}"</b>?
              </p>
              {deletingBrand._count.products > 0 && (
                <p className="text-[#D9A76A]">
                  ℹ️ К бренду привязано {deletingBrand._count.products} товаров. При удалении бренда товары останутся в каталоге, но поле бренда у них станет пустым (SetNull).
                </p>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeletingBrand(null)}
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
