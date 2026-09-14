'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  CheckCircle2,
  Store,
  Package,
  Phone,
  User,
  MessageSquare,
  Loader2,
  Sparkles,
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  Flame,
  Coffee,
  ArrowRight,
  RotateCcw,
  Clock,
  MapPin,
  ShieldCheck,
} from 'lucide-react';
import { useCart } from './InquiryContext';
import { formatPrice, formatWeight } from '@/lib/utils';

const inquirySchema = z.object({
  customerName: z.string().min(2, 'Пожалуйста, введите ваше имя (минимум 2 буквы)'),
  customerPhone: z
    .string()
    .min(10, 'Введите корректный номер телефона (минимум 10 цифр)')
    .regex(/^[+0-9\s()-]+$/, 'Некорректный формат телефона'),
  agreePolicy: z.literal(true, {
    errorMap: () => ({
      message: 'Необходимо подтвердить согласие с политикой обработки данных',
    }),
  }),
  comment: z.string().optional(),
});

type InquiryFormValues = z.infer<typeof inquirySchema>;

export function InquiryModal() {
  const {
    isOpen,
    items,
    totalCount,
    totalPrice,
    updateQuantity,
    removeFromCart,
    clearCart,
    closeCart,
  } = useCart();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  // Stores loaded from DB
  const [dbStore, setDbStore] = useState<{ id: string; name: string; address: string } | null>(null);
  useEffect(() => {
    fetch('/api/stores')
      .then((r) => r.json())
      .then((data) => {
        if (data.stores && data.stores.length > 0) setDbStore(data.stores[0]);
      })
      .catch(() => {});
  }, []);
  const [completedOrder, setCompletedOrder] = useState<{
    orderNumber: string;
    items: typeof items;
    totalPrice: number;
    customerName: string;
    customerPhone: string;
    storeName: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InquiryFormValues>({
    resolver: zodResolver(inquirySchema),
    defaultValues: {
      customerName: '',
      customerPhone: '',
      agreePolicy: false as unknown as true,
      comment: '',
    },
  });

  const onSubmit = async (data: InquiryFormValues) => {
    if (items.length === 0) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/inquiries/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: data.customerName,
          customerPhone: data.customerPhone,
          customerComment: data.comment,
          storeId: dbStore?.id || null,
          items: items.map((item) => ({
            productId: item.product.id,
            productTitle: item.product.title,
            price: item.product.price,
            quantity: item.quantity,
            grindType: item.grindOption || null,
          })),
        }),
      });

      const responseData = await res.json();
      if (!res.ok) throw new Error(responseData.error || 'Ошибка оформления');

      const orderNumber = responseData.inquiry?.orderNumber || `TAV-${Math.floor(100000 + Math.random() * 900000)}`;

      setCompletedOrder({
        orderNumber,
        items: [...items],
        totalPrice,
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        storeName: dbStore?.name || 'Пространство ТАВ',
      });

      setIsSuccess(true);
      clearCart();
    } catch (error) {
      console.error('Failed to submit order:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    closeCart();
    if (isSuccess) {
      setTimeout(() => {
        setIsSuccess(false);
        setCompletedOrder(null);
        reset();
      }, 300);
    }
  };

  const hasCoffee = items.some((i) => i.product.category === 'coffee');

  // Lock background body scroll when drawer is open
  React.useEffect(() => {
    if (!isOpen) return;

    const prevBodyOverflow = document.body.style.overflow;
    const prevBodyTouch = document.body.style.touchAction;
    const prevHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = 'hidden';
    document.body.style.touchAction = 'none';
    document.documentElement.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = prevBodyOverflow;
      document.body.style.touchAction = prevBodyTouch;
      document.documentElement.style.overflow = prevHtmlOverflow;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-[80] flex items-center justify-end"
        data-lenis-prevent="true"
      >
        {/* Dark Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
          data-lenis-prevent="true"
        />

        {/* Sliding Cart Panel (Slide-in Drawer) */}
        <motion.div
          initial={{ opacity: 0, x: '100%' }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          className="relative w-full max-w-xl h-full bg-[#120C09] shadow-[0_0_80px_rgba(0,0,0,0.9)] border-l border-white/15 z-10 text-white flex flex-col justify-between overflow-hidden"
          data-lenis-prevent="true"
        >
          {/* 1. DRAWER HEADER */}
          <div className="flex items-center justify-between border-b border-white/10 px-4 sm:px-6 py-4 sm:py-5 bg-[#17100B] flex-shrink-0">
            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
              <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl sm:rounded-2xl bg-[#B88B58]/15 border border-[#B88B58]/30 flex items-center justify-center text-[#D9A76A] flex-shrink-0">
                <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-bold text-white font-serif whitespace-nowrap">
                    Корзина
                  </h2>
                  {totalCount > 0 && !isSuccess && (
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-mono font-bold bg-[#B88B58] text-[#0E0A08] whitespace-nowrap">
                      {totalCount} {totalCount === 1 ? 'товар' : totalCount < 5 ? 'товара' : 'товаров'}
                    </span>
                  )}
                </div>
                <p className="text-[11px] sm:text-xs text-[#8E8276] truncate">
                  {isSuccess
                    ? 'Заказ успешно подтвержден'
                    : 'Бронирование и самовывоз в Майкопе'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
              {items.length > 0 && !isSuccess && (
                <button
                  type="button"
                  onClick={clearCart}
                  className="flex items-center gap-1 p-2 sm:px-2.5 sm:py-1.5 rounded-xl text-xs font-semibold text-[#8E8276] hover:text-red-400 hover:bg-white/5 transition-all cursor-pointer"
                  title="Очистить корзину"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Очистить</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleClose}
                className="rounded-xl p-2 text-[#8E8276] hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                aria-label="Закрыть корзину"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* 2. DRAWER BODY */}
          <div
            className="flex-1 overflow-y-auto overscroll-contain p-4 sm:p-6 space-y-5 sm:space-y-6"
            data-lenis-prevent="true"
            onWheel={(e) => e.stopPropagation()}
          >
            {isSuccess && completedOrder ? (
              /* ======================================================== */
              /* SUCCESS ORDER RECEIPT SCREEN                             */
              /* ======================================================== */
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6 py-4"
              >
                {/* Glowing Success Badge */}
                <div className="text-center space-y-3">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-500/40 shadow-[0_0_30px_rgba(16,185,129,0.35)]">
                    <CheckCircle2 className="h-8 w-8" />
                  </div>
                  <h3 className="text-2xl font-bold font-serif text-white">
                    Заказ #{completedOrder.orderNumber} оформлен!
                  </h3>
                  <p className="text-xs sm:text-sm text-[#C4B9AD] max-w-md mx-auto leading-relaxed">
                    Спасибо, <span className="text-white font-semibold">{completedOrder.customerName}</span>! Мы уже начали готовить ваш кофе в пространстве ТАВ.
                  </p>
                </div>

                {/* Pickup Instructions Box */}
                <div className="p-4 rounded-2xl bg-[#1A130E] border border-emerald-500/30 space-y-2.5 text-xs">
                  <div className="flex items-center justify-between text-emerald-400 font-bold">
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4" />
                      <span>Готовность к выдаче: 15 минут</span>
                    </span>
                    <span className="font-mono">{formatPrice(completedOrder.totalPrice)}</span>
                  </div>

                  <div className="pt-2 border-t border-white/10 space-y-1 text-[#8E8276]">
                    <div className="flex items-center gap-1.5 text-white">
                      <MapPin className="h-3.5 w-3.5 text-[#D9A76A]" />
                      <span>г. Майкоп, ул. К.А. Васильева, 2/1</span>
                    </div>
                    <div>Телефон магазина: +7 (900) 280-00-11 • Режим: 08:30 – 20:30</div>
                  </div>
                </div>

                {/* Order Items Breakdown */}
                <div className="space-y-3 pt-2">
                  <span className="text-xs font-mono uppercase tracking-wider text-[#8E8276] block">
                    Состав заказа:
                  </span>
                  <div className="space-y-2">
                    {completedOrder.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/10 text-xs"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="font-bold text-[#D9A76A] font-mono">
                            {item.quantity}x
                          </span>
                          <span className="text-white truncate max-w-[240px]">
                            {item.product.title}
                          </span>
                          {item.grindOption && (
                            <span className="text-[10px] text-[#8E8276]">
                              ({item.grindOption})
                            </span>
                          )}
                        </div>
                        <span className="font-bold text-white font-serif whitespace-nowrap ml-2">
                          {formatPrice(item.product.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="w-full flex items-center justify-center gap-2 rounded-2xl bg-[#B88B58] text-[#0E0A08] py-4 text-sm font-bold shadow-lg hover:bg-[#CBA06E] transition-all cursor-pointer"
                  >
                    <span>Отлично, продолжить покупки</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            ) : items.length === 0 ? (
              /* ======================================================== */
              /* EMPTY CART STATE                                         */
              /* ======================================================== */
              <div className="py-20 text-center space-y-4">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-white/[0.04] border border-white/10 text-[#8E8276]">
                  <ShoppingBag className="h-10 w-10 opacity-50" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-bold font-serif text-white">
                    Ваша корзина пуста
                  </h3>
                  <p className="text-xs sm:text-sm text-[#8E8276] max-w-xs mx-auto">
                    Добавьте свежеобжаренный кофе, дрип-пакеты или аксессуары из каталога ТАВ.
                  </p>
                </div>
                <div className="pt-2">
                  <Link
                    href="/catalog"
                    onClick={handleClose}
                    className="inline-flex items-center gap-2 rounded-2xl bg-[#B88B58] text-[#0E0A08] px-6 py-3 text-xs font-bold shadow-md hover:bg-[#CBA06E] transition-all cursor-pointer"
                  >
                    <span>Перейти в каталог</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            ) : (
              /* ======================================================== */
              /* ACTIVE MULTI-ITEM CART LIST                              */
              /* ======================================================== */
              <div className="space-y-5">
                {/* 1. Items List */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-[#8E8276]">
                    <span>Выбранные позиции ({items.length})</span>
                    <span>Сумма</span>
                  </div>

                  <div className="space-y-2.5">
                    {items.map((item) => (
                      <div
                        key={`${item.product.id}-${item.grindOption || 'default'}`}
                        className="p-3.5 sm:p-4 rounded-2xl bg-[#17100B] border border-white/10 hover:border-white/20 transition-all space-y-3"
                      >
                        {/* Top Row: Image + Title/Badges + Delete */}
                        <div className="flex items-start gap-3">
                          {/* Image */}
                          <div className="relative h-14 w-14 sm:h-16 sm:w-16 rounded-xl overflow-hidden bg-black/40 border border-white/10 flex-shrink-0">
                            {item.product.images[0] ? (
                              <Image
                                src={item.product.images[0]}
                                alt={item.product.title}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <Package className="h-6 w-6 m-auto text-[#8E8276]" />
                            )}
                          </div>

                          {/* Title & Details */}
                          <div className="flex-1 min-w-0 space-y-1">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-[10px] font-bold text-[#D9A76A] uppercase tracking-wider">
                                {item.product.categoryName || item.product.category}
                              </span>
                              {item.product.coffeeSpecs?.roastLevel && (
                                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-600/20 text-amber-300 border border-amber-500/30">
                                  ☕ {item.product.coffeeSpecs.roastLevel === 'light' ? 'Светлая' : item.product.coffeeSpecs.roastLevel === 'medium' ? 'Средняя' : 'Тёмная'}
                                </span>
                              )}
                              {item.product.coffeeSpecs?.qScore && (
                                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-[#E5CBA8] border border-amber-500/30">
                                  Q {item.product.coffeeSpecs.qScore}
                                </span>
                              )}
                            </div>

                            <h4 className="text-xs sm:text-sm font-bold text-white leading-snug">
                              <Link
                                href={`/product/${item.product.slug}`}
                                onClick={handleClose}
                                className="hover:text-[#D9A76A] transition-colors"
                              >
                                {item.product.title}
                              </Link>
                            </h4>

                            {item.grindOption && (
                              <div className="text-[11px] text-[#A89D91]">
                                Помол: <span className="text-white font-medium">{item.grindOption}</span>
                              </div>
                            )}
                          </div>

                          {/* Delete Item Button */}
                          <button
                            type="button"
                            onClick={() => removeFromCart(item.product.id, item.grindOption)}
                            className="p-1 rounded-lg text-[#8E8276] hover:text-red-400 hover:bg-white/5 transition-colors cursor-pointer flex-shrink-0"
                            title="Удалить позицию"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>

                        {/* Bottom Row: Stepper & Price */}
                        <div className="flex items-center justify-between pt-2 border-t border-white/5">
                          {/* Quantity Stepper */}
                          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/40 border border-white/10">
                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(
                                  item.product.id,
                                  item.quantity - 1,
                                  item.grindOption
                                )
                              }
                              className="h-6 w-6 rounded-lg bg-white/5 hover:bg-white/15 flex items-center justify-center text-[#C4B9AD] hover:text-white transition-colors cursor-pointer active:scale-95"
                              title="Уменьшить"
                            >
                              <Minus className="h-3 w-3" />
                            </button>

                            <span className="font-mono text-xs font-bold text-white px-2 min-w-[20px] text-center">
                              {item.quantity}
                            </span>

                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(
                                  item.product.id,
                                  item.quantity + 1,
                                  item.grindOption
                                )
                              }
                              className="h-6 w-6 rounded-lg bg-white/5 hover:bg-white/15 flex items-center justify-center text-[#C4B9AD] hover:text-white transition-colors cursor-pointer active:scale-95"
                              title="Увеличить"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>

                          {/* Price */}
                          <div className="text-right">
                            <span className="text-sm sm:text-base font-bold font-serif text-white">
                              {formatPrice(item.product.price * item.quantity)}
                            </span>
                            {item.quantity > 1 && (
                              <div className="text-[10px] text-[#8E8276] font-mono">
                                {formatPrice(item.product.price)} / шт.
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. Free In-store Grinding Hint (if coffee is in cart) */}
                {hasCoffee && (
                  <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-[#E5CBA8] flex items-center gap-2.5">
                    <Sparkles className="h-4 w-4 text-[#D9A76A] flex-shrink-0" />
                    <span>
                      В корзине есть зерновой кофе: мы бесплатно смолем зерно на итальянских жерновах Fiorenzato в магазине прямо перед выдачей.
                    </span>
                  </div>
                )}

                {/* 3. Fast Store Reservation Form */}
                <form
                  id="checkout-form"
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-4 pt-3 border-t border-white/10"
                >
                  <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-[#E5CBA8]">
                    <Store className="h-4 w-4 text-[#D9A76A] flex-shrink-0" />
                    <span>Бронирование и самовывоз</span>
                  </div>

                  {/* Name field */}
                  <div>
                    <label className="block text-[11px] font-bold text-[#8E8276] uppercase tracking-wider mb-1.5">
                      Ваше имя *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8E8276]" />
                      <input
                        {...register('customerName')}
                        type="text"
                        placeholder="Как к вам обращаться?"
                        className="w-full rounded-2xl border border-white/15 bg-[#17100B] py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-[#8E8276] focus:border-[#B88B58] focus:outline-none transition-all"
                      />
                    </div>
                    {errors.customerName && (
                      <p className="mt-1 text-xs text-red-400">
                        {errors.customerName.message}
                      </p>
                    )}
                  </div>

                  {/* Phone field */}
                  <div>
                    <label className="block text-[11px] font-bold text-[#8E8276] uppercase tracking-wider mb-1.5">
                      Телефон для связи *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8E8276]" />
                      <input
                        {...register('customerPhone')}
                        type="tel"
                        placeholder="+7 (___) ___-__-__"
                        className="w-full rounded-2xl border border-white/15 bg-[#17100B] py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-[#8E8276] focus:border-[#B88B58] focus:outline-none transition-all"
                      />
                    </div>
                    {errors.customerPhone && (
                      <p className="mt-1 text-xs text-red-400">
                        {errors.customerPhone.message}
                      </p>
                    )}
                  </div>

                  {/* Static Store Info (Единственный магазин в Майкопе) */}
                  <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="h-8 w-8 rounded-xl bg-[#B88B58]/15 border border-[#B88B58]/30 flex items-center justify-center text-[#D9A76A] flex-shrink-0">
                        <MapPin className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-white truncate">Пространство ТАВ (самовывоз)</div>
                        <div className="text-[11px] text-[#8E8276] truncate">г. Майкоп, ул. К.А. Васильева, 2/1 • 08:30–20:30</div>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-semibold border border-emerald-500/30 whitespace-nowrap flex-shrink-0">
                      15 мин
                    </span>
                  </div>

                  {/* Comment / Question */}
                  <div>
                    <label className="block text-[11px] font-bold text-[#8E8276] uppercase tracking-wider mb-1.5">
                      Пожелания к заказу (необязательно)
                    </label>
                    <div className="relative">
                      <MessageSquare className="absolute left-3.5 top-3 h-4 w-4 text-[#8E8276]" />
                      <textarea
                        {...register('comment')}
                        rows={2}
                        placeholder="Степень помола кофе, удобное время самовывоза..."
                        className="w-full rounded-2xl border border-white/15 bg-[#17100B] py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-[#8E8276] focus:border-[#B88B58] focus:outline-none transition-all resize-none"
                      />
                    </div>
                  </div>

                  {/* Mandatory Privacy Policy Checkbox */}
                  <div className="pt-1">
                    <label className="flex items-start gap-2.5 cursor-pointer select-none group">
                      <input
                        {...register('agreePolicy')}
                        type="checkbox"
                        className="mt-0.5 h-4 w-4 rounded border-white/20 bg-[#17100B] text-[#B88B58] focus:ring-[#B88B58] focus:ring-offset-0 cursor-pointer transition-colors flex-shrink-0"
                      />
                      <span className="text-xs text-[#A89D91] leading-snug group-hover:text-white transition-colors">
                        Отправляя заявку, я даю согласие на обработку персональных данных и подтверждаю, что ознакомлен(а) с{' '}
                        <Link
                          href="/privacy"
                          target="_blank"
                          className="text-[#D9A76A] hover:underline underline-offset-2 font-medium"
                          onClick={(e) => e.stopPropagation()}
                        >
                          политикой обработки
                        </Link>
                        .
                      </span>
                    </label>
                    {errors.agreePolicy && (
                      <p className="mt-1.5 text-xs text-red-400 font-medium">
                        {errors.agreePolicy.message}
                      </p>
                    )}
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* 3. DRAWER FOOTER (Summary & Submit CTA) */}
          {items.length > 0 && !isSuccess && (
            <div className="border-t border-white/10 p-6 bg-[#17100B] space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#8E8276]">Итого к оплате:</span>
                <span className="text-2xl font-black text-white font-serif">
                  {formatPrice(totalPrice)}
                </span>
              </div>

              <button
                type="submit"
                form="checkout-form"
                disabled={isSubmitting}
                className="w-full flex items-center justify-between rounded-2xl bg-gradient-to-r from-[#C2905A] via-[#D9A76A] to-[#E5CBA8] hover:from-[#B8854F] hover:to-[#D9A76A] text-[#0E0A08] p-4 text-sm sm:text-base font-bold shadow-xl shadow-amber-950/60 hover:shadow-amber-600/30 transition-all cursor-pointer disabled:opacity-50 group"
              >
                <div className="flex items-center gap-2.5">
                  {isSubmitting ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <ShoppingBag className="h-5 w-5" />
                  )}
                  <span>
                    {isSubmitting
                      ? 'Оформление брони...'
                      : `Забронировать в магазине (${totalCount})`}
                  </span>
                </div>

                <div className="flex items-center gap-2 font-mono text-sm">
                  <span>{formatPrice(totalPrice)}</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-[#8E8276]">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                <span>Оплата при получении в магазине после проверки</span>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
