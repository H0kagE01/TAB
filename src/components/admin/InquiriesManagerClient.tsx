'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  ShoppingBag,
  Phone,
  MessageSquare,
  Clock,
  MapPin,
  Coffee,
  CheckCircle2,
  AlertCircle,
  Trash2,
  Send,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface InquiryItemRow {
  id: string;
  productTitle: string;
  price: number;
  quantity: number;
  grindType: string | null;
  images: string[];
}

export interface InquiryRow {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerComment: string | null;
  grindType: string | null;
  storeName: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  items: InquiryItemRow[];
}

export function InquiriesManagerClient({
  initialInquiries,
}: {
  initialInquiries: InquiryRow[];
}) {
  const [inquiries, setInquiries] = useState<InquiryRow[]>(initialInquiries);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  // Change Status
  const handleStatusChange = async (inquiryId: string, newStatus: string) => {
    setInquiries((prev) =>
      prev.map((inq) => (inq.id === inquiryId ? { ...inq, status: newStatus } : inq))
    );

    try {
      const res = await fetch(`/api/admin/inquiries/${inquiryId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error();
      showToast('success', 'Статус заявки обновлен');
    } catch {
      showToast('error', 'Не удалось обновить статус');
    }
  };

  // Delete Inquiry
  const handleDelete = async (inquiryId: string, orderNumber: string) => {
    if (!confirm(`Удалить заявку #${orderNumber}?`)) return;

    try {
      const res = await fetch(`/api/admin/inquiries/${inquiryId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      setInquiries((prev) => prev.filter((inq) => inq.id !== inquiryId));
      showToast('success', `Заявка #${orderNumber} удалена`);
    } catch {
      showToast('error', 'Ошибка при удалении');
    }
  };

  const filtered = inquiries.filter((inq) => {
    if (filterStatus === 'all') return true;
    return inq.status === filterStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'NEW':
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
      case 'IN_PROGRESS':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      case 'COMPLETED':
        return 'bg-stone-500/15 text-stone-300 border-stone-500/30';
      case 'CANCELLED':
        return 'bg-rose-500/15 text-rose-400 border-rose-500/30';
      default:
        return 'bg-white/10 text-white';
    }
  };

  return (
    <div className="space-y-6">
      
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
            <ShoppingBag className="h-3.5 w-3.5" />
            <span>Заказы клиентов</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-serif text-white mt-1">
            Заявки и Корзина
          </h1>
          <p className="text-xs text-[#8E8276] mt-1">
            Всего заявок: {inquiries.length} • Новых: {inquiries.filter((i) => i.status === 'NEW').length}
          </p>
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {[
            { key: 'all', label: 'Все' },
            { key: 'NEW', label: 'Новые' },
            { key: 'IN_PROGRESS', label: 'В работе' },
            { key: 'COMPLETED', label: 'Выполнены' },
            { key: 'CANCELLED', label: 'Отменены' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilterStatus(tab.key)}
              className={cn(
                'px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border',
                filterStatus === tab.key
                  ? 'bg-[#D9A76A] text-[#0E0A08] font-bold border-[#D9A76A]'
                  : 'bg-[#140E0B] border-white/10 text-[#C4B9AD] hover:text-white'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Inquiries Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.length === 0 ? (
          <div className="md:col-span-2 p-12 text-center text-xs text-[#8E8276] rounded-3xl bg-[#140E0B] border border-white/10">
            Заявки с выбранным статусом отсутствуют.
          </div>
        ) : (
          filtered.map((inq) => {
            const rawPhone = inq.customerPhone.replace(/[^0-9]/g, '');

            return (
              <div
                key={inq.id}
                className="rounded-3xl bg-[#140E0B] border border-white/10 p-5 sm:p-6 space-y-5 shadow-xl hover:border-[#D9A76A]/40 transition-all flex flex-col justify-between"
              >
                <div className="space-y-4">
                  {/* Card Header: Order #, Time, Status Select */}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-base font-black font-mono text-[#D9A76A]">
                          #{inq.orderNumber}
                        </span>
                        <span
                          className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${getStatusBadge(
                            inq.status
                          )}`}
                        >
                          {inq.status === 'NEW'
                            ? 'Новая заявка'
                            : inq.status === 'IN_PROGRESS'
                            ? 'В работе'
                            : inq.status === 'COMPLETED'
                            ? 'Выполнен'
                            : 'Отменен'}
                        </span>
                      </div>
                      <div className="text-[11px] font-mono text-[#8E8276] flex items-center gap-1.5 mt-1">
                        <Clock className="h-3 w-3" />
                        <span>
                          {new Date(inq.createdAt).toLocaleString('ru-RU', {
                            day: 'numeric',
                            month: 'long',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    </div>

                    {/* Status dropdown */}
                    <select
                      value={inq.status}
                      onChange={(e) => handleStatusChange(inq.id, e.target.value)}
                      className="rounded-xl bg-[#1C1410] border border-white/10 py-1.5 px-2.5 text-xs text-white focus:outline-none focus:border-[#D9A76A]"
                    >
                      <option value="NEW">Новая</option>
                      <option value="IN_PROGRESS">В работе</option>
                      <option value="COMPLETED">Выполнен</option>
                      <option value="CANCELLED">Отменен</option>
                    </select>
                  </div>

                  {/* Customer Info Box */}
                  <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                    <div className="text-sm font-bold text-white flex items-center justify-between">
                      <span>{inq.customerName}</span>
                      <span className="font-mono text-sm text-[#D9A76A]">
                        {inq.totalAmount.toLocaleString('ru-RU')} ₽
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 pt-1">
                      <a
                        href={`tel:${inq.customerPhone}`}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-white hover:text-[#D9A76A] transition-colors"
                      >
                        <Phone className="h-3.5 w-3.5 text-[#D9A76A]" />
                        <span>{inq.customerPhone}</span>
                      </a>

                      <a
                        href={`https://wa.me/${rawPhone}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 hover:underline"
                      >
                        <Send className="h-3 w-3" />
                        <span>WhatsApp</span>
                      </a>
                    </div>

                    {inq.customerComment && (
                      <div className="text-xs text-[#C4B9AD] pt-1.5 border-t border-white/5 flex items-start gap-2">
                        <MessageSquare className="h-3.5 w-3.5 text-[#8E8276] shrink-0 mt-0.5" />
                        <span className="italic">«{inq.customerComment}»</span>
                      </div>
                    )}
                  </div>

                  {/* Items List */}
                  <div className="space-y-2">
                    <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#8E8276]">
                      Состав заказа ({inq.items.length}):
                    </div>
                    <div className="space-y-1.5 divide-y divide-white/5">
                      {inq.items.map((item) => (
                        <div
                          key={item.id}
                          className="pt-1.5 first:pt-0 flex items-center justify-between gap-3 text-xs"
                        >
                          <div className="min-w-0">
                            <div className="font-medium text-white truncate">
                              {item.productTitle}
                            </div>
                            {item.grindType && (
                              <div className="text-[10px] text-[#D9A76A] font-mono">
                                Помол: {item.grindType}
                              </div>
                            )}
                          </div>
                          <div className="font-mono text-stone-300 text-right shrink-0">
                            <span>{item.quantity} шт.</span> ×{' '}
                            <span>{item.price.toLocaleString('ru-RU')} ₽</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Footer: Location & Delete */}
                <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs text-[#8E8276]">
                  <span className="flex items-center gap-1.5 text-[11px]">
                    <MapPin className="h-3 w-3 text-[#D9A76A]" />
                    <span>{inq.storeName}</span>
                  </span>

                  <button
                    onClick={() => handleDelete(inq.id, inq.orderNumber)}
                    className="p-1.5 rounded-lg text-stone-500 hover:text-rose-400 hover:bg-rose-950/30 transition-colors cursor-pointer"
                    title="Удалить заявку"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
