'use client';

import React, { useState } from 'react';
import {
  Store,
  Plus,
  Edit2,
  Trash2,
  MapPin,
  Phone,
  Clock,
  Star,
  StarOff,
  X,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Navigation,
} from 'lucide-react';
import { AdminStoreItem } from '@/lib/db/stores';
import { ImageUpload } from '@/components/admin/ImageUpload';

interface StoresManagerClientProps {
  initialStores: AdminStoreItem[];
}

export function StoresManagerClient({ initialStores }: StoresManagerClientProps) {
  const [stores, setStores] = useState<AdminStoreItem[]>(initialStores);
  const [editingStore, setEditingStore] = useState<AdminStoreItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [deletingStore, setDeletingStore] = useState<AdminStoreItem | null>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Form states
  const [formName, setFormName] = useState('');
  const [formCity, setFormCity] = useState('Майкоп');
  const [formAddress, setFormAddress] = useState('');
  const [formPhone, setFormPhone] = useState('+7 (900) 000-00-00');
  const [formFormattedPhone, setFormFormattedPhone] = useState('+79000000000');
  const [formWorkingHours, setFormWorkingHours] = useState('Ежедневно: 08:00 – 21:00');
  const [formLatitude, setFormLatitude] = useState(44.6087);
  const [formLongitude, setFormLongitude] = useState(40.1006);
  const [formPhotoUrl, setFormPhotoUrl] = useState('/images/store-maykop.jpg');
  const [formIsMain, setFormIsMain] = useState(false);
  const [formDescription, setFormDescription] = useState('');

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const openCreateModal = () => {
    setFormName('');
    setFormCity('Майкоп');
    setFormAddress('');
    setFormPhone('+7 (900) 000-00-00');
    setFormFormattedPhone('+79000000000');
    setFormWorkingHours('Ежедневно: 08:00 – 21:00');
    setFormLatitude(44.6087);
    setFormLongitude(40.1006);
    setFormPhotoUrl('/images/store-maykop.jpg');
    setFormIsMain(false);
    setFormDescription('');
    setIsCreating(true);
    setEditingStore(null);
  };

  const openEditModal = (s: AdminStoreItem) => {
    setFormName(s.name);
    setFormCity(s.city);
    setFormAddress(s.address);
    setFormPhone(s.phone);
    setFormFormattedPhone(s.formattedPhone);
    setFormWorkingHours(s.workingHours);
    setFormLatitude(s.latitude);
    setFormLongitude(s.longitude);
    setFormPhotoUrl(s.photoUrl);
    setFormIsMain(s.isMain);
    setFormDescription(s.description || '');
    setEditingStore(s);
    setIsCreating(false);
  };

  const closeModal = () => {
    setIsCreating(false);
    setEditingStore(null);
  };

  // Lock body & html scroll when any modal is open
  React.useEffect(() => {
    const isAnyModalOpen = isCreating || !!editingStore || !!deletingStore;
    if (!isAnyModalOpen) return;

    const prevBodyOverflow = document.body.style.overflow;
    const prevHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = prevBodyOverflow;
      document.documentElement.style.overflow = prevHtmlOverflow;
    };
  }, [isCreating, editingStore, deletingStore]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formAddress.trim() || !formPhone.trim() || !formWorkingHours.trim()) {
      showToast('error', 'Заполните обязательные поля');
      return;
    }

    setSaving(true);
    try {
      if (isCreating) {
        const res = await fetch('/api/admin/stores', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formName,
            city: formCity,
            address: formAddress,
            phone: formPhone,
            formattedPhone: formFormattedPhone,
            workingHours: formWorkingHours,
            latitude: Number(formLatitude),
            longitude: Number(formLongitude),
            photoUrl: formPhotoUrl,
            isMain: formIsMain,
            description: formDescription || null,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Ошибка создания магазина');

        setStores((prev) => {
          const updatedList = formIsMain ? prev.map((s) => ({ ...s, isMain: false })) : [...prev];
          return [{ ...data.store, _count: { inquiries: 0 } }, ...updatedList];
        });
        showToast('success', `Магазин "${formName}" успешно добавлен`);
      } else if (editingStore) {
        const res = await fetch(`/api/admin/stores/${editingStore.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formName,
            city: formCity,
            address: formAddress,
            phone: formPhone,
            formattedPhone: formFormattedPhone,
            workingHours: formWorkingHours,
            latitude: Number(formLatitude),
            longitude: Number(formLongitude),
            photoUrl: formPhotoUrl,
            isMain: formIsMain,
            description: formDescription || null,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Ошибка обновления магазина');

        setStores((prev) =>
          prev.map((s) => {
            if (s.id === editingStore.id) return { ...s, ...data.store };
            if (formIsMain) return { ...s, isMain: false };
            return s;
          })
        );
        showToast('success', `Данные магазина "${formName}" обновлены`);
      }
      closeModal();
    } catch (err: any) {
      showToast('error', err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSetMain = async (store: AdminStoreItem) => {
    try {
      const res = await fetch(`/api/admin/stores/${store.id}`, { method: 'PATCH' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Ошибка смены главного магазина');

      setStores((prev) =>
        prev.map((s) => ({
          ...s,
          isMain: s.id === store.id,
        }))
      );
      showToast('success', `Магазин "${store.name}" назначен главным (флагманом)`);
    } catch (err: any) {
      showToast('error', err.message);
    }
  };

  const handleDelete = async () => {
    if (!deletingStore) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/stores/${deletingStore.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Ошибка удаления');

      setStores((prev) => prev.filter((s) => s.id !== deletingStore.id));
      showToast('success', `Магазин "${deletingStore.name}" удален`);
      setDeletingStore(null);
    } catch (err: any) {
      showToast('error', err.message);
    } finally {
      setSaving(false);
    }
  };

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
            <Store className="h-4 w-4" />
            <span>Локации и кофейни</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white font-sans">
            Магазины и Пространства
          </h1>
          <p className="text-xs text-[#8E8276] mt-1">
            Управление контактными данными, адресами, координатами для карт и часами работы (источник истины для сайта).
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#D9A76A] hover:bg-[#E5CBA8] text-[#0E0A08] font-bold text-xs transition-all shadow-[0_0_20px_rgba(217,167,106,0.3)] cursor-pointer active:scale-95"
        >
          <Plus className="h-4 w-4" />
          <span>Добавить локацию</span>
        </button>
      </div>

      {/* Stores List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {stores.map((store) => (
          <div
            key={store.id}
            className={`rounded-3xl border transition-all overflow-hidden flex flex-col justify-between ${
              store.isMain
                ? 'border-[#D9A76A]/40 bg-gradient-to-b from-[#1C140F] to-[#120D0A] shadow-[0_0_30px_rgba(217,167,106,0.15)]'
                : 'border-white/10 bg-[#120D0A]'
            }`}
          >
            <div>
              {/* Photo Banner */}
              <div className="relative h-44 w-full overflow-hidden bg-black/40">
                <img
                  src={store.photoUrl || '/images/store-maykop.jpg'}
                  alt={store.name}
                  className="w-full h-full object-cover brightness-75 group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#120D0A] via-transparent to-black/30" />

                {/* Badges */}
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  {store.isMain ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D9A76A] text-[#0E0A08] text-[10px] font-bold uppercase tracking-wider font-mono shadow-lg">
                      <Star className="h-3 w-3 fill-current" />
                      <span>Главный магазин (Флагман)</span>
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleSetMain(store)}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 hover:bg-[#D9A76A] text-white hover:text-[#0E0A08] text-[10px] font-bold uppercase tracking-wider font-mono border border-white/20 transition-colors cursor-pointer"
                      title="Сделать главным магазином"
                    >
                      <StarOff className="h-3 w-3" />
                      <span>Сделать главным</span>
                    </button>
                  )}
                </div>

                <div className="absolute bottom-3 left-4 right-4">
                  <h3 className="text-lg font-bold text-white font-sans">{store.name}</h3>
                  <p className="text-xs text-[#E5CBA8] font-mono">{store.city}</p>
                </div>
              </div>

              {/* Store Details */}
              <div className="p-5 space-y-3.5 text-xs text-[#C4B9AD]">
                <div className="flex items-start gap-2.5">
                  <MapPin className="h-4 w-4 text-[#D9A76A] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-medium text-white">{store.address}</span>
                    <div className="text-[10px] font-mono text-[#8E8276]">
                      Координаты: {store.latitude.toFixed(4)}, {store.longitude.toFixed(4)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <Clock className="h-4 w-4 text-[#D9A76A] shrink-0" />
                  <div>
                    <span className="text-white font-semibold">{store.workingHours}</span>
                    <span className="text-[10px] font-mono text-emerald-400 block">
                      ✓ Синхронизировано с Live-статусом
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <Phone className="h-4 w-4 text-[#D9A76A] shrink-0" />
                  <div>
                    <span className="text-white">{store.phone}</span>
                    <span className="text-[10px] font-mono text-[#8E8276] block">
                      tel: {store.formattedPhone}
                    </span>
                  </div>
                </div>

                {store.description && (
                  <p className="text-xs text-[#8E8276] line-clamp-2 pt-1 border-t border-white/5 leading-relaxed">
                    {store.description}
                  </p>
                )}
              </div>
            </div>

            {/* Actions Bar */}
            <div className="p-4 border-t border-white/5 bg-white/[0.01] flex items-center justify-between">
              <a
                href={`https://yandex.ru/maps/?pt=${store.longitude},${store.latitude}&z=17&l=map`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-mono text-[#D9A76A] hover:underline"
              >
                <Navigation className="h-3.5 w-3.5" />
                <span>Открыть на Яндекс Картах</span>
              </a>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => openEditModal(store)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                  <span>Изменить</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDeletingStore(store)}
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
      {(isCreating || editingStore) && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-hidden"
          data-lenis-prevent="true"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <div
            className="relative w-full max-w-2xl max-h-[92vh] flex flex-col rounded-3xl bg-[#140E0B] border border-white/10 shadow-2xl overflow-hidden animate-in zoom-in-95"
            data-lenis-prevent="true"
          >
            {/* Modal Fixed Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 shrink-0 bg-[#17100B]">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-[#D9A76A]/10 text-[#D9A76A]">
                  <Store className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-sans">
                    {isCreating ? 'Новая локация / магазин' : `Редактирование: ${editingStore?.name}`}
                  </h3>
                  <p className="text-[11px] font-mono text-[#8E8276]">
                    Параметры и расписание
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
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#D9A76A]">
                    Название магазина *
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Пространство ТАВ в Майкопе"
                    className="w-full rounded-xl bg-white/[0.03] border border-white/10 py-2.5 px-3 text-xs text-white focus:outline-none focus:border-[#D9A76A]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#8E8276]">
                    Город *
                  </label>
                  <input
                    type="text"
                    required
                    value={formCity}
                    onChange={(e) => setFormCity(e.target.value)}
                    placeholder="Майкоп"
                    className="w-full rounded-xl bg-white/[0.03] border border-white/10 py-2.5 px-3 text-xs text-white focus:outline-none focus:border-[#D9A76A]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#D9A76A]">
                  Адрес магазина *
                </label>
                <input
                  type="text"
                  required
                  value={formAddress}
                  onChange={(e) => setFormAddress(e.target.value)}
                  placeholder="ул. К.А. Васильева, 2/1"
                  className="w-full rounded-xl bg-white/[0.03] border border-white/10 py-2.5 px-3 text-xs text-white focus:outline-none focus:border-[#D9A76A]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#D9A76A]">
                    Телефон для гостей *
                  </label>
                  <input
                    type="text"
                    required
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    placeholder="+7 (900) 000-00-00"
                    className="w-full rounded-xl bg-white/[0.03] border border-white/10 py-2.5 px-3 text-xs text-white focus:outline-none focus:border-[#D9A76A]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#8E8276]">
                    Форматированный телефон (для ссылок tel:)
                  </label>
                  <input
                    type="text"
                    value={formFormattedPhone}
                    onChange={(e) => setFormFormattedPhone(e.target.value)}
                    placeholder="+79000000000"
                    className="w-full rounded-xl bg-white/[0.03] border border-white/10 py-2.5 px-3 text-xs font-mono text-[#8E8276] focus:outline-none focus:border-[#D9A76A]"
                  />
                </div>
              </div>

              {/* Working Hours — Source of truth */}
              <div className="space-y-1.5 p-3.5 rounded-2xl bg-amber-950/20 border border-amber-500/20">
                <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#D9A76A] flex items-center justify-between">
                  <span>Режим и часы работы *</span>
                  <span className="text-[10px] text-amber-300 font-normal">Единый источник истины</span>
                </label>
                <input
                  type="text"
                  required
                  value={formWorkingHours}
                  onChange={(e) => setFormWorkingHours(e.target.value)}
                  placeholder="Ежедневно: 08:00 – 21:00"
                  className="w-full rounded-xl bg-black/40 border border-amber-500/40 py-2.5 px-3 text-xs font-bold text-[#E5CBA8] focus:outline-none focus:border-[#D9A76A]"
                />
                <p className="text-[10px] text-[#8E8276] leading-relaxed">
                  💡 Указывайте диапазон времени (например: <code>08:00 – 21:00</code> или <code>Пн-Вс: 09:00 - 22:00</code>). Парсер автоматически определяет статус <b>«Сейчас открыто / Закроется в 21:00»</b> на странице /contacts.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#8E8276]">
                    Широта (Latitude)
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    value={formLatitude}
                    onChange={(e) => setFormLatitude(Number(e.target.value))}
                    className="w-full rounded-xl bg-white/[0.03] border border-white/10 py-2.5 px-3 text-xs font-mono text-white focus:outline-none focus:border-[#D9A76A]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#8E8276]">
                    Долгота (Longitude)
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    value={formLongitude}
                    onChange={(e) => setFormLongitude(Number(e.target.value))}
                    className="w-full rounded-xl bg-white/[0.03] border border-white/10 py-2.5 px-3 text-xs font-mono text-white focus:outline-none focus:border-[#D9A76A]"
                  />
                </div>
              </div>

              <ImageUpload
                value={formPhotoUrl}
                onChange={setFormPhotoUrl}
                label="Фотография фасада / интерьера"
                placeholder="/images/store-maykop.jpg или https://..."
                aspectRatio="video"
              />

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#8E8276]">
                  Описание локации
                </label>
                <textarea
                  rows={2}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Флагманское пространство ТАВ с кофейней, дегустационной зоной..."
                  className="w-full rounded-xl bg-white/[0.03] border border-white/10 p-3 text-xs text-[#C4B9AD] resize-none focus:outline-none focus:border-[#D9A76A] leading-relaxed"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2.5 cursor-pointer text-xs text-white p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <input
                    type="checkbox"
                    checked={formIsMain}
                    onChange={(e) => setFormIsMain(e.target.checked)}
                    className="rounded bg-white/10 border-white/20 text-[#D9A76A] focus:ring-0"
                  />
                  <div>
                    <span className="font-bold text-[#D9A76A]">Главный магазин (Флагман)</span>
                    <span className="text-[10px] text-[#8E8276] block">
                      Будет отображаться в шапке, футере и на главной странице по умолчанию.
                    </span>
                  </div>
                </label>
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
                  <span>{saving ? 'Сохранение...' : isCreating ? 'Создать магазин' : 'Сохранить изменения'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deletingStore && (
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
                  Удаление локации
                </h3>
                <p className="text-xs font-mono text-[#8E8276]">
                  "{deletingStore.name}"
                </p>
              </div>
            </div>

            {stores.length <= 1 ? (
              <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-500/30 text-xs text-rose-200 leading-relaxed">
                <p className="font-bold">⚠️ Запрещено удалять единственный магазин в системе.</p>
                <p className="text-rose-300/80 mt-1">В каталоге должна оставаться как минимум одна рабочая точка.</p>
              </div>
            ) : deletingStore.isMain ? (
              <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-500/30 text-xs text-rose-200 leading-relaxed">
                <p className="font-bold">⚠️ Запрещено удалять главный флагманский магазин.</p>
                <p className="text-rose-300/80 mt-1">Сначала назначьте другой магазин главным, после чего этот магазин можно будет удалить.</p>
              </div>
            ) : (
              <p className="text-xs text-[#C4B9AD] leading-relaxed">
                Вы уверены, что хотите удалить магазин <b>"{deletingStore.name}"</b>?
              </p>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeletingStore(null)}
                className="px-4 py-2 rounded-xl border border-white/10 hover:bg-white/5 text-xs text-[#C4B9AD] cursor-pointer"
              >
                Отмена
              </button>
              {!deletingStore.isMain && stores.length > 1 && (
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
