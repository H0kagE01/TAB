'use client';

import React, { useState } from 'react';
import {
  Settings,
  Save,
  Phone,
  Send,
  Mail,
  Globe,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  FileText,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function SettingsClient({ initialSettings }: { initialSettings: any }) {
  const [siteName, setSiteName] = useState(initialSettings?.siteName || 'ТАВ Coffee');
  const [siteTagline, setSiteTagline] = useState(
    initialSettings?.siteTagline || 'Спешелти кофе свежей обжарки'
  );
  const [mainPhone, setMainPhone] = useState(
    initialSettings?.mainPhone || '+7 (988) 163-71-41'
  );
  const [telegramUrl, setTelegramUrl] = useState(
    initialSettings?.telegramUrl || 'https://t.me/tav_coffee'
  );
  const [whatsappUrl, setWhatsappUrl] = useState(
    initialSettings?.whatsappUrl || 'https://wa.me/79881637141'
  );
  const [email, setEmail] = useState(initialSettings?.email || 'info@tav-coffee.ru');
  const [footerText, setFooterText] = useState(
    initialSettings?.footerText || 'Спешелти кофе свежей обжарки в Майкопе.'
  );
  const [seoTitle, setSeoTitle] = useState(
    initialSettings?.defaultSeo?.title || 'ТАВ — Спешелти кофе свежей обжарки'
  );
  const [seoDesc, setSeoDesc] = useState(
    initialSettings?.defaultSeo?.description || 'Отборный спешелти кофе со всего мира в Майкопе.'
  );

  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null
  );

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          siteName,
          siteTagline,
          mainPhone,
          telegramUrl,
          whatsappUrl,
          email,
          footerText,
          defaultSeo: {
            title: seoTitle,
            description: seoDesc,
          },
        }),
      });

      if (!res.ok) throw new Error();
      showToast('success', 'Настройки сайта успешно сохранены!');
    } catch {
      showToast('error', 'Ошибка при сохранении настроек');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-8 pb-20 max-w-4xl">
      
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

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-[#D9A76A]">
            <Settings className="h-3.5 w-3.5" />
            <span>Конфигурация сайта</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-serif text-white mt-1">
            Глобальные настройки
          </h1>
          <p className="text-xs text-[#8E8276] mt-1">
            Контакты, мессенджеры, тексты подвала и SEO по умолчанию
          </p>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#C2905A] via-[#D9A76A] to-[#E5CBA8] hover:brightness-105 active:scale-95 text-[#0E0A08] text-xs font-bold transition-all shadow-[0_0_20px_rgba(217,167,106,0.35)] cursor-pointer disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          <span>{saving ? 'Сохранение...' : 'Сохранить настройки'}</span>
        </button>
      </div>

      <div className="space-y-6">
        
        {/* Card 1: Brand & Site Info */}
        <div className="p-6 sm:p-7 rounded-3xl bg-[#140E0B] border border-white/10 space-y-5 shadow-xl">
          <h2 className="text-base font-bold font-serif text-white flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[#D9A76A]" />
            <span>Название и бренд</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-[#C4B9AD]">
                Название сайта
              </label>
              <input
                type="text"
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                className="w-full rounded-xl bg-[#1C1410] border border-white/10 py-2.5 px-3 text-xs text-white focus:outline-none focus:border-[#D9A76A]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-[#C4B9AD]">
                Слоган / Дескриптор
              </label>
              <input
                type="text"
                value={siteTagline}
                onChange={(e) => setSiteTagline(e.target.value)}
                className="w-full rounded-xl bg-[#1C1410] border border-white/10 py-2.5 px-3 text-xs text-white focus:outline-none focus:border-[#D9A76A]"
              />
            </div>
          </div>
        </div>

        {/* Card 2: Contacts & Messengers */}
        <div className="p-6 sm:p-7 rounded-3xl bg-[#140E0B] border border-white/10 space-y-5 shadow-xl">
          <h2 className="text-base font-bold font-serif text-white flex items-center gap-2">
            <Phone className="h-4 w-4 text-[#D9A76A]" />
            <span>Контакты и Мессенджеры</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-[#C4B9AD]">
                Основной телефон
              </label>
              <input
                type="text"
                value={mainPhone}
                onChange={(e) => setMainPhone(e.target.value)}
                placeholder="+7 (988) 163-71-41"
                className="w-full rounded-xl bg-[#1C1410] border border-white/10 py-2.5 px-3 text-xs text-white focus:outline-none focus:border-[#D9A76A]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-[#C4B9AD]">
                Контактный Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="info@tav-coffee.ru"
                className="w-full rounded-xl bg-[#1C1410] border border-white/10 py-2.5 px-3 text-xs text-white focus:outline-none focus:border-[#D9A76A]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-[#C4B9AD]">
                Telegram (ссылка на канал / бота)
              </label>
              <input
                type="text"
                value={telegramUrl}
                onChange={(e) => setTelegramUrl(e.target.value)}
                placeholder="https://t.me/tav_coffee"
                className="w-full rounded-xl bg-[#1C1410] border border-white/10 py-2.5 px-3 text-xs text-white focus:outline-none focus:border-[#D9A76A]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-[#C4B9AD]">
                WhatsApp (ссылка для связи)
              </label>
              <input
                type="text"
                value={whatsappUrl}
                onChange={(e) => setWhatsappUrl(e.target.value)}
                placeholder="https://wa.me/79881637141"
                className="w-full rounded-xl bg-[#1C1410] border border-white/10 py-2.5 px-3 text-xs text-white focus:outline-none focus:border-[#D9A76A]"
              />
            </div>
          </div>
        </div>

        {/* Card 3: Footer Text */}
        <div className="p-6 sm:p-7 rounded-3xl bg-[#140E0B] border border-white/10 space-y-5 shadow-xl">
          <h2 className="text-base font-bold font-serif text-white flex items-center gap-2">
            <FileText className="h-4 w-4 text-[#D9A76A]" />
            <span>Текст в подвале (Footer)</span>
          </h2>

          <div className="space-y-1.5">
            <label className="text-xs font-mono font-bold uppercase tracking-wider text-[#C4B9AD]">
              Описание бренда в подвале
            </label>
            <textarea
              rows={3}
              value={footerText}
              onChange={(e) => setFooterText(e.target.value)}
              className="w-full rounded-xl bg-[#1C1410] border border-white/10 p-3 text-xs text-white leading-relaxed focus:outline-none focus:border-[#D9A76A]"
            />
          </div>
        </div>

      </div>

    </form>
  );
}
